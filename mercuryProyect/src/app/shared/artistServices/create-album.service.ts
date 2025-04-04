import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Album, Genres } from './../../auth/interfaces/album.interface';
import { Song } from '../../auth/interfaces/song.interface';
import { v4 as uuidv4 } from 'uuid';
import { enviroment } from '../../enviroments/enviroment';
import { GetUserService } from '../generalServices/get-user.service';
import { AddToAlbumsOfArtistService } from './add-to-albums-of-artist.service';
import { AlbumAPIService } from '../../API/album/album-api.service';
import { SongAPIService } from '../../API/song/song-api.service';



@Injectable({
  providedIn: 'root'
})
export class CreateAlbumService {

  private supabase: SupabaseClient;
  private bucket = enviroment.supabaseBucket.Albums;
  private readonly ALBUM_STORAGE_KEY = enviroment.localStorageConfig.albums.key;
  private readonly SONG_STORAGE_KEY = enviroment.localStorageConfig.songs.key




  constructor(private user: GetUserService,
              private addToAlbumsOfArtist: AddToAlbumsOfArtistService,
              private albumAPIService: AlbumAPIService,
              private songAPIService: SongAPIService
  ) {

    this.supabase = createClient(enviroment.supabaseConfig.url, enviroment.supabaseConfig.apikey);

  }



  private getAlbumsLocalStorage(): Album[] {
    const storedAlbums = localStorage.getItem(this.ALBUM_STORAGE_KEY);
    return storedAlbums ? JSON.parse(storedAlbums) : [];
  }

  private getSongsFromLocalStorage(): Song[] {
    const songsString = localStorage.getItem(this.SONG_STORAGE_KEY);
    return songsString ? JSON.parse(songsString) : [];
  }


  configUpdateAlbum(idAlbum: string, songData: { name: string, genre: Genres, image: File, songs: Song[] }) {

  }

  async configAlbum(albumData: { name: string, genre: Genres, image: File, songs: Song[] }) {
    try{
        const id = this.generateId();
        const imageUrl = await this.addAlbumSupabase({ id, image: albumData.image });

        const newAlbum: Album = {
          id: id,
          name: albumData.name,
          by: "felipe",
          image: imageUrl,
          datePublished: new Date().toISOString().split('T')[0],
          idGenre: albumData.genre.id

          }

        this.createAndAddAlbum(newAlbum, albumData.songs)
    }catch (error) {
    console.error('Error al configurar el album:', error);
    
  } 
}

  private createAndAddAlbum(newAlbum: Album, songs: any) {
    this.albumAPIService.createAlbum(newAlbum).subscribe({
      next: (response) => {
        console.log('Album creado exitosamente:', response);
        console.log("id: ", response.data[0].id);
        
        this.addSongToAlbum(response.data[0].id, songs);
      },
      error: (error) => {
        console.error('Error al crear el sencillo:', error);
      }
    });
  }
  
  private addSongToAlbum(albumId: string, songs: any) {
    for(let song of songs){
      this.songAPIService.addSongToAlbum(song.song_id, albumId).subscribe({
        next: (secondResponse) => {
          console.log("Sencillo agregado a Album con éxito: ", secondResponse);
        },
        error: (error) => {
          console.error("Error al agregar canción a album: ", error);
        }
      });
    }
    
  }



  private addIdAlbumToSong(idAlbum: string, songs: Song[]) {
    const storedSongs: Song[] = this.getSongsFromLocalStorage();

    const updatedSongs = storedSongs.map(storedSong => {
      const songToUpdate = songs.find(song => song.id === storedSong.id);

      if (songToUpdate) {
        const updatedIdAlbum = storedSong.idAlbum ? [...storedSong.idAlbum] : [];

        if (!updatedIdAlbum.includes(idAlbum)) {
          updatedIdAlbum.push(idAlbum);
        }

        return { ...storedSong, idAlbum: updatedIdAlbum };
      }

      return storedSong;
    });

    localStorage.setItem(this.SONG_STORAGE_KEY, JSON.stringify(updatedSongs));
  }



  async addAlbumSupabase(albumSupabase: { id: string, image: File }) {

    const imageUrl = await this.uploadFileToSupabase(this.bucket.images, albumSupabase.id, albumSupabase.image);
    return imageUrl
  }



  async uploadFileToSupabase(folder: string, id: string, file: File) {
    const { error } = await this.supabase.storage
      .from(this.bucket.name)
      .upload(`${folder}/${id}/${file.name}`, file);

    if (error) {
      throw new Error(`Error subiendo archivo: ${error.message}`);
    }

    const { data: fileUrl } = this.supabase.storage.from(this.bucket.name).getPublicUrl(`${folder}/${id}/${file.name}`);
    return fileUrl.publicUrl
  }

  private addAlbumLocalStorage(newAlbum: Album) {
    const currentAlbums = this.getAlbumsLocalStorage();

    this.addToAlbumsOfArtist.addAlbumArtistLocalStorage(this.user.getUser().id, newAlbum.id);
    currentAlbums.push(newAlbum);
    localStorage.setItem(this.ALBUM_STORAGE_KEY, JSON.stringify(currentAlbums));
  }

  private generateId(): string {
    return uuidv4();
  }


}
