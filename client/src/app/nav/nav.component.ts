import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../_directives/has-role.directive';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgbModule, FormsModule, BsDropdownModule, RouterLink, HasRoleDirective, GoogleSigninButtonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      if (user) {
        this.authentication = user;
        this.accountService.loginWithGoogle(user).subscribe({
          next: response => {
            this.isMenuCollapsed = true;
          },
          error: error => {
            console.log(error);
            this.toastr.error(error.error);
          }
        });
      }
    });
  }
  accountService = inject(AccountService);
  isMenuCollapsed = true;
  authentication:any = {};
  authService = inject(SocialAuthService);
  private toastr = inject(ToastrService);


  login(){
    this.accountService.login(this.authentication).subscribe({
      next: response => {
        this.isMenuCollapsed = true;
      },
      error: error => {
        console.log(error);
        this.toastr.error(error.error);
      }
    });
  }

  logout(){
    this.accountService.logout();
  }

}
