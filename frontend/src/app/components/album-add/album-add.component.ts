
import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";

//Loading services
import {AlbumService} from "../../services/album.service";

//Loading models
import {Album} from "../../models/album.model";

@Component({
    selector: "app-album-add",
    templateUrl: "./album-add.component.html"
})
export class AlbumAddComponent implements OnInit, OnDestroy {
    private albumInsertSubs: Subscription;
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

    ngOnDestroy() {
        if (this.albumInsertSubs) {
            this.albumInsertSubs.unsubscribe();
        }
    };

    private onSubmit(): void {
        this.errorMessage = null;

        this.albumInsertSubs = this.albumService.insert(this.album).subscribe(res => {
            this.router.navigate(["/album-edit", res.album._id]);
        }, err => {
            let data: any = JSON.parse(err._body);
            this.errorMessage = data.message;

            console.error(err);
        });
    };
};
