import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BurnedFilesService } from '../burnedFiles/burned-files.service';
import { Artist, User } from './auth/interfaces/user.interface';
import { Song } from './auth/interfaces/song.interface';
import { Album } from './auth/interfaces/album.interface';
import { songsOfArtist } from './auth/interfaces/idRelated.interface';
import { albumsOfArtist } from './auth/interfaces/idRelated.interface';
import { MusicPlayerFooterComponent } from "./shared/generalComponents/music-player-footer/music-player-footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MusicPlayerFooterComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Mercury';

  constructor(//private burnedFilesService: BurnedFilesService,

  ) {



    /*const isDataLoaded = localStorage.getItem('isDataLoaded');


    if (!isDataLoaded) {
      this.loadUsers(this.burnedFilesService.getBurnedUsers());
      this.loadArtists(this.burnedFilesService.getBurnedArtist());
      this.loadSongs(this.burnedFilesService.getBurnedSongs());
      this.loadAlbums(this.burnedFilesService.getBurnedAlbums());
      this.loadSongsOfArtist(this.burnedFilesService.getBurnedSongsArtist());
      this.loadAlbumsOfArtist(this.burnedFilesService.getBurnedAlbumsArtist());

      localStorage.setItem('isDataLoaded', 'true');
    }

  }

  loadUsers(users: User[]) {
    let allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    allUsers = allUsers.concat(users);
    localStorage.setItem('users', JSON.stringify(allUsers));
  }

  loadArtists(artists: Artist[]) {
    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.concat(artists);
    localStorage.setItem('users', JSON.stringify(users));
  }

  loadSongs(songs: Song[]) {
    let allSongs: Song[] = JSON.parse(localStorage.getItem('songs') || '[]');
    allSongs = allSongs.concat(songs);
    localStorage.setItem('songs', JSON.stringify(allSongs));
  }

  loadAlbums(albums: Album[]) {
    let allAlbums: Album[] = JSON.parse(localStorage.getItem('albums') || '[]');
    allAlbums = allAlbums.concat(albums);
    localStorage.setItem('albums', JSON.stringify(allAlbums));
  }

  loadSongsOfArtist(songsArtist: songsOfArtist[]) {
    let allSongsArtist: songsOfArtist[] = JSON.parse(localStorage.getItem('songsArtist') || '[]');
    allSongsArtist = allSongsArtist.concat(songsArtist);
    localStorage.setItem('songsArtist', JSON.stringify(allSongsArtist));
  }

  loadAlbumsOfArtist(albumsArtist: albumsOfArtist[]) {
    let allAlbumsArtist: albumsOfArtist[] = JSON.parse(localStorage.getItem('albumsArtist') || '[]');
    allAlbumsArtist = allAlbumsArtist.concat(albumsArtist);
    localStorage.setItem('albumsArtist', JSON.stringify(allAlbumsArtist));
  }*/
}
}