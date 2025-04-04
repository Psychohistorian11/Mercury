import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment';
import { Song } from '../../auth/interfaces/song.interface';
import { v4 as uuidv4 } from 'uuid';
import { AddToSongsOfArtistService } from './add-to-songs-of-artist.service';
import { GetUserService } from '../generalServices/get-user.service';
import { GetSongsService } from './get-songs.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Genres } from '../../auth/interfaces/album.interface';
import { GetTokenService } from '../generalServices/get-token.service';
import { SongAPIService } from '../../API/song/song-api.service';

@Injectable({
  providedIn: 'root'
})
export class CreateSongService {
  private readonly SONG_STORAGE_KEY = enviroment.localStorageConfig.songs.key;
  private supabase: SupabaseClient;
  private bucket = enviroment.supabaseBucket.Songs;

  token: any

  constructor(
    private songAPIservice: SongAPIService,
    //private addToSongsOfArtist: AddToSongsOfArtistService,
    //private user: GetUserService,
    private getToken: GetTokenService,
    private songs: GetSongsService
  ) {
    this.token = this.getToken.getToken();
    this.supabase = createClient(enviroment.supabaseConfig.url, enviroment.supabaseConfig.apikey);
  }

  getSongsLocalStorage(): Song[] {
    const storedSongs = localStorage.getItem(this.SONG_STORAGE_KEY);
    return storedSongs ? JSON.parse(storedSongs) : [];
  }


  async configSong(songData: { name: string, genre: Genres, audio: File, image: File }) {
  try {
    const id = this.generateId();
    const { audioUrl, imageUrl } = await this.addSongSupabase({ id, audio: songData.audio, image: songData.image });
    
    const newSong: Song = await this.createSongObject(id, songData, audioUrl, imageUrl);

    this.createAndAddSong(newSong);
  } catch (error) {
    console.error('Error al configurar la canción:', error);
  }
}

private async createSongObject(id: string, songData: { name: string, genre: Genres }, audioUrl: string, imageUrl: string): Promise<Song> {
  const time = await this.getAudioDuration(audioUrl);
  return {
    id: id,
    audio: audioUrl,
    name: songData.name,
    image: imageUrl,
    time: time,
    datePublished: new Date().toISOString().split('T')[0],
    idGenre: songData.genre.id
  };
}

private createAndAddSong(newSong: Song) {
  this.songAPIservice.createSong(newSong).subscribe({
    next: (response) => {
      console.log('Sencillo creado exitosamente:', response);
      console.log("id: ", response.data[0].id);
      
      this.addSongToArtist(response.data[0].id);
    },
    error: (error) => {
      console.error('Error al crear el sencillo:', error);
    }
  });
}

private addSongToArtist(songId: string) {
  this.songAPIservice.addSongToArtist(songId, this.token.sub).subscribe({
    next: (secondResponse) => {
      console.log("Sencillo agregado a Artista con éxito: ", secondResponse);
    },
    error: (error) => {
      console.error("Error al agregar canción a artista: ", error);
    }
  });
}


  async configUpdateSong(id: string, songData: { name: string, genre: Genres, audio: File, image: File }) {
    const songs = this.getSongsLocalStorage();
    const oldSong = this.songs.getSongByIdLocalStorage(id);

    const { audioUrl, imageUrl } = await this.updateSongSupabase({
      id,
      newAudio: songData.audio,
      newImage: songData.image,
      currentAudio: oldSong.audio,
      currentImage: oldSong.image
    });



    const updatedSongs = await Promise.all(songs.map(async song => {
      if (song.id === id) {
        const duration = await this.getAudioDuration(audioUrl);
        return {
          ...song,
          name: songData.name,
          time: duration,
          audio: audioUrl,
          image: imageUrl,
          idGenre: songData.genre.id
        };
      }
      return song;
    }));

    localStorage.setItem(this.SONG_STORAGE_KEY, JSON.stringify(updatedSongs));
  }


  private async addSongSupabase(songSupabase: { id: string, audio: File, image: File }) {

    const audioUrl = await this.uploadFileToSupabase(this.bucket.audios, songSupabase.id, songSupabase.audio);
    const imageUrl = await this.uploadFileToSupabase(this.bucket.images, songSupabase.id, songSupabase.image);
    return { audioUrl, imageUrl }

  }

  private async updateSongSupabase(data: { id: string, newAudio: File, newImage: File, currentAudio: string, currentImage: string }) {

    await this.deleteFileFromSupabase(this.bucket.audios, data.id, data.currentAudio);
    await this.deleteFileFromSupabase(this.bucket.images, data.id, data.currentImage);

    const audioUrl = await this.uploadFileToSupabase(this.bucket.audios, data.id, data.newAudio);
    const imageUrl = await this.uploadFileToSupabase(this.bucket.images, data.id, data.newImage);
    return { audioUrl, imageUrl }

  }

  private async uploadFileToSupabase(folder: string, id: string, file: File) {
    const { error } = await this.supabase.storage
      .from(this.bucket.name)
      .upload(`${folder}/${id}/${file.name}`, file);

    if (error) {
      throw new Error(`Error subiendo archivo: ${error.message}`);
    }

    const { data: fileUrl } = this.supabase.storage.from(this.bucket.name).getPublicUrl(`${folder}/${id}/${file.name}`);
    return fileUrl.publicUrl
  }

  private async deleteFileFromSupabase(folder: string, id: string, fileName: string) {
    const correctName = this.extractFileName(fileName)
    const { error } = await this.supabase.storage
      .from(this.bucket.name)
      .remove([`${folder}/${id}/${correctName}`]);

    if (error) {
      throw new Error(`Error eliminando archivo: ${error.message}`);
    }
  }

  /*private addSongLocalStorage(newSong: Song) {
    const currentSongs = this.getSongsLocalStorage();
    this.addToSongsOfArtist.addSongArtistLocalStorage(this.user.getUser().id, newSong.id);
    currentSongs.push(newSong);
    localStorage.setItem(this.SONG_STORAGE_KEY, JSON.stringify(currentSongs));
  }*/

  private generateId(): string {
    return uuidv4();
  }

  async getAudioDuration(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);

      audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        const durationString = `${minutes}m ${seconds}s`;
        resolve(durationString);
      });

      audio.addEventListener('error', () => {
        reject('Error al cargar el archivo de audio.');
      });
    });
  }

  extractFileName(url: string): string | undefined {

    const parts = url.split('/');
    const encodedFileName = parts.pop();

    if (!encodedFileName) {
      return undefined;
    }
    const decodedFileName = decodeURIComponent(encodedFileName);

    return decodedFileName;
  }


}
