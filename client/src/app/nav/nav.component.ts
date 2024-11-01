import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgbModule, FormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  private accountService = inject(AccountService);
  isMenuCollapsed = true;
  authentication:any = {};
  isLoggedIn = false;

  login(){
    this.accountService.login(this.authentication).subscribe({
      next: response => {
        console.log(response);
        this.isLoggedIn = true;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  logout(){
    this.isLoggedIn = false;
  }
}
