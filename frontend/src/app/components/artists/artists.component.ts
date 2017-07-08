
import {Component, OnInit, OnDestroy, ElementRef} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";

//Loading services
import {UserService} from "../../services/user.service";
import {ArtistService} from "../../services/artist.service";

//Loading models
import {Artist} from "../../models/artist.model";

declare var $:any;

@Component({
    selector: "app-artists",
    templateUrl: "./artists.component.html"
})
export class ArtistsComponent implements OnInit, OnDestroy {
    private artistsGetSubs: Subscription;
    private artistDeleteSubs: Subscription;
    private isAdmin: boolean = false;
    private artists: Array<Artist> = [];
    private prevButton: boolean = false;
    private nextButton: boolean = false;
    private page: number;
    private errorMessage: string;
    private artistIdDelete: string;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private el: ElementRef,
                private userService: UserService,
                private artistService: ArtistService) {

    };

    ngOnInit() {
        this.isAdmin = this.userService.isAdmin();

        //Don't recall this.
        this.activatedRoute.params.forEach(params => {
            this.page = parseInt(params.page);

            this.loadArtists();
        });
    };

    ngOnDestroy() {
        this.artistsGetSubs.unsubscribe();

        if (this.artistDeleteSubs) {
            this.artistDeleteSubs.unsubscribe();
        }
    };

    //Function for loading artist list based on page number.
    private loadArtists(): void {
        this.artists = [];

        this.artistsGetSubs = this.artistService.getByPage(this.page).subscribe(res => {
            this.prevButton = ((this.page - 1) >= 1) ? true : false;
            this.nextButton = ((this.page + 1) <= res.pages) ? true : false;

            for (let item of res.artists) {
                let artist: Artist = new Artist(
                    item._id,
                    item.name,
                    item.description,
                    item.image
                );

                this.artists.push(artist);
            }
        }, err => {
            console.error(err);

            if (err.status === 404) {
                let previousPage = this.page - 1;

                if (previousPage >= 1) {
                    this.router.navigate([`/artists/${previousPage}`]);
                } else {
                    this.errorMessage = "There is not any artist to show";
                }
            }
        });
    };

    //Function for showing up the confirm delete message.
    private showConfirmAlert(id: string): void {
        this.artistIdDelete = id;

        $(this.el.nativeElement.querySelector("#myModal")).modal();
    };

    //Function for deleting the artist selected and reload the artist list.
    private deleteArtist(): void {
        $(this.el.nativeElement.querySelector("#myModal")).modal("hide");

        if (this.artistIdDelete) {
            this.artistDeleteSubs = this.artistService.delete(this.artistIdDelete).subscribe(res => {
                this.loadArtists();
            }, err => {
                let data: any = JSON.parse(err._body);
                this.errorMessage = data.message;

                console.error(err);
            });
        }
    };
};
