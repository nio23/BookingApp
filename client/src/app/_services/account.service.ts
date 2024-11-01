import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  
  login(model: any) {
    return this.http.post(this.baseUrl+'account/login', model);
  }

  logout() {
    return this.http.post(this.baseUrl+'account/logout', {});
  }
}
