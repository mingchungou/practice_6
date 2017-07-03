
import {Injectable} from "@angular/core";
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from "@angular/router";

//Loading services
import {UserService} from "./user.service";

@Injectable()
export class AdminGuardService implements CanActivate {
    constructor(private userService: UserService) {

    };

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
        if (this.userService.isAdmin()) {
            return true;
        } else {
            return false;
        }
    };
};
