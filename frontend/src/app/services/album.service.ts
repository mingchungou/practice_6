
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {GLOBAL_VARIABLES} from "./global.config";

//Loading services
import {UserService} from "./user.service";

//Loading models
import {Album} from "../models/album.model";

@Injectable()
export class AlbumService {
    private url: string;

    constructor(private http: Http,
                private userService: UserService) {
        this.url = GLOBAL_VARIABLES.url;
    };

    //Function for inserting an album.
    public insert(album: Album): Observable<any> {
        let params: string = JSON.stringify(album);
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/album/insert`;

        return this.http.post(request, params, {headers}).map(res => res.json());
    };

    //Function for getting an album by id.
    public getById(id: string): Observable<any> {
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/album/get/${id}`;

        return this.http.get(request, {headers}).map(res => res.json());
    };

    //Function for getting all albums of an artist.
    public getAlbums(artistId: string = null): Observable<any> {
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string;

        if (artistId) {
            request = `${this.url}/album/getAll/${artistId}`;
        } else {
            request = `${this.url}/album/getAll`;
        }

        return this.http.get(request, {headers}).map(res => res.json());
    };

    //Function for updating an album data by id.
    public update(album: Album): Observable<any> {
        let params: string = JSON.stringify(album);
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/album/update/${album.id}`;

        return this.http.put(request, params, {headers}).map(res => res.json());
    };

    //Function for removing an album by id.
    public delete(id: string): Observable<any> {
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/album/remove/${id}`;

        return this.http.delete(request, {headers}).map(res => res.json());
    };

    //Function for setting proper album image.
    public getImage(album: Album): string {
        if (!album.image) {
            return "assets/img/non-image.jpg";
        }

        return `${this.url}/album/getImage/${album.image}`;
    };
};
