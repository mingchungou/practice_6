
import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";

//Loading services
import {SongService} from "../../services/song.service";

//Loading models
import {Song} from "../../models/song.model";

@Component({
    selector: "app-song-add",
    templateUrl: "./song-add.component.html"
})
export class SongAddComponent implements OnInit, OnDestroy {
    private songInsertSubs: Subscription;
    private song: Song;
    private errorMessage: string;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private songService: SongService) {

    };

    ngOnInit() {
        this.song = new Song("", 1, "", "", "", "");

        this.activatedRoute.params.forEach(params => {
            this.song.album = params.album;
        });
    };

    ngOnDestroy() {
        if (this.songInsertSubs) {
            this.songInsertSubs.unsubscribe();
        }
    };

    private onSubmit(): void {
        this.errorMessage = null;

        this.songInsertSubs = this.songService.insert(this.song).subscribe(res => {
            this.router.navigate(["/song-edit", res.song._id]);
        }, err => {
            let data: any = JSON.parse(err._body);
            this.errorMessage = data.message;

            console.error(err);
        });
    };
};
