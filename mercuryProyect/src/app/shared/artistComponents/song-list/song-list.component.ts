import { Component, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { GetSongsService } from '../../artistServices/get-songs.service';
import { DeleteSong, EditSong, Song } from '../../../auth/interfaces/song.interface';
import { GetUserService } from '../../generalServices/get-user.service';
import { User } from '../../../auth/interfaces/user.interface';
import { SearchService } from '../../../features/services/search.service';
import { PlaySongService } from '../../generalServices/play-song.service';
import Swal from 'sweetalert2';
import { DeleteSongService } from '../../artistServices/delete-song.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../../generalComponents/loading/loading.component';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { PlaySongComponent } from "../../generalComponents/play-song/play-song.component";
import { GetTokenService } from '../../generalServices/get-token.service';
import { SongAPIService } from '../../../API/song/song-api.service';
import { MusicPlayerService } from '../../generalServices/music-player.service';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, LoadingComponent, PlaySongComponent],
  templateUrl: './song-list.component.html'
})
export class SongListComponent {
  private token: any
  private searchQuery: string = this.searchService.getInputLocalStorage();
  private genreFiltredQuery: string = this.searchService.getGenreFiltredLocalStorage()
  private publicationDateQuery: string = this.searchService.getPublicationDateFiltredLocalStorage()

  createAlbumSubscription: Subscription | null = null
  searchInputSubscription: Subscription | null = null
  searchTriggeredSubscription: Subscription | null = null;
  genreFiltredTriggeredSubscription: Subscription | null = null;
  publicationDateFiltredTriggeredSubscription: Subscription | null = null;


  createAlbum = false;
  songs = signal<any[]>([]);
  showArtisComponents = true

  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

  addedSongs = new Set<string>();

  constructor(
    private getSongsService: GetSongsService,
    private getUserService: GetUserService,
    private searchService: SearchService,
    private playSongService: PlaySongService,
    private deleteSongService: DeleteSongService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private getToken: GetTokenService,
    private songAPIservice: SongAPIService,
    private musicPlayerService: MusicPlayerService
  ) {
    this.token = this.getToken.getToken();
    this.getSongsByCurrentArtist()

    /*this.createAlbumSubscription = this.searchService.alarm$.subscribe((bool) => {
      this.createAlbum = bool;
    });
    this.searchTriggeredSubscription = this.searchService.searchTriggered$.subscribe((triggered) => {
      if (triggered) {
        this.searchQuery = this.searchService.getInputLocalStorage();
        this.searchSongs(this.searchQuery);
        this.showArtisComponents = false
      }
    });

    this.searchService.resetSearchTriggered()

    this.genreFiltredTriggeredSubscription = this.searchService.genreFiltredTriggered$.subscribe((triggered) => {
      if (triggered) {
        this.genreFiltredQuery = this.searchService.getGenreFiltredLocalStorage();
        this.searchSongsFiltredGenre(this.genreFiltredQuery);
        this.showArtisComponents = false
      } 
    });

    this.searchService.resetGenreFiltredTriggered()

    this.publicationDateFiltredTriggeredSubscription = this.searchService.publicationDateFiltredTriggered$.subscribe((triggered) => {
      if (triggered) {
        this.publicationDateQuery = this.searchService.getPublicationDateFiltredLocalStorage();
        this.searchSongsFiltredPublicationDate(this.publicationDateQuery);
        this.showArtisComponents = false
      }
    });

    this.searchService.resetPublicationDateFiltredTriggered()*/


  }

  handleDblClick(song: any) {
    this.musicPlayerService.setCurrentSong(song);
  }


  onDeleteSong(song: DeleteSong) {
    Swal.fire({
      html: `
            <div class="bg-slate-700 p-10 rounded-lg max-w-lg mx-auto">
                <div class="mb-8 text-3xl text-left text-white border-b border-white pb-2">
                    ¿Estás segura de borrar este sencillo?
                </div>
                <div class="flex justify-around space-x-6">
                    <button id="confirm-button" class="flex items-center px-8 py-4 text-xl bg-slate-100 hover:bg-red-400 text-black rounded-md transition-all shadow-md hover:shadow-lg">
                        Borrar
                    </button>
                    <button id="cancel-button" class="flex items-center px-8 py-4 text-xl bg-slate-100 hover:bg-blue-400 text-black rounded-md transition-all shadow-md hover:shadow-lg">
                        Conservar
                    </button>
                </div>
            </div>
        `,
      background: 'rgb(75 85 99 / var(--tw-border-opacity))',
      showConfirmButton: false,
      showCancelButton: false,
      didRender: () => {
        document.getElementById('confirm-button')?.addEventListener('click', () => this.confirmDelete(song));
        document.getElementById('cancel-button')?.addEventListener('click', () => Swal.close());
      }
    });
  }

  async confirmDelete(song: DeleteSong) {
    Swal.close();
    this.loadingComponent.showLoading();
    try {
      //await this.deleteSongService.deleteSong(song);
    } catch (error) {
      console.error('Error al borrar la canción:', error);
    } finally {
      this.loadingComponent.hideLoading();
      Swal.fire({
        html: `<div class="bg-slate-700 p-10 rounded-lg max-w-lg mx-auto">
                <div class="mb-8 text-3xl text-left text-white border-b border-white pb-2">
                  Sencillo borrado con éxito
                </div>
              </div>`,
        background: 'rgb(75 85 99 / var(--tw-border-opacity))',
        showConfirmButton: false,
        showCancelButton: false,
      });
    }
  }

  onEditSong(song: EditSong) {
    this.router.navigate([`/home/artist/${this.token.sub}/my-songs/edit-song/${song.id}`]);
  }

  onAddSong() {
    this.router.navigate([`/home/artist/${this.token.sub}/my-songs/create-song`]);
  }

  getSongsByCurrentArtist() {

  }


  /* async searchSongs(input: string) {
     const songsByInput = this.getSongsService.getSongsFilteredByInput(input)
     this.songs.set(songsByInput)
 
   }
 
   searchSongsFiltredGenre(idGenre: string) {
     const songsFiltredGenre = this.getSongsService.getSongsFiltredByGenre(idGenre)
     this.songs.set(songsFiltredGenre)
     this.cdRef.detectChanges();
   }
 
   searchSongsFiltredPublicationDate(date: string) {
     const songsFiltredPublicationDate = this.getSongsService.getSongsFiltredByPublicationDate(date)
     this.songs.set(songsFiltredPublicationDate)
   }*/
}
