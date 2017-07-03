
import {Component, OnInit} from "@angular/core";

//Loading services
import {UserService} from "../../services/user.service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    private isAuthenticated: boolean = false;

    constructor(private userService: UserService) {

    };

    ngOnInit() {
        this.isAuthenticated = this.userService.isAuthenticated();
    };
};
