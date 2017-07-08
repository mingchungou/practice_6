
import {Injectable} from "@angular/core";

//Loading services
import {AlbumService} from "./album.service";
import {SongService} from "./song.service";

//Loading models
import {Artist} from "../models/artist.model";
import {Album} from "../models/album.model";
import {Song} from "../models/song.model";

@Injectable()
export class MusicPlayerService {
    public artist: Artist;
    public album: Album;
    public song: Song;
    public playerElem: any;
    public isPlaying: boolean = false;
    public albumImagePath: string = "assets/img/non-image.jpg";
    public songPath: string = "";

    constructor(private albumService: AlbumService,
                private songService: SongService) {

        if (localStorage.getItem("sound-song")) {
            let playerData = JSON.parse(localStorage.getItem("sound-song"));

            this.artist = playerData.artist;
            this.album = playerData.album;
            this.song = playerData.song;
            this.albumImagePath = this.albumService.getImage(this.album);
            this.songPath = this.songService.getSong(this.song);
        }
    };

    //Function for storing current song data to localStorage.
    private storeMusicData(): void {
        localStorage.setItem("sound-song", JSON.stringify({
            artist: this.artist,
            album: this.album,
            song: this.song
        }));
    };

    //Function for setting the song data selected and play it.
    public setMusicAndPlay(artist: Artist, album: Album, song: Song): void {
        this.artist = artist;
        this.album = album;
        this.song = song;
        this.albumImagePath = this.albumService.getImage(this.album);
        this.songPath = this.songService.getSong(this.song);

        this.storeMusicData();

        /*this.playerElem[0].load();
        this.playerElem[0].play();*/
        (this.playerElem[0] as any).load();
        (this.playerElem[0] as any).play();

        this.isPlaying = true;
    };

    //Function for determining the specific song which is playing.
    public isSongPlaying(id: string): boolean {
        return this.isPlaying && this.song.id === id;
    };

    //Function for starting/pausing the player.
    public changeStatus(): void {
        if (!this.song) {
            return;
        }
        
        if (this.isPlaying) {
            this.playerElem[0].pause();
            this.isPlaying = false;
        } else {
            this.playerElem[0].play();
            this.isPlaying = true;
        }
    };

    //Function for updating artist of player.
    public updateArtist(artist: Artist): void {
        if (this.artist && this.artist.id === artist.id) {
            this.artist = artist;

            this.storeMusicData();
        }
    };

    //Function for updating album of player.
    public updateAlbum(album: Album): void {
        if (this.album && this.album.id === album.id) {
            this.album = album;
            this.albumImagePath = this.albumService.getImage(this.album);

            this.storeMusicData();
        }
    };

    //Function for updating song of player.
    public updateSong(song: Song): void {
        if (this.song && this.song.id === song.id) {
            this.song = song;
            this.songPath = this.songService.getSong(this.song);

            this.storeMusicData();
            if (this.isPlaying) {
                this.playerElem[0].load();
                this.playerElem[0].play();
            }
        }
    };

    //Function for removing current song stored if it is removed.
    public deleteSong(id: string): void {
        if (this.song && this.song.id === id) {
            this.artist = null;
            this.album = null;
            this.song = null;
            this.albumImagePath = "assets/img/non-image.jpg";
            this.songPath = "";

            localStorage.removeItem("sound-song");
            if (this.isPlaying) {
                this.playerElem[0].pause();
                this.isPlaying = false;
            }
        }
    };
};
