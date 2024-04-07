import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ValidationError } from 'src/app/interfaces/validationError';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: [
  ]
})
export class RegistrationComponent implements OnInit{
  constructor(public service: UserService, private toastr: ToastrService) {}

  form = new FormGroup({
    fullName: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', Validators.required),
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
    const formGroup = g as FormGroup;
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (password && confirmPassword && password.value && confirmPassword.value) {
        return password.value === confirmPassword.value ? null : { mismatch: true };
    }
    return null;
  }

  get fullName(){
    return this.form.controls.fullName as FormControl;
  }
  get email(){
    return this.form.controls.email as FormControl;
  }
  get password(){
    return this.form.controls.password as FormControl;
  }
  get confirmPassword(){
    return this.form.controls.confirmPassword as FormControl;
  }

  onSubmit() {
    this.service.register(this.fullName.value, this.email.value, this.password.value)
    .pipe(
      catchError(this.handleError)
    )
    .subscribe(
      (response) => {
        console.log('Успешная регистрация:', response);
        this.form.reset();
        this.toastr.success('Вы успешно зарегистрировались!', 'Регистрация')
      },
      (error) => {
        console.error('Ошибка при регистрации:', error);
        if (error.error && error.error instanceof Array) {
          error.error.forEach((err: ValidationError) => {
            this.toastr.error(err.errorMessage, 'Ошибка регистрации');
          });
        } else {
          this.toastr.error('Произошла ошибка при регистрации', 'Ошибка');
        }
      }
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ошибка на стороне клиента:', error.error.message);
    } else {
      console.error('Ошибка на стороне сервера:', error.status, error.error);
    }
    return throwError(error);
 }

  ngOnInit(): void {
    this.form.reset();
  }
}
