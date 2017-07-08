
import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";

//Loading services
import {AlbumService} from "../../services/album.service";
import {UploadService} from "../../services/upload.service";
import {MusicPlayerService} from "../../services/music-player.service";

//Loading models
import {Album} from "../../models/album.model";

@Component({
    selector: "app-album-edit",
    templateUrl: "./album-edit.component.html"
})
export class AlbumEditComponent implements OnInit, OnDestroy {
    private albumGetSubs: Subscription;
    private albumUpdateSubs: Subscription;
    private albumUploadSubs: Subscription;
    private album: Album;
    private errorMessage: string;
    private fileToUpload: File;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private albumService: AlbumService,
                private uploadService: UploadService,
                private musicPlayerService: MusicPlayerService) {

    };

    ngOnInit() {
        this.activatedRoute.params.forEach(params => {
            this.albumGetSubs = this.albumService.getById(params.id).subscribe(res => {
                this.album = new Album(
                    res.album._id,
                    res.album.title,
                    res.album.description,
                    res.album.year,
                    res.album.image,
                    res.album.artist._id
                );
            }, err => console.error(err));
        });
    };

    ngOnDestroy() {
        this.albumGetSubs.unsubscribe();

        if (this.albumUpdateSubs) {
            this.albumUpdateSubs.unsubscribe();
        }

        if (this.albumUploadSubs) {
            this.albumUploadSubs.unsubscribe();
        }
    };

    //Function for setting image file loaded to local variable.
    private inputFileChange(ev: any): void {
        this.fileToUpload = ev.target.files[0];
    };

    //Function for updating album player and navigating back to artist detail.
    private successUpdateAlbum(): void {
        this.musicPlayerService.updateAlbum(this.album);
        this.router.navigate(["artist-detail", this.album.artist]);
    };

    private onSubmit(): void {
        this.errorMessage = null;

        this.albumUpdateSubs = this.albumService.update(this.album).subscribe(res => {
            if (!this.fileToUpload) {
                this.successUpdateAlbum();
            } else {
                this.albumUploadSubs = this.uploadService.uploadImage(
                    this.album.id,
                    this.fileToUpload,
                    "album"
                ).subscribe(res => {
                    this.album.image = res.image;

                    this.successUpdateAlbum();
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
