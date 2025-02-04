import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  private minOld = 8;

  register(){
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({dateOfBirth: dob});
    this.accountService.register(this.registerForm.value).subscribe({
      next: () =>{
        this.router.navigateByUrl('/availability');
      },
      error: (error) =>{
        this.validationErrors = error;
      }
    });
  }

  cancel(){
    console.log('canceled');
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      gender: ['male'],
      dateOfBirth: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, this.matchPassword()]],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchPassword(): ValidatorFn{
    return (control: AbstractControl) =>{
      return control.value === control.parent?.get('password')?.value ? null : {isMatching: true};
    }
  }

  maxDate(): Date{
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - this.minOld);
    return maxDate;
  }

  private getDateOnly(date: string | Date){
    return new Date(date).toISOString().split('T')[0];
  }
}
