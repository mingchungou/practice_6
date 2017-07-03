
import {Component, OnInit} from "@angular/core";

//Loading services
import {UserService} from "../../services/user.service";
import {UploadService} from "../../services/upload.service";

//Loading models
import {User} from "../../models/user.model";

@Component({
    selector: "app-user-edit",
    templateUrl: "./user-edit.component.html"
})
export class UserEditComponent implements OnInit {
    private user: User;
    private errorMessage: string;
    private successMessage: string;
    private fileToUpload: File;

    constructor(private userService: UserService,
                private uploadService: UploadService) {

    };

    ngOnInit() {
        this.user = new User(
            this.userService.identity.id,
            this.userService.identity.name,
            this.userService.identity.username,
            this.userService.identity.email,
            this.userService.identity.password,
            this.userService.identity.role,
            this.userService.identity.image,
        );
    };

    //Function for setting image file loaded to local variable.
    private inputFileChange(ev: any): void {
        this.fileToUpload = ev.target.files[0];
    };

    //Function for setting new user data to user service and storing it.
    private successUpdateUser(): void {
        this.userService.identity.name = this.user.name;
        this.userService.identity.username = this.user.username;
        this.userService.identity.email = this.user.email;
        this.userService.identity.image = this.user.image;
        this.userService.storeIdentity();

        this.successMessage = "Changes are saved successful";
    };

    private onSubmit(): void {
        this.errorMessage = null;
        this.successMessage = null;

        this.userService.update(this.user).subscribe(res => {
            if (!this.fileToUpload) {
                this.successUpdateUser();
            } else {
                this.uploadService.uploadImage(
                    this.user.id,
                    this.fileToUpload,
                    "user"
                ).subscribe(res => {
                    this.user.image = res.image;

                    this.successUpdateUser();
                }, err => {
                    let data: any = JSON.parse(err._body);
                    this.errorMessage = data.message;

                    console.error(err);
                });
            }
        }, err => {
            let data: any = JSON.parse(err._body);
            this.errorMessage = data.message;

            console.error(err);
        });
    };
};
