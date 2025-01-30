import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, BsDatepickerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  private minOld = 8;

  register(){
    console.log(this.registerForm.value);
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
      dob: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, this.matchPassword()]],
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
}
