import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router){}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', [Validators.required, this.matchesValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })


  }

  matchesValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  }

  register(){
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value, dateOfBirth: dob};
    this.accountService.register(values).subscribe({
      next: () => {
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.validationErrors = error
      }

    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

  private getDateOnly (dob: string | undefined){
    if(!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())).toISOString().slice(0,10);

  }

  isLowerCasePresent(): boolean {
    const password = this.registerForm.get('password')?.value;
    return /[a-z]/.test(password);
  }
  
  isUpperCasePresent(): boolean {
    const password = this.registerForm.get('password')?.value;
    return /[A-Z]/.test(password);
  }
  
  isNumericPresent(): boolean {
    const password = this.registerForm.get('password')?.value;
    return /\d/.test(password);
  }
  
  isPasswordLengthValid(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password.length >= 4;
  }

  isSpecialCharPresent(): boolean {
    const passwordControl = this.registerForm.get('password');
    return passwordControl?.value && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(passwordControl.value);
  }

  isPasswordValid(): boolean {
    return (
      this.isLowerCasePresent() &&
      this.isUpperCasePresent() &&
      this.isNumericPresent() &&
      this.isSpecialCharPresent() &&
      this.isPasswordLengthValid()
    );
  }

}
