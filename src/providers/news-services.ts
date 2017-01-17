import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LocalStorageService } from 'angular-2-local-storage';
/*
  Generated class for the NewsServices provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NewsServices {

  constructor(public http: Http, public localStorageService: LocalStorageService) {
  	this.http = http;
    console.log('Hello NewsServices Provider');
  }

  getNews(_link,_page){
  	return this.http.get(_link+_page+'/').map((res) => res.json());
  }

}
