
import {Component} from "@angular/core";
import {Router} from "@angular/router";

//Loading services
import {UserService} from "../../../services/user.service";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html"
})
export class NavbarComponent {
    constructor(private router: Router,
                private userService: UserService) {

    };

    //Function for closing the current session.
    private logOut(): void {
        this.userService.clearSession();
        this.router.navigate(["/signin"]);
    };

    //Function for starting a new session.
    private logIn(): void {
        this.router.navigate(["/signin"]);
    };
};
