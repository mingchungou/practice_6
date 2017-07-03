
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {GLOBAL_VARIABLES} from "./global.config";

//Loading models
import {User} from "../models/user.model";

@Injectable()
export class UserService {
    private url: string;
    public identity: User;
    public token: string;

    constructor(private http: Http) {
        this.url = GLOBAL_VARIABLES.url;

        let identity = localStorage.getItem("identity");
        if (identity) {
            this.identity = JSON.parse(identity);
        }

        let token = localStorage.getItem("token");
        if (token) {
            this.token = token;
        }
    };

    //Function for logging in.
    public signin(user: any, gethash: boolean = null): Observable<any> {
        if (gethash) {
            user.gethash = true;
        }

        let params: string = JSON.stringify(user);
        let headers: Headers = new Headers({"Content-Type": "application/json"});
        let request: string = `${this.url}/user/login`;

        return this.http.post(request, params, {headers}).map(res => res.json());
    };

    //Function for inserting an user.
    public insert(user: User): Observable<any> {
        let params: string = JSON.stringify(user);
        let headers: Headers = new Headers({"Content-Type": "application/json"});
        let request: string = `${this.url}/user/insert`;

        return this.http.post(request, params, {headers}).map(res => res.json());
    };

    //Function for updating user data by id.
    public update(user: User): Observable<any> {
        let params: string = JSON.stringify(user);
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.token
        });
        let request: string = `${this.url}/user/update/${this.identity.id}`;

        return this.http.put(request, params, {headers}).map(res => res.json());
    };

    //Function for storing identity to localStorage.
    public storeIdentity(): void {
        localStorage.setItem("identity", JSON.stringify(this.identity));
    };

    //Function for storing token to localStorage.
    public storeToken(): void {
        localStorage.setItem("token", this.token);
    };

    //Function for clearing a session.
    public clearSession(): void {
        this.identity = null;
        this.token = null;
        localStorage.removeItem("identity");
        localStorage.removeItem("token");
    };

    //Function for setting proper profile photo to user.
    public getImage(): string {
        if (!this.identity || !this.identity.image) {
            return "assets/img/non-profile-photo.jpg";
        }

        return `${this.url}/user/getImage/${this.identity.image}`;
    };

    //Function for checking whether or not is authenticated.
    public isAuthenticated(): boolean {
        return this.identity != null && this.token != null;
    };

    //Function for checking if user has admin role.
    public isAdmin(): boolean {
        return this.identity && this.identity.role === "ROLE_ADMIN";
    };
};
