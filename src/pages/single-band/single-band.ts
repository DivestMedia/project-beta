import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Http } from '@angular/http';

@Component({
  selector: 'page-single-band',
  templateUrl: 'single-band.html'
})
export class SingleBandPage {

	public link = 'http://www.gigsmanila.com/api/band/profile/';
	public b_data = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl:LoadingController, public alertCtrl: AlertController) {
	  	let band_ID = navParams.get('bandID');
	  	if(typeof band_ID != 'undefined'){
	  		console.log(band_ID);

	  		let loader = this.loadingCtrl.create({
			    content: "Please wait..."
			});
			loader.present();

	  		let response$ = this.http.get(this.link+band_ID+'/').map((res) => res.json());
			response$.subscribe(
				response => {
					console.log(response);
					console.log(response.gigs);
					this.b_data = response;
					loader.dismissAll();
				}, error => {
					loader.dismissAll();
					let alert = this.alertCtrl.create({
						title:'', 
						subTitle:'Fetching band details failed!',
						buttons:['OK']
					});
					alert.present();
				}
			);
	  	}
	}

}
