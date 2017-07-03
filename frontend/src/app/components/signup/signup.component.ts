
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

//Loading services
import {UserService} from "../../services/user.service";

//Loading models
import {User} from "../../models/user.model";

@Component({
    selector: "app-signup",
    templateUrl: "./signup.component.html"
})
export class SignupComponent implements OnInit {
    private user: User;
    private errorMessage: string;

    constructor(private router: Router,
                private userService: UserService) {

    };

    ngOnInit() {
        this.user = new User("", "", "", "", "", "ROLE_USER", "");
    };

    //Function for requesting user token.
    private getToken(): void {
        this.userService.signin(this.user, true).subscribe(res => {
            this.userService.token = res.token;
            this.userService.storeToken();

            this.router.navigate(["/home"]);
        }, err => {
            let data: any = JSON.parse(err._body);
            this.errorMessage = data.message;

            console.error(err);
        });
    };

    private onSubmit(): void {
        this.errorMessage = null;

        this.userService.insert(this.user).subscribe(res => {
            this.userService.identity = new User(res.user._id,
                res.user.name,
                res.user.username,
                res.user.email,
                res.user.password,
                res.user.role,
                res.user.image);
            this.userService.storeIdentity();

            this.getToken();
        }, err => {
            let data: any = JSON.parse(err._body);
            this.errorMessage = data.message;

            console.error(err);
        });
    };
};
