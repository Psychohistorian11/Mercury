import { NgFor, NgIf } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Song } from '../../../auth/interfaces/song.interface';
import { GetSongsService } from '../../artistServices/get-songs.service';
import { ActivatedRoute } from '@angular/router';
import { CreatePlayListService } from '../../artistServices/create-play-list.service';
import { GetTokenService } from '../../generalServices/get-token.service';
import { LoadingComponent } from '../../generalComponents/loading/loading.component';
import { SongAPIService } from '../../../API/song/song-api.service';

@Component({
  selector: 'app-create-play-list',
  standalone: true,
  imports: [NgFor, NgIf, LoadingComponent, LoadingComponent],
  templateUrl: './create-play-list.component.html',
  styleUrls: ['./create-play-list.component.css']
})
export class CreatePlayListComponent {


  @ViewChild('playlistNameInput') playlistNameInput!: ElementRef;
  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

  token: any 

  searchedSongs: Song[] = [];

  suggestedSongs: Song[] = [
    { id: '1', name: 'Song 1', time: '3:45', image: 'https://qgjoyydixskkohmjmcme.supabase.co/storage/v1/object/public/Songs/images/07f3b723-5365-4a30-be2b-ab8264133a98/country.jpg?t=2024-11-04T18%3A07%3A50.748Z', audio: "2", by: "Mora", datePublished: "" },
    { id: '2', name: 'Song 2', time: '4:20', image: 'https://qgjoyydixskkohmjmcme.supabase.co/storage/v1/object/public/Songs/images/1152911f-bf5d-44eb-9117-b5eb72359f55/512.jpg?t=2024-11-04T18%3A07%3A59.039Z', audio: "2", by: "Mora", datePublished: "" },
  ];
  addedSongs: Song[] = [];
  userId: string = ''

  constructor(private route: ActivatedRoute,
              private createPlayListService: CreatePlayListService,
              private getToken: GetTokenService,
              private songAPIService: SongAPIService

) {}

  ngOnInit(): void {
    this.initializeUser();
    this.token = this.getToken.getToken()
    this.initializesuggestedSongs()
  }

  initializesuggestedSongs(){
    this.songAPIService.getRandomSongs("5").subscribe({
      next: (response) => {
        console.log("Random llegdo con exito: ", response)
        this.suggestedSongs = response
      }
    })
  }

  private initializeUser(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
  }

  addSong(song: Song): void {
    if (!this.addedSongs.some(s => s.id === song.id)) {
      this.addedSongs.push(song);

      this.suggestedSongs = this.suggestedSongs.filter(s => s.id !== song.id);
      this.searchedSongs = this.searchedSongs.filter(s => s.id !== song.id);
    }
  }

  removeSong(song: Song): void {
    this.addedSongs = this.addedSongs.filter(s => s.id !== song.id);

    if (this.suggestedSongs.some(s => s.id === song.id)) {
      this.suggestedSongs.push(song);
    } else {
      this.searchedSongs.push(song);
    }
  }

  searchSongs(input: string): void {
    this.songAPIService.getSongsByWord(input).subscribe({
      next: (response) => {
        this.searchedSongs = response
      }
    })
  }

  playlistCoverImage: File | null = null;
imagePreview: string | null = null; 

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.playlistCoverImage = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.playlistCoverImage);
  }
}

async createPlaylist() {
  const playlistName = this.playlistNameInput.nativeElement.value;
  if (!playlistName || this.addedSongs.length === 0) {
    alert('Por favor, ingrese un nombre y agregue al menos una canción a la playlist.');
    return;
  }
  this.loadingComponent.showLoading(); 
  const currentDate = new Date().toISOString();

  const playlistData = {
    userId: this.userId,
    name: playlistName,
    datePublished: currentDate,
    coverImage: this.playlistCoverImage,
    songs: this.addedSongs,
    isPublic: true
  }; 

  try {
    await this.createPlayListService.createPlayList(playlistData); 
    this.loadingComponent.hideLoading();
  
  } catch (error) {
    this.loadingComponent.hideLoading(); 
    console.error('Error al crear la playlist:', error);

  }
}

}
