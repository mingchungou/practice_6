
import {Injectable} from "@angular/core";

let _window = ():Object => {
    return window;
};

@Injectable()
export class WindowService {
    get nativeWindow():any {
        return _window();
    };
};
