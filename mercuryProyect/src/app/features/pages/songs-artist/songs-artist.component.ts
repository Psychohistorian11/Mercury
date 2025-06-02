import { Component } from '@angular/core';
import { SongListComponent } from '../../../shared/artistComponents/song-list/song-list.component';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { PlaySongService } from '../../../shared/generalServices/play-song.service';
import { GetUserService } from '../../../shared/generalServices/get-user.service';
import { User } from '../../../auth/interfaces/user.interface'
import { CreateSongComponent } from "../../../shared/artistComponents/create-song/create-song.component";
import { SearchService } from '../../services/search.service';
import { GetTokenService } from '../../../shared/generalServices/get-token.service';


@Component({
  selector: 'app-songs-artist',
  standalone: true,
  imports: [SongListComponent, RouterOutlet,],
  templateUrl: './songs-artist.component.html'
})
export class SongsArtistComponent {
  currentView: 'music' | 'album' | 'create' = 'music';
  selectedSong: string | null = '';
  seeSongs = false;
  private imageSubscription: Subscription | null = null;
  private currentToken: any

  constructor(private router: Router,
    private playSongService: PlaySongService,
    //private user: GetUserService,
    private token: GetTokenService,
  ) {

    this.currentToken = this.token.getToken()
  }



  onSeeSongsOfAlbum() {
    this.seeSongs = true;
  }


  whatKindOfNewContent() {
    Swal.fire({
      html: `
        <div class="bg-slate-700 p-10 rounded-lg max-w-lg mx-auto">
          <div class="mb-8 text-3xl text-left text-white border-b border-white pb-2">
            ¿Qué quieres crear?
          </div>
          <div class="flex justify-around space-x-6">
            <button id="sencillo-button" class="flex items-center px-8 py-4 text-xl bg-slate-100 hover:bg-slate-400 text-black rounded-md transition-all shadow-md hover:shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
              </svg>
              Sencillo
            </button>
            <button id="album-button" class="flex items-center px-8 py-4 text-xl bg-slate-100 hover:bg-slate-400 text-black rounded-md transition-all shadow-md hover:shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              Álbum
            </button>
          </div>
        </div>
      `,
      background: 'rgb(75 85 99 / var(--tw-border-opacity))',
      showConfirmButton: false,
      showCancelButton: false,
      didRender: () => {
        document.getElementById('sencillo-button')?.addEventListener('click', () => this.selectSencillo());
        document.getElementById('album-button')?.addEventListener('click', () => this.selectAlbum());
      }
    });
  }

  onMySongsClick() {
    this.router.navigate([`home/artist/${this.currentToken.sub}/my-songs`])
  }

  onMyAlbumsClick() {
    this.router.navigate([`home/artist/${this.currentToken.sub}/my-songs/my-albums`])
  }

  selectSencillo() {
    Swal.close();
    this.router.navigate([`/home/artist/${this.currentToken.sub}/my-songs/create-song`]);

  }

  selectAlbum() {
    Swal.close();
    this.router.navigate([`/home/artist/${this.currentToken.sub}/my-songs/create-album`]);
  }

  isMainRoute() {
    return this.router.url === `/home/artist/${this.currentToken.sub}/my-songs`;
  }


}
