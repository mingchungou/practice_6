
import {Component, OnInit, OnDestroy, ElementRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";

//Loading services
import {UserService} from "../../services/user.service";
import {ArtistService} from "../../services/artist.service";
import {AlbumService} from "../../services/album.service";

//Loading models
import {Artist} from "../../models/artist.model";
import {Album} from "../../models/album.model";

declare var $:any;

@Component({
    selector: "app-artist-detail",
    templateUrl: "./artist-detail.component.html"
})
export class ArtistDetailComponent implements OnInit, OnDestroy {
    private artistGetSubs: Subscription;
    private albumsGetSubs: Subscription;
    private albumDeleteSubs: Subscription;
    private isAdmin: boolean;
    private artist: Artist;
    private albums: Array<Album>;
    private errorMessage: string;
    private albumIdDelete: string;

    constructor(private activatedRoute: ActivatedRoute,
                private el: ElementRef,
                private userService: UserService,
                private artistService: ArtistService,
                private albumService: AlbumService) {

    };

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();

        this.activatedRoute.params.forEach(params => {
            this.artistGetSubs = this.artistService.getById(params.id).subscribe(res => {
                this.artist = new Artist(
                    res.artist._id,
                    res.artist.name,
                    res.artist.description,
                    res.artist.image
                );

                this.loadAlbums();
            }, err => console.error(err));
        });
    };

    ngOnDestroy() {
        this.artistGetSubs.unsubscribe();
        this.albumsGetSubs.unsubscribe();

        if (this.albumDeleteSubs) {
            this.albumDeleteSubs.unsubscribe();
        }
    };

    //Function for loading all albums which belong to the artist.
    private loadAlbums(): void {
        this.albums = [];

        this.albumsGetSubs = this.albumService.getAlbums(this.artist.id).subscribe(res => {
            for (let item of res.albums) {
                let album: Album = new Album(
                    item._id,
                    item.title,
                    item.description,
                    item.year,
                    item.image,
                    item.artist._id
                );

                this.albums.push(album);
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
        this.albumIdDelete = id;

        $(this.el.nativeElement.querySelector("#myModal")).modal();
    };

    //Function for deleting the album selected and reload the album list.
    private deleteAlbum(): void {
        $(this.el.nativeElement.querySelector("#myModal")).modal("hide");

        if (this.albumIdDelete) {
            this.albumDeleteSubs = this.albumService.delete(this.albumIdDelete).subscribe(res => {
                this.loadAlbums();
            }, err => {
                let data: any = JSON.parse(err._body);
                this.errorMessage = data.message;

                console.error(err);
            });
        }
    };
};
