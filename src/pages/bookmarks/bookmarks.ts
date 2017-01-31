import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';

import { LocalStorageService } from 'angular-2-local-storage';

import { SingleBandPage } from '../single-band/single-band';

@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html'
})
export class BookmarksPage {

	public  bookmarkkey: any;
	public bands = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public localStorageService: LocalStorageService, public appCtrl: App) {
  	this.localStorageService = localStorageService;
  	this.bookmarkkey = navParams.data;
  	console.log(this.bookmarkkey);

  	var cur_bookmark = this.localStorageService.get(this.bookmarkkey);
  	if(cur_bookmark!=null){
  		this.bands = Object.keys(cur_bookmark).map(key => cur_bookmark[key]);
  	}
  	console.log(this.bands);
  }
  goToSingleBand(bandID){
		this.appCtrl.getRootNav().push(SingleBandPage,{
	  		bandID: bandID
	  	});
	}

}
