
import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

//Loading services
import {SongService} from "../../services/song.service";
import {UploadService} from "../../services/upload.service";
import {MusicPlayerService} from "../../services/music-player.service";

//Loading models
import {Song} from "../../models/song.model";

@Component({
    selector: "app-song-edit",
    templateUrl: "./song-edit.component.html"
})
export class SongEditComponent implements OnInit {
    private song: Song;
    private errorMessage: string;
    private fileToUpload: File;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private songService: SongService,
                private uploadService: UploadService,
                private musicPlayerService: MusicPlayerService) {

    };

    ngOnInit() {
        this.activatedRoute.params.forEach(params => {
            this.songService.getById(params.id).subscribe(res => {
                this.song = new Song(
                    res.song._id,
                    res.song.number,
                    res.song.name,
                    res.song.duration,
                    res.song.file,
                    res.song.album._id
                );
            }, err => console.error(err));
        });
    };

    //Function for setting song file loaded to local variable.
    private inputFileChange(ev: any): void {
        this.fileToUpload = ev.target.files[0];
    };

    //Function for updating song player and navigating back to album detail.
    private successUpdateSong(): void {
        this.musicPlayerService.updateSong(this.song);
        this.router.navigate(["album-detail", this.song.album]);
    };

    private onSubmit(): void {
        this.errorMessage = null;

        this.songService.update(this.song).subscribe(res => {
            if (!this.fileToUpload) {
                this.successUpdateSong();
            } else {
                this.uploadService.uploadSong(
                    this.song.id,
                    this.fileToUpload,
                    "song"
                ).subscribe(res => {
                    this.song.file = res.file;

                    this.successUpdateSong();
                }, err => {
                    let data: any = JSON.parse(err._body);
                    this.errorMessage = data.message;

                    console.error(err);
                });
            }
        }, err => {
            let data: any = JSON.parse(err._body);
            this.errorMessage = data.message;

            console.error(err);
        });
    };
};
