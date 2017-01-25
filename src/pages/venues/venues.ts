import { Component } from '@angular/core';
import { App, NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-venues',
  templateUrl: 'venues.html'
})
export class VenuesPage {

	public venue_cities = [];
	public link = 'http://www.gigsmanila.com/api/venues/';
	public cur_page = 1;
	public cur_limit = 10;

	constructor(public navCtrl: NavController,  public loadingCtrl:LoadingController, public alertCtrl: AlertController, public http: Http, public appCtrl: App, public navParams: NavParams) {
		let city_ID = navParams.get('cityID');

		let loader = this.loadingCtrl.create({
		    content: "Please wait..."
		});
		loader.present();

		if(typeof city_ID == 'undefined'){
			let response$ = this.http.get(this.link+this.cur_page+'/'+this.cur_limit+'/').map((res) => res.json());
			response$.subscribe(
				response => {
					this.venue_cities = response;
					console.log(response);
					loader.dismissAll();
				}, error => {
					loader.dismissAll();
					let alert = this.alertCtrl.create({
						title:'', 
						subTitle:'Fetching venues failed!',
						buttons:['OK']
					});
					alert.present();
				}
			);
		}else{
			let response$ = this.http.get(this.link+city_ID+'/').map((res) => res.json());
			response$.subscribe(
				response => {
					this.venue_cities = response;
					console.log(response);
					loader.dismissAll();
				}, error => {
					loader.dismissAll();
					let alert = this.alertCtrl.create({
						title:'', 
						subTitle:'Fetching venues failed!',
						buttons:['OK']
					});
					alert.present();
				}
			);
		}
	}

	getVenues(cityID){
		this.appCtrl.getRootNav().push(VenuesPage,{
	  		cityID: cityID
	  	});
	}
}
