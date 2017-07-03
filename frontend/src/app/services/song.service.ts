
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {GLOBAL_VARIABLES} from "./global.config";

//Loading services
import {UserService} from "./user.service";

//Loading models
import {Song} from "../models/song.model";

@Injectable()
export class SongService {
    private url: string;

    constructor(private http: Http,
                private userService: UserService) {
        this.url = GLOBAL_VARIABLES.url;
    };

    //Function for inserting a song.
    public insert(song: Song): Observable<any> {
        let params: string = JSON.stringify(song);
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/song/insert`;

        return this.http.post(request, params, {headers}).map(res => res.json());
    };

    //Function for getting a song by id.
    public getById(id: string): Observable<any> {
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/song/get/${id}`;

        return this.http.get(request, {headers}).map(res => res.json());
    };

    //Function for getting all songs which belong to an album.
    public getSongs(albumId: string = null): Observable<any> {
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string;

        if (albumId) {
            request = `${this.url}/song/getAll/${albumId}`;
        } else {
            request = `${this.url}/song/getAll`;
        }

        return this.http.get(request, {headers}).map(res => res.json());
    };

    //Function for updating a song data by id.
    public update(song: Song): Observable<any> {
        let params: string = JSON.stringify(song);
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/song/update/${song.id}`;

        return this.http.put(request, params, {headers}).map(res => res.json());
    };

    //Function for removing a song by id.
    public delete(id: string): Observable<any> {
        let headers: Headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/song/remove/${id}`;

        return this.http.delete(request, {headers}).map(res => res.json());
    };

    //Function for setting proper song file.
    public getSong(song: Song): string {
        if (!song.file) {
            return "";
        }

        return `${this.url}/song/getSong/${song.file}`;
    };
};
