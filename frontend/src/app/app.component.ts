
import {Component, OnInit, ElementRef} from "@angular/core";

//Loading services
import {PathService} from "./services/path.service";
import {UserService} from "./services/user.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
    constructor(private el: ElementRef,
                private pathService: PathService,
                private userService: UserService) {

    };

    ngOnInit() {
        this.pathService.el = this.el;
    };
};
