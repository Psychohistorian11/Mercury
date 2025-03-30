import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule , Validators,FormBuilder,AbstractControl, ValidationErrors} from '@angular/forms';
import { Router, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

export function validBirthDateValidator(control: AbstractControl): ValidationErrors | null {
  const inputDate = new Date(control.value);
  const today = new Date();

  if (inputDate > today) {
    return { futureDate: true };
  }

  // Calcular edad
  let age = today.getFullYear() - inputDate.getFullYear();
  const monthDiff = today.getMonth() - inputDate.getMonth();
  const dayDiff = today.getDate() - inputDate.getDate();

  // Ajustar la edad si aún no ha cumplido años este año
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  // Si es menor de 13 años, marcar error
  if (age < 13) {
    return { underage: true };
  }

  return null; // Es válido
}

export function validEmailDomainValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;

  if (!email) return null; // Si está vacío, se maneja con `Validators.required`

  // Expresión regular para verificar un dominio válido después del '@'
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return { invalidDomain: true }; // Retorna un error si el dominio no es válido
  }

  return null; // Es válido
}

export function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('passwordValidation')?.value;
  
  return password === confirmPassword ? null : { passwordsMismatch: true };
}


@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLinkWithHref],
    templateUrl: './sign-up.component.html'
  })
  export class SignUpComponent {
     userForm!: FormGroup;
    private userService = inject(UserService);
    maxDate: string = '';
  
    constructor(
      private formBuilder: FormBuilder,
    ) {
      const today = new Date();
      this.maxDate = today.toISOString().split('T')[0];
      this.userForm = this.formBuilder.group({
        userName: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
          Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/),
          Validators.pattern(/^\S*$/)
        ]],
        email: ['', [
          Validators.required,
          Validators.email,
          Validators.maxLength(42),
          validEmailDomainValidator 

        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,20}$/)
        ]],
        birthDate: ['', [Validators.required, validBirthDateValidator]],
        role: ['', Validators.required],
        passwordValidation: ['', Validators.required]
      },
      { validators: passwordsMatchValidator });
    }
  
    register() {
      if (this.userForm.invalid) {
        if (this.userForm.get('userName')?.errors) {
          const userNameErrors = this.userForm.get('userName')?.errors;
          if (userNameErrors?.['required']) {
            Swal.fire({
              title: "Error",
              text: "Username is required.",
              icon: "warning"
            });
          } else if (userNameErrors?.['minlength']) {
            Swal.fire({
              title: "Error",
              text: "Username must be at least 8 characters long.",
              icon: "warning"
            });
          } else if (userNameErrors?.['maxlength']) {
            Swal.fire({
              title: "Error",
              text: "Username must not exceed 15 characters.",
              icon: "warning"
            });
          } else if (userNameErrors?.['pattern']) {
            Swal.fire({
              title: "Error",
              text: "Username must start with a letter and cannot contain spaces or special characters.",
              icon: "warning"
            });
          }
          return;
        }
  
        if (this.userForm.get('email')?.errors) {
          const emailErrors = this.userForm.get('email')?.errors;
          
          if (emailErrors?.['invalidDomain']) { // Dominio inválido
            Swal.fire({
              title: "Error",
              text: "Please provide a valid email domain.",
              icon: "warning"
            });
            return;
          }
    
          if (emailErrors?.['email']) { // Formato de email incorrecto
            Swal.fire({
              title: "Error",
              text: "Please provide a valid email address.",
              icon: "warning"
            });
            return;
          }
        }

            // Validación de Fecha de Nacimiento (Edad mínima)
    if (this.userForm.get('birthDate')?.errors) {
      const birthDateErrors = this.userForm.get('birthDate')?.errors;
      if (birthDateErrors?.['futureDate']) { // Fecha en el futuro
        Swal.fire({
          title: "Error",
          text: "The birth date cannot be in the future.",
          icon: "warning"
        });
        return;
      }
      if (birthDateErrors?.['underage']) { // Menor de 13 años
        Swal.fire({
          title: "Error",
          text: "You must be at least 13 years old to register.",
          icon: "warning"
        });
        return;
      }
    }
  
        if (this.userForm.get('password')?.errors) {
          const passwordErrors = this.userForm.get('password')?.errors;
          if (passwordErrors?.['required']) {
            Swal.fire({
              title: "Error",
              text: "Password is required.",
              icon: "warning"
            });
          } else if (passwordErrors?.['minlength']) {
            Swal.fire({
              title: "Error",
              text: "Password must be at least 12 characters long.",
              icon: "warning"
            });
          } else if (passwordErrors?.['maxlength']) {
            Swal.fire({
              title: "Error",
              text: "Password must not exceed 20 characters.",
              icon: "warning"
            });
          } else if (passwordErrors?.['pattern']) {
            Swal.fire({
              title: "Error",
              text: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
              icon: "warning"
            });
          }
          return; 
        }
  
        if (this.userForm.hasError('passwordsMismatch')) {
          Swal.fire({
            title: "Error",
            text: "The passwords do not match.",
            icon: "warning"
          });
          return;
        }
      }
  
      const role = this.userForm.get('role')?.value;
      const user: User = {
        id: this.generateId(),
        userName: this.userForm.get('userName')?.value,
        email: this.userForm.get('email')?.value,
        password: this.userForm.get('password')?.value,
        dateOfBirth: this.userForm.get('birthDate')?.value,
        role: role === 'artista' ? 'artist' : 'hearer'
      };
  
      this.userService.register(user)
        

    }
  
    private generateId(): string {
      return uuidv4();
    }
  }
