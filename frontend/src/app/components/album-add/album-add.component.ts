
import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

//Loading services
import {AlbumService} from "../../services/album.service";

//Loading models
import {Album} from "../../models/album.model";

@Component({
    selector: "app-album-add",
    templateUrl: "./album-add.component.html"
})
export class AlbumAddComponent implements OnInit {
    private album: Album;
    private errorMessage: string;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private albumService: AlbumService) {

    };

    ngOnInit() {
        this.album = new Album("", "", "", 2017, "", "");

        this.activatedRoute.params.forEach(params => {
            this.album.artist = params.artist;
        });
    };

    private onSubmit(): void {
        this.errorMessage = null;

        this.albumService.insert(this.album).subscribe(res => {
            this.router.navigate(["/album-edit", res.album._id]);
        }, err => {
            let data: any = JSON.parse(err._body);
            this.errorMessage = data.message;

            console.error(err);
        });
    };
};
