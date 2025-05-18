import { NgClass, NgIf } from '@angular/common';
import { Component} from '@angular/core';
import { Song } from '../../../auth/interfaces/song.interface';
import { MusicPlayerService } from '../../generalServices/music-player.service';
import { SongAPIService } from '../../../API/song/song-api.service';

@Component({
  selector: 'app-music-player-footer',
  standalone: true,
  imports: [NgIf],
  templateUrl: './music-player-footer.component.html'
})
export class MusicPlayerFooterComponent {

  audio = new Audio();
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 0.9;

  currentSong: any;


  constructor(private musicPlayerService: MusicPlayerService,
              private songAPIService: SongAPIService
  ) {
    this.musicPlayerService.loadFromStorage();

    this.musicPlayerService.getCurrentSong().subscribe({
      next: data => {
        this.loadSong(data)
        this.replaySong(data)
      }
    })

    this.musicPlayerService.isPlaying$.subscribe((isPlaying) => {
      this.isPlaying = isPlaying;
      if (this.isPlaying) {
        this.audio.play().catch((error) => {
          console.error('Error al reproducir el audio:', error);
        });
      } else {
        this.audio.pause();
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.musicPlayerService.setCurrentTime(this.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
    });
  }

loadSong(song: any): void {
  if (!song || !song.mp3) {
    console.warn('La canción es null o no tiene un archivo mp3.');
    return; 
  }

  this.currentSong = song;
  this.audio.src = song.mp3;
  this.audio.load();
  this.audio.volume = this.volume;
  this.audio.play().catch((error) => {
    console.error('Error al reproducir el audio:', error);
  });
  this.isPlaying = true;
  this.musicPlayerService.setPlayingState(true);
}


  togglePlay(): void {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
    this.musicPlayerService.setPlayingState(this.isPlaying);
  }

  previousTrack(){

  }

  nextTrack(){

  }

  updateTime(): void {
    this.currentTime = this.audio.currentTime;
  }

  updateDuration(): void {
    this.duration = this.audio.duration;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  }

  onSeek(event: any): void {
    const newTime = (event.target.value / 100) * this.duration;
    this.audio.currentTime = newTime;
    this.musicPlayerService.setCurrentTime(newTime);
  }

  onVolumeChange(event: any): void {
    this.volume = event.target.value / 100;
    this.audio.volume = this.volume;
  }

  replaySong(data: any){
    /*console.log("Data: ",data)
      this.songAPIService.replaySong(data.id).subscribe({
        next: (response) => {
          console.log("Replay Enviada con exito: ", response)
        }
      })*/
  }
}
