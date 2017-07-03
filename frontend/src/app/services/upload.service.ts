
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {GLOBAL_VARIABLES} from "./global.config";

//Loading services
import {UserService} from "./user.service";

@Injectable()
export class UploadService {
    private url: string;

    constructor(private http: Http,
                private userService: UserService) {
        this.url = GLOBAL_VARIABLES.url;
    };

    public uploadImage(objectId: string, file: File, from: string): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("image", file, file.name);

        let headers: Headers = new Headers({
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/${from}/uploadImage/${objectId}`;

        return this.http.post(request, formData, {headers}).map(res => res.json());
    };

    public uploadSong(objectId: string, file: File, from: string): Observable<any> {
        let formData: FormData = new FormData();
        formData.append("song", file, file.name);

        let headers: Headers = new Headers({
            "Authorization": this.userService.token
        });
        let request: string = `${this.url}/${from}/uploadSong/${objectId}`;

        return this.http.post(request, formData, {headers}).map(res => res.json());
    };
};
