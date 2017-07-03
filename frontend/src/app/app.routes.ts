
import {RouterModule, Routes} from "@angular/router";

//Loading services
import {AuthGuardService} from "./services/auth-guard.service";
import {AdminGuardService} from "./services/admin-guard.service";

//Loading components
import {HomeComponent} from "./components/home/home.component";
import {SigninComponent} from "./components/signin/signin.component";
import {SignupComponent} from "./components/signup/signup.component";
import {UserEditComponent} from "./components/user-edit/user-edit.component";
import {ArtistsComponent} from "./components/artists/artists.component";
import {ArtistAddComponent} from "./components/artist-add/artist-add.component";
import {ArtistEditComponent} from "./components/artist-edit/artist-edit.component";
import {ArtistDetailComponent} from "./components/artist-detail/artist-detail.component";
import {AlbumAddComponent} from "./components/album-add/album-add.component";
import {AlbumEditComponent} from "./components/album-edit/album-edit.component";
import {AlbumDetailComponent} from "./components/album-detail/album-detail.component";
import {SongAddComponent} from "./components/song-add/song-add.component";
import {SongEditComponent} from "./components/song-edit/song-edit.component";

const APP_ROUTES: Routes = [{
    path: "home",
    component: HomeComponent
}, {
    path: "signin",
    component: SigninComponent
}, {
    path: "signup",
    component: SignupComponent
}, {
    path: "user-edit",
    component: UserEditComponent,
    canActivate: [AuthGuardService]
}, {
    path: "artists/:page",
    component: ArtistsComponent,
    canActivate: [AuthGuardService]
}, {
    path: "artist-add",
    component: ArtistAddComponent,
    canActivate: [AdminGuardService]
}, {
    path: "artist-edit/:id",
    component: ArtistEditComponent,
    canActivate: [AdminGuardService]
}, {
    path: "artist-detail/:id",
    component: ArtistDetailComponent,
    canActivate: [AuthGuardService]
}, {
    path: "album-add/:artist",
    component: AlbumAddComponent,
    canActivate: [AdminGuardService]
}, {
    path: "album-edit/:id",
    component: AlbumEditComponent,
    canActivate: [AdminGuardService]
}, {
    path: "album-detail/:id",
    component: AlbumDetailComponent,
    canActivate: [AuthGuardService]
}, {
    path: "song-add/:album",
    component: SongAddComponent,
    canActivate: [AdminGuardService]
}, {
    path: "song-edit/:id",
    component: SongEditComponent,
    canActivate: [AdminGuardService]
}, {
    path: "**",
    pathMatch: "full",
    redirectTo: "home"
}];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash: true});
