
import {Component, OnInit, ElementRef, OnDestroy} from "@angular/core";

//Loading services
import {MusicPlayerService} from "../../services/music-player.service";

declare var $:any;

@Component({
    selector: "app-player",
    templateUrl: "./player.component.html"
})
export class PlayerComponent implements OnInit, OnDestroy {
    constructor(private el: ElementRef,
                private musicPlayerService: MusicPlayerService) {

    };

    ngOnInit() {
        this.musicPlayerService.playerElem = $(this.el.nativeElement.querySelector("#player"));

        this.musicPlayerService.playerElem.on("ended", () => {
            this.musicPlayerService.isPlaying = false;
        });
    };

    ngOnDestroy() {
        if (this.musicPlayerService.isPlaying) {
            this.musicPlayerService.isPlaying = false;
        }

        this.musicPlayerService.playerElem.off("ended");
    };
};
