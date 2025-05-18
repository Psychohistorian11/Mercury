import { Component, OnInit, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { GetSongsService } from '../../artistServices/get-songs.service';
import { Song } from '../../../auth/interfaces/song.interface';
import { PlaySongService } from '../../generalServices/play-song.service';
import { MusicPlayerFooterComponent } from '../music-player-footer/music-player-footer.component';
import { MusicPlayerService } from '../../generalServices/music-player.service';

@Component({
  selector: 'app-three-main-songs',
  standalone: true,
  imports: [NgFor, NgIf,MusicPlayerFooterComponent],
  templateUrl: './three-main-songs.component.html'
})
export class ThreeMainSongsComponent implements OnInit {


  isPlaySong: boolean = false

  constructor(private getSongsService: GetSongsService,
              private musicPlayerService: MusicPlayerService
  ) { 
  }

  songs: Song[] = [];
  currentIndex = 1;

  leftSong = signal<any>(null);
  currentSong = signal<any>(null);
  rightSong = signal<any>(null);

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs() {
    this.songs = this.getSongsService.getRandomSongs();
    if (this.songs.length >= 3) {
      this.updateDisplayedSongs();
    }
  }

  updateDisplayedSongs() {
    const total = this.songs.length;

    const leftIndex = (this.currentIndex - 1 + total) % total;
    const rightIndex = (this.currentIndex + 1) % total;

    this.leftSong.set(this.mapSongToThreeSongs(this.songs[leftIndex]));
    this.currentSong.set(this.mapSongToThreeSongs(this.songs[this.currentIndex]));
    this.rightSong.set(this.mapSongToThreeSongs(this.songs[rightIndex]));
  }

  mapSongToThreeSongs(song: any) {
    return {
      song_name: song.name,
      by: song.by,
      song_image: song.image,
      mp3: song.audio,
      datePublished: song.datePublished,
      id: song.id,
      time: song.time,
      idAlbum: song.idAlbum,
      idGenre: song.idGenre

    };
  }

  moveLeft() {
    const total = this.songs.length;
    this.currentIndex = (this.currentIndex - 1 + total) % total;
    this.updateDisplayedSongs();
  }

  moveRight() {
    const total = this.songs.length;
    this.currentIndex = (this.currentIndex + 1) % total;
    this.updateDisplayedSongs();
  }

  playSong(song: any) {
    if (song) {
      this.isPlaySong = true
      this.musicPlayerService.setCurrentSong(song)
    }
  }

  getImageUrl(songImage: string | null): string {
    if (songImage && songImage.startsWith('https://')) {
      return songImage;
    } else {
      return './../../../../assets/songs/logo2.png';
    }
  }
  
}
