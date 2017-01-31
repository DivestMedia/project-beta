import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';

import { LocalStorageService } from 'angular-2-local-storage';

import { SingleBandPage } from '../single-band/single-band';
import { SingleGigPage } from '../single-gig/single-gig';

@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html'
})
export class BookmarksPage {

	public  bookmarkkey: any;
  public bands = [];
	public gigs = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public localStorageService: LocalStorageService, public appCtrl: App) {
  	this.localStorageService = localStorageService;
  	this.bookmarkkey = navParams.data;
  	console.log(this.bookmarkkey);
    var cur_bookmark = this.localStorageService.get(this.bookmarkkey);
    if(cur_bookmark!=null){
      if(this.bookmarkkey=='bandbookmark'){
    		this.bands = Object.keys(cur_bookmark).map(key => cur_bookmark[key]);
    	}else if(this.bookmarkkey=='gigsbookmark'){
        this.gigs = Object.keys(cur_bookmark).map(key => cur_bookmark[key]);
      }
    }
  }
  goToSingleBand(bandID){
		this.appCtrl.getRootNav().push(SingleBandPage,{
	  		bandID: bandID
	  	});
	}

  goToSingleGig(gigID){
    this.appCtrl.getRootNav().push(SingleGigPage,{
        gigID: gigID
      });
  }

}
