import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';

import { Http } from '@angular/http';

import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-single-band',
  templateUrl: 'single-band.html'
})
export class SingleBandPage {

	public link = 'http://www.gigsmanila.com/api/band/profile/';
	public b_data = [];
	public  key = 'bandbookmark';
	public isBookmarked;

	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl:LoadingController, public alertCtrl: AlertController, public localStorageService: LocalStorageService, public user:User) {
			this.localStorageService = localStorageService;

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
					// console.log(response);
					console.log(response.gigs);
					this.b_data = response;

					let t_bdtails = [];
					var cur_bookmark = this.localStorageService.get(this.key);
					var exist = false;
					if(cur_bookmark!=null){
						t_bdtails = Object.keys(cur_bookmark).map(key => cur_bookmark[key]);
						t_bdtails.forEach(function(item, index){
							if(response.id==item.id)
								exist = true;
						});
					}
					this.isBookmarked = exist;
					console.log(this.isBookmarked);

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

	bandBookmark(bdtails){
		if(this.localStorageService.isSupported) {
			
			let t_bdtails = [];
			var cur_bookmark = this.localStorageService.get(this.key);
			var exist = 0;
			if(cur_bookmark!=null){
				t_bdtails = Object.keys(cur_bookmark).map(key => cur_bookmark[key]);
				t_bdtails.forEach(function(item, index){
					if(bdtails.id==item.id)
						exist = 1;
				});
			}
			if(exist==0){
				t_bdtails.push(bdtails);

				this.localStorageService.set(this.key, t_bdtails);
				this.isBookmarked = true;
			}
			console.log(t_bdtails);
		}
	}

}
