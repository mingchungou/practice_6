
import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Rx";

//Loading services
import {ArtistService} from "../../services/artist.service";

//Loading models
import {Artist} from "../../models/artist.model";

@Component({
    selector: "app-artist-add",
    templateUrl: "./artist-add.component.html"
})
export class ArtistAddComponent implements OnInit, OnDestroy {
    private artistInsertSubs: Subscription;
    private artist: Artist;
    private errorMessage: string;

    constructor(private router: Router,
                private artistService: ArtistService) {

    };

    ngOnInit() {
        this.artist = new Artist("", "", "", "");
    };

    ngOnDestroy() {
        if (this.artistInsertSubs) {
            this.artistInsertSubs.unsubscribe();
        }
    };

    private onSubmit(): void {
        this.errorMessage = null;

        this.artistInsertSubs = this.artistService.insert(this.artist).subscribe(res => {
            this.router.navigate(["/artist-edit", res.artist._id]);
        }, err => {
            let data: any = JSON.parse(err._body);
            this.errorMessage = data.message;

            console.error(err);
        });
    };
};
