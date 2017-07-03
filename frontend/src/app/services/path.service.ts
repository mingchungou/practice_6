
import {Injectable, ElementRef} from "@angular/core";
import {Router, NavigationStart, NavigationEnd} from "@angular/router";
import {Location} from "@angular/common";
import {Observable} from "rxjs/Observable";
import {ISubscription} from "rxjs/Subscription";
import "rxjs/add/operator/map";

//Loading services
import {WindowService} from "./window.service";

@Injectable()
export class PathService {
    public el: ElementRef;
    public history: Array<string> = [];
    public currentPath: string;
    private goBacksuscription: ISubscription;

    constructor(private router: Router,
                private location: Location,
                private windowService: WindowService) {
        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationStart) {
                let navbarToggler: any = this.el.nativeElement.querySelector(".navbar-toggler");

                if (navbarToggler && navbarToggler.getAttribute("aria-expanded") === "true") {
                    navbarToggler.click();
                };

                windowService.nativeWindow.scrollTo(0, 0);
            } else if (ev instanceof NavigationEnd) {
                if (!this.goBacksuscription) {
                    this.setPath(ev.url);
                }
            }
        }, err => console.error(err));
    };

    //Function for setting previous pathes to history array.
    private setPath(path: string): void {
        if (this.currentPath && this.currentPath !== this.history[0]) {
            this.history.unshift(this.currentPath);

            if (this.history.length >= 16) {
                this.history.pop();
            }
        }

        if (path !== this.currentPath) {
            this.currentPath = path;
        }
    };

    //Function for navigation back N previous pathes based on times.
    public back(times: number = 1) {
        this.goBacksuscription = this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                times--;

                if (times > 0) {
                    this.location.back();
                } else {
                    this.goBacksuscription.unsubscribe();
                    this.goBacksuscription = null;
                    this.setPath(ev.url);
                }
            }
        }, err => console.error(err));

        this.location.back();
    };
};
