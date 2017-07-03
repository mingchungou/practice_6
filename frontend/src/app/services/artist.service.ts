
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {GLOBAL_VARIABLES} from "./global.config";

//Loading services
import {UserService} from "./user.service";

//Loading models
import {Artist} from "../models/artist.model";

@Injectable()
export class ArtistService {
    private url: string;

    constructor(private http: Http,
                private userService: UserService) {
        this.url = GLOBAL_VARIABLES.url;
    };

    //Function for inserting an artist.
    public insert(artist: Artist): Observable<any> {
        let params: string = JSON.stringify(artist);
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/artist/insert`;

        return this.http.post(request, params, {headers}).map(res => res.json());
    };

    //Function for getting an artist by id.
    public getById(id: string): Observable<any> {
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/artist/get/${id}`;

        return this.http.get(request, {headers}).map(res => res.json());
    };

    //Function for getting an artist collection based on page number.
    public getByPage(page: number): Observable<any> {
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/artist/getByPage/${page}`;

        return this.http.get(request, {headers}).map(res => res.json());
    };

    //Function for updating an artist data by id.
    public update(artist: Artist): Observable<any> {
        let params: string = JSON.stringify(artist);
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/artist/update/${artist.id}`;

        return this.http.put(request, params, {headers}).map(res => res.json());
    };

    //Function for removing an artist by id.
    public delete(id: string): Observable<any> {
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/artist/remove/${id}`;

        return this.http.delete(request, {headers}).map(res => res.json());
    };

    //Function for setting proper artist image.
    public getImage(artist: Artist): string {
        if (!artist.image) {
            return "assets/img/non-image.jpg";
        }

        return `${this.url}/artist/getImage/${artist.image}`;
    };
};
