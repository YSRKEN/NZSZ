import { Component } from '@angular/core';
import { WebApi } from './api/WebApi';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(http: HttpClient){
    WebApi.initialize(http);
  }
}
