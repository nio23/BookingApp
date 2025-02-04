import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgbModule, FormsModule, BsDropdownModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  accountService = inject(AccountService);
  isMenuCollapsed = true;
  authentication:any = {};
  private toastr = inject(ToastrService);


  login(){
    this.accountService.login(this.authentication).subscribe({
      next: response => {
        console.log(response);
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
