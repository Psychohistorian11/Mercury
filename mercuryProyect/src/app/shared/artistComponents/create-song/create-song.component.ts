import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateSongService } from '../../artistServices/create-song.service';
import { PlaySongService } from '../../generalServices/play-song.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GetUserService } from '../../generalServices/get-user.service';
import { GetSongsService } from '../../artistServices/get-songs.service';
import { LoadingComponent } from './../../../shared/generalComponents/loading/loading.component';
import { GetGenresService } from '../../generalServices/get-genres.service';
import { Genres } from '../../../auth/interfaces/album.interface';
import { NgFor } from '@angular/common';
import { GetTokenService } from '../../generalServices/get-token.service';

@Component({
  selector: 'app-register-song',
  templateUrl: './create-song.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingComponent, NgFor],
})
export class CreateSongComponent implements OnInit {

  token: any
  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;
  registerForm: FormGroup;
  songId: string | null = null;
  genres = signal<Genres[]>([]);


  constructor(
    private fb: FormBuilder,
    private songsService: GetSongsService,
    private playSong: PlaySongService,
    private createSongService: CreateSongService,
    private route: ActivatedRoute,
    private router: Router,
    //private user: GetUserService,
    private getToken: GetTokenService,
    private getGenresService: GetGenresService,

  ) {
    this.token = this.getToken.getToken()
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      audio: [null, Validators.required],
      image: [null, Validators.required],
      genre: [null, Validators.required]
    });
  }

  loadGenres() {
    const genres = this.getGenresService.getGenres();
    this.genres.set(genres);
  }

  ngOnInit() {
    this.loadGenres();
    this.songId = this.route.snapshot.paramMap.get('id');
    if (this.songId) {
      this.loadSongData(this.songId);
    }
  }

  async loadSongData(id: string) {
    const song = await this.songsService.getSongByIdSong(id);
    this.registerForm.patchValue({
      name: song.name,
    });

    //this.playSong.setAudio(song.audio);
    this.playSong.setImage(song.image);
  }

  onAudioSongSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.registerForm.patchValue({ audio: file });
    }
  }

  onImageSongSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const image = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target?.result;
        if (typeof imageUrl === 'string') {
          this.registerForm.patchValue({ image });
          this.playSong.setImage(imageUrl);
        }
      };
      reader.readAsDataURL(image);
    }
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.loadingComponent.showLoading();

      const songData = {
        name: this.registerForm.value.name,
        genre: this.registerForm.value.genre,
        audio: this.registerForm.value.audio,
        image: this.registerForm.value.image
      };

      try {
        if (this.songId) {
          await this.createSongService.configUpdateSong(this.songId, songData);
          Swal.fire({
            html: `<div class="bg-slate-700 p-10 rounded-lg max-w-lg mx-auto">
                    <div class="mb-8 text-3xl text-left text-white border-b border-white pb-2">
                      Sencillo actualizado con éxito
                    </div>
                  </div>`,
            background: 'rgb(75 85 99 / var(--tw-border-opacity))',
            showConfirmButton: false,
            showCancelButton: false,
          });
        } else {
          await this.createSongService.configSong(songData);
          Swal.fire({
            html: `<div class="bg-slate-700 p-10 rounded-lg max-w-lg mx-auto">
                    <div class="mb-8 text-3xl text-left text-white border-b border-white pb-2">
                      Sencillo publicado con éxito
                    </div>
                  </div>`,
            background: 'rgb(75 85 99 / var(--tw-border-opacity))',
            showConfirmButton: false,
            showCancelButton: false,
          });
        }


        this.loadingComponent.hideLoading();
        this.router.navigate([`home/artist/${this.token.sub}/my-songs`]);
      } catch (error) {

        this.loadingComponent.hideLoading();
        Swal.fire('Error', ` Hubo un problema al publicar el sencillo error ${error}`);
      }
    }
  }
}
