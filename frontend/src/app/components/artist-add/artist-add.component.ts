
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

//Loading services
import {ArtistService} from "../../services/artist.service";

//Loading models
import {Artist} from "../../models/artist.model";

@Component({
    selector: "app-artist-add",
    templateUrl: "./artist-add.component.html"
})
export class ArtistAddComponent implements OnInit {
    private artist: Artist;
    private errorMessage: string;

    constructor(private router: Router,
                private artistService: ArtistService) {

    };

    ngOnInit() {
        this.artist = new Artist("", "", "", "");
    };

    private onSubmit(): void {
        this.errorMessage = null;

        this.artistService.insert(this.artist).subscribe(res => {
            this.router.navigate(["/artist-edit", res.artist._id]);
        }, err => {
            let data: any = JSON.parse(err._body);
            this.errorMessage = data.message;

            console.error(err);
        });
    };
};
