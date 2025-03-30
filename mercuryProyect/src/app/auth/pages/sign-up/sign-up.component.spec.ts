import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignUpComponent } from './sign-up.component';
import { UserService } from '../../services/user.service';
import { UserAPIService } from '../../../API/user/user-api.service';
import { PlayListAPIService } from '../../../API/playList/play-list-api.service';
import { AuthService } from '../../../API/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent, HttpClientTestingModule],
      providers: [UserService, UserAPIService, PlayListAPIService, AuthService,{ provide: ActivatedRoute, useValue: {} }], 
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  
  });

  it('Debería invalidar el formulario si los campos están vacíos', () => {
    expect(component.userForm.valid).toBeFalse();
  });

  it('Debería invalidar el nombre de usuario con caracteres especiales', () => {
    component.userForm.controls['userName'].setValue('user!@#');
    expect(component.userForm.controls['userName'].valid).toBeFalse();
  });

  it('Debería invalidar el correo electrónico sin @', () => {
    component.userForm.controls['email'].setValue('invalidemail.com');
    expect(component.userForm.controls['email'].valid).toBeFalse();
  });

  it('Debería invalidar el correo electrónico sin un dominio válido', () => {
    component.userForm.controls['email'].setValue('user@invalid');
    expect(component.userForm.controls['email'].valid).toBeFalse();
  });

  it('Debería invalidar la falta de coincidencia de contraseña.', () => {
    component.userForm.controls['password'].setValue('Password123');
    component.userForm.controls['passwordValidation'].setValue('Password456');
    expect(component.userForm.valid).toBeFalse();
  });

  it('Debería invalidar la contraseña sin un número', () => {
    component.userForm.controls['password'].setValue('Password');
    expect(component.userForm.controls['password'].valid).toBeFalse();
  });

  it('Debería invalidar la fecha de nacimiento futura', () => {
    component.userForm.controls['birthDate'].setValue('01-01-2100');
    expect(component.userForm.controls['birthDate'].valid).toBeFalse();
  });

  it('Debería invalidarse la edad menor de 13 años', () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 12);
    component.userForm.controls['birthDate'].setValue(today.toISOString().split('T')[0]);
    expect(component.userForm.controls['birthDate'].valid).toBeFalse();
  });

  it('Debe validar el formulario con valores correctos', () => {
    component.userForm.controls['userName'].setValue('Cristian1907');
    component.userForm.controls['email'].setValue('user@gmail.com');
    component.userForm.controls['password'].setValue('Palabras11***');
    component.userForm.controls['passwordValidation'].setValue('Palabras11***');
    const validDate = new Date();
    validDate.setFullYear(validDate.getFullYear() - 20);
    component.userForm.controls['birthDate'].setValue(validDate.toISOString().split('T')[0]);
    component.userForm.controls['role'].setValue('artist')
    expect(component.userForm.valid).toBeTrue();
  });
});
