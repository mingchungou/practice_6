
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

//Loading routes
import {APP_ROUTING} from "./app.routes";

//Loading services
import {UserService} from "./services/user.service";
import {WindowService} from "./services/window.service";
import {ArtistService} from "./services/artist.service";
import {AdminGuardService} from "./services/admin-guard.service";
import {AuthGuardService} from "./services/auth-guard.service";
import {UploadService} from "./services/upload.service";
import {AlbumService} from "./services/album.service";
import {PathService} from "./services/path.service";
import {SongService} from "./services/song.service";
import {MusicPlayerService} from "./services/music-player.service";

//Loading components
import {AppComponent} from "./app.component";
import {NavbarComponent} from "./components/shared/navbar/navbar.component";
import {SigninComponent} from "./components/signin/signin.component";
import {SignupComponent} from "./components/signup/signup.component";
import {HomeComponent} from "./components/home/home.component";
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
import {PlayerComponent} from "./components/player/player.component";

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        SigninComponent,
        SignupComponent,
        HomeComponent,
        UserEditComponent,
        ArtistsComponent,
        ArtistAddComponent,
        ArtistEditComponent,
        ArtistDetailComponent,
        AlbumAddComponent,
        AlbumEditComponent,
        AlbumDetailComponent,
        SongAddComponent,
        SongEditComponent,
        PlayerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        APP_ROUTING
    ],
    providers: [
        UserService,
        WindowService,
        ArtistService,
        AdminGuardService,
        AuthGuardService,
        UploadService,
        AlbumService,
        PathService,
        SongService,
        MusicPlayerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {};
