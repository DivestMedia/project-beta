import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Http } from '@angular/http';

/*
  Generated class for the SingleGig page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-single-gig',
  templateUrl: 'single-gig.html'
})
export class SingleGigPage {
	public link = 'http://www.gigsmanila.com/api/gig/profile/';
	public g_data = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl:LoadingController, public alertCtrl: AlertController) {
		let gigID = navParams.get('gigID');
		if(typeof gigID != 'undefined'){
	  		console.log(gigID);

	  		let loader = this.loadingCtrl.create({
			    content: "Please wait..."
			});
			loader.present();

	  		let response$ = this.http.get(this.link+gigID+'/').map((res) => res.json());
			response$.subscribe(
				response => {
					console.log(response);
					this.g_data = response;
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
