
import {Component, OnInit, ElementRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

//Loading services
import {UserService} from "../../services/user.service";
import {AlbumService} from "../../services/album.service";
import {SongService} from "../../services/song.service";
import {MusicPlayerService} from "../../services/music-player.service";

//Loading models
import {Artist} from "../../models/artist.model";
import {Album} from "../../models/album.model";
import {Song} from "../../models/song.model";

declare var $:any;

@Component({
    selector: "app-album-detail",
    templateUrl: "./album-detail.component.html"
})
export class AlbumDetailComponent implements OnInit {
    private isAdmin: boolean;
    private artist: Artist;
    private album: Album;
    private songs: Array<Song>;
    private errorMessage: string;
    private songIdDelete: string;

    constructor(private activatedRoute: ActivatedRoute,
                private el: ElementRef,
                private userService: UserService,
                private albumService: AlbumService,
                private songService: SongService,
                private musicPlayerService: MusicPlayerService) {

    };

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();

        this.activatedRoute.params.forEach(params => {
            this.albumService.getById(params.id).subscribe(res => {
                this.artist = new Artist(
                    res.album.artist._id,
                    res.album.artist.name,
                    res.album.artist.description,
                    res.album.artist.image
                );

                this.album = new Album(
                    res.album._id,
                    res.album.title,
                    res.album.description,
                    res.album.year,
                    res.album.image,
                    res.album.artist._id
                );

                this.loadSongs();
            }, err => console.error(err));
        });
    };

    //Function for loading all songs which belong to the album.
    private loadSongs(): void {
        this.songs = [];

        this.songService.getSongs(this.album.id).subscribe(res => {
            for (let item of res.songs) {
                let song: Song = new Song(
                    item._id,
                    item.number,
                    item.name,
                    item.duration,
                    item.file,
                    item.album._id
                );

                this.songs.push(song);
            }
        }, err => {
            console.error(err);

            if (err.status === 404) {
                this.errorMessage = "There is not any album to show";
            }
        });
    };

    //Function for showing up the confirm delete message.
    private showConfirmAlert(id: string): void {
        this.songIdDelete = id;

        $(this.el.nativeElement.querySelector("#myModal")).modal();
    };

    //Function for deleting the song selected and reload the song list.
    private deleteSong(): void {
        $(this.el.nativeElement.querySelector("#myModal")).modal("hide");

        if (this.songIdDelete) {
            this.songService.delete(this.songIdDelete).subscribe(res => {
                this.loadSongs();
                this.musicPlayerService.deleteSong(this.songIdDelete);
            }, err => {
                let data: any = JSON.parse(err._body);
                this.errorMessage = data.message;

                console.error(err);
            });
        }
    };

    private playSong(song: Song): void {
        if (this.musicPlayerService.song && this.musicPlayerService.song.id === song.id) {
            this.musicPlayerService.changeStatus();
        } else {
            this.musicPlayerService.setMusicAndPlay(this.artist, this.album, song);
        }
    };
};
