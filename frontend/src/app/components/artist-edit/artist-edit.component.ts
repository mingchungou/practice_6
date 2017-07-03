
import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

//Loading services
import {ArtistService} from "../../services/artist.service";
import {UploadService} from "../../services/upload.service";
import {PathService} from "../../services/path.service";
import {MusicPlayerService} from "../../services/music-player.service";

//Loading models
import {Artist} from "../../models/artist.model";

@Component({
    selector: "app-artist-edit",
    templateUrl: "./artist-edit.component.html",
})
export class ArtistEditComponent implements OnInit {
    private artist: Artist;
    private errorMessage: string;
    private fileToUpload: File;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private artistService: ArtistService,
                private uploadService: UploadService,
                private musicPlayerService: MusicPlayerService) {

    };

    ngOnInit() {
        this.activatedRoute.params.forEach(params => {
            this.artistService.getById(params.id).subscribe(res => {
                this.artist = new Artist(
                    res.artist._id,
                    res.artist.name,
                    res.artist.description,
                    res.artist.image
                );
            }, err => console.error(err));
        });
    };

    //Function for setting image file loaded to local variable.
    private inputFileChange(ev: any): void {
        this.fileToUpload = ev.target.files[0];
    };

    //Function for updating artist player and navigating back to artist list.
    private successUpdateArtist(): void {
        this.musicPlayerService.updateArtist(this.artist);
        this.router.navigate(["artists", 1]);
    };

    private onSubmit(): void {
        this.errorMessage = null;

        this.artistService.update(this.artist).subscribe(res => {
            if (!this.fileToUpload) {
                this.successUpdateArtist();
            } else {
                this.uploadService.uploadImage(
                    this.artist.id,
                    this.fileToUpload,
                    "artist"
                ).subscribe(res => {
                    this.artist.image = res.image;

                    this.successUpdateArtist();
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
