
import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Rx";

//Loading services
import {UserService} from "../../services/user.service";

//Loading models
import {User} from "../../models/user.model";

@Component({
    selector: "app-signin",
    templateUrl: "./signin.component.html"
})
export class SigninComponent implements OnInit, OnDestroy {
    private userGetSubs: Subscription;
    private userTokenSubs: Subscription;
    private user: User;
    private errorMessage: string;

    constructor(private router: Router,
                private userService: UserService) {

    };

    ngOnInit() {
        this.user = new User("", "", "", "", "", "ROLE_USER", "");
    };

    ngOnDestroy() {
        if (this.userGetSubs) {
            this.userGetSubs.unsubscribe();
        }

        if (this.userTokenSubs) {
            this.userTokenSubs.unsubscribe();
        }
    };

    //Function for requesting user token.
    private getToken(): void {
        this.userTokenSubs = this.userService.signin(this.user, true).subscribe(res => {
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

        this.userGetSubs = this.userService.signin(this.user).subscribe(res => {
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
