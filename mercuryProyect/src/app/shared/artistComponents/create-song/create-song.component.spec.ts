import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CreateSongComponent } from "./create-song.component";
import { ReactiveFormsModule } from "@angular/forms";
import { GetTokenService } from "../../generalServices/get-token.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from "rxjs";

describe('CreateSongComponent', () => {
    let component: CreateSongComponent;
    let fixture: ComponentFixture<CreateSongComponent>;
    const mockGetTokenService = {
        getToken: jasmine.createSpy('getToken').and.returnValue('fake.token.payload'),
      };
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, HttpClientTestingModule],
        providers: [
            { provide: GetTokenService, useValue: mockGetTokenService, params: of({ id: '123' }) }
          ]
      }).compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(CreateSongComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('✅ Debe crear la canción correctamente con datos válidos', () => {
      component.registerForm.setValue({
        name: 'Song1',
        audio: new File([''], 'audio.mp3', { type: 'audio/mp3' }),
        image: new File([''], 'image.jpg', { type: 'image/jpeg' }),
        genre: 'Rock'
      });

      expect(component.registerForm.valid).toBeTrue();
    });
  
    it('❌ Debe mostrar error si falta el nombre de la canción', () => {
      component.registerForm.setValue({
        name: '',
        audio: new File([''], 'audio.mp3', { type: 'audio/mp3' }),
        image: new File([''], 'image.jpg', { type: 'image/jpeg' }),
        genre: 'Rock'
      });
  
      expect(component.registerForm.valid).toBeFalse();
      expect(component.registerForm.controls['name'].hasError('required')).toBeTrue();
    });
  
    it('❌ Debe mostrar error si falta el archivo de audio', () => {
      component.registerForm.setValue({
        name: 'Song1',
        audio: null,
        image: new File([''], 'image.jpg', { type: 'image/jpeg' }),
        genre: 'Rock'
      });
  
      expect(component.registerForm.valid).toBeFalse();
      expect(component.registerForm.controls['audio'].hasError('required')).toBeTrue();
    });
  
    it('❌ Debe mostrar error si el archivo de audio tiene un formato no permitido', () => {
      component.registerForm.setValue({
        name: 'Song1',
        audio: new File([''], 'audio.txt', { type: 'text/plain' }),
        image: new File([''], 'image.jpg', { type: 'image/jpeg' }),
        genre: 'Rock'
      });
  
      expect(component.registerForm.valid).toBeFalse();
      expect(component.registerForm.controls['audio'].hasError('invalidFileType')).toBeTrue();
    });

  });
  