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
	public venues = [];
	public link = 'http://www.gigsmanila.com/api/venues/';
	public cur_page = 1;
	public cur_limit = 10;
	public show_city: boolean = false;
	public show_venues: boolean = false;
	public show_venue: boolean = false;
	public city: string = '';
	public venue: string = '';

	constructor(public navCtrl: NavController,  public loadingCtrl:LoadingController, public alertCtrl: AlertController, public http: Http, public appCtrl: App, public navParams: NavParams) {
		let cityID = navParams.get('cityID');
		let cityName = navParams.get('cityName');
		let venueDetails = navParams.get('venueDetails');

		let loader = this.loadingCtrl.create({
		    content: "Please wait..."
		});
		loader.present();

		if(typeof venueDetails !== 'undefined'){
			this.venue = venueDetails.name;
			console.log(venueDetails);
			this.show_city = false;
			this.show_venues = false;
			this.show_venue = true;
			loader.dismissAll();
		}else if(typeof cityID == 'undefined'){
			let response$ = this.http.get(this.link+this.cur_page+'/'+this.cur_limit+'/').map((res) => res.json());
			response$.subscribe(
				response => {
					this.venue_cities = response;
					console.log(response);
					this.show_city = true;
					this.show_venues = false;
					this.show_venue = false;
					loader.dismissAll();
				}, error => {
					loader.dismissAll();
					let alert = this.alertCtrl.create({
						title:'', 
						subTitle:'Fetching cities failed!',
						buttons:['OK']
					});
					alert.present();
				}
			);
		}else{
			if(typeof cityName !== 'undefined')
				this.city = 'Venues In '+cityName;
			else
				this.city = 'Venues';
			let response$ = this.http.get(this.link+cityID+'/').map((res) => res.json());
			response$.subscribe(
				response => {
					this.venues = response;
					this.show_city = false;
					this.show_venues = true;
					this.show_venue = false;
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

	getVenueDetails(venueDetails){
		this.appCtrl.getRootNav().push(VenuesPage,{
	  		venueDetails: venueDetails
	  	});
	}
	getVenues(cityID,cityName){
		this.appCtrl.getRootNav().push(VenuesPage,{
	  		cityID: cityID,
	  		cityName: cityName
	  	});
	}
}
