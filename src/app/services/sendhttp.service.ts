import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';




@Injectable({
  providedIn: 'root'
})
export class SendhttpService {

  httpClient = inject(HttpClient)

  baseUrl = environment.baseUrl + "dist";

  public sendRequest() {
    console.log('send a message from service ', this.baseUrl)
    this.httpClient.get(this.baseUrl).subscribe(account => {
      console.log(account);
    });
  }

}
