import { Component } from '@angular/core';
import { App, NavController, AlertController, LoadingController } from 'ionic-angular';

import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from 'angular-2-local-storage';

import { SingleGigPage } from '../single-gig/single-gig';

@Component({
  selector: 'page-gigs',
  templateUrl: 'gigs.html'
})
export class GigsPage {
	public gigs = [];
	public link = 'http://www.gigsmanila.com/api/gigs-sked/';
	public cur_page = 1;
	public cur_limit = 10;
	public filter = [];
	public is_infinite = false;
	public is_active = '0-9';
	
	constructor(public navCtrl: NavController,  public loadingCtrl:LoadingController, public alertCtrl: AlertController, public http: Http, public appCtrl: App) {

		let loader = this.loadingCtrl.create({
		    content: "Please wait..."
		});
		loader.present();

		let response$ = this.http.get(this.link+this.cur_page+'/'+this.cur_limit+'/').map((res) => res.json());
		response$.subscribe(
			response => {
				this.gigs = response;
				console.log(response);
				loader.dismissAll();
			}, error => {
				loader.dismissAll();
				let alert = this.alertCtrl.create({
					title:'', 
					subTitle:'Fetching gigs failed!',
					buttons:['OK']
				});
				alert.present();
			}
		);
	}

	goToSingleGig(gigID){
		this.appCtrl.getRootNav().push(SingleGigPage,{
	  		gigID: gigID
	  	});
	}

}
