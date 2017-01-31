import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { Http } from '@angular/http';

import { LocalStorageService } from 'angular-2-local-storage';
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
	public  key = 'gigsbookmark';
	public isBookmarked;
	constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl:LoadingController, public alertCtrl: AlertController, public localStorageService: LocalStorageService) {
		this.localStorageService = localStorageService;
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

	gigrmvBookmark(gigid){
		let t_bdtails = [];
		let f_bdtails = [];
		var cur_bookmark = this.localStorageService.get(this.key);
			var exist = 0;
			if(cur_bookmark!=null){
				t_bdtails = Object.keys(cur_bookmark).map(key => cur_bookmark[key]);
				t_bdtails.forEach(function(item, index){
					if(gigid!=item.id)
						f_bdtails.push(item);
				});
			}
			this.localStorageService.set(this.key, f_bdtails);
				this.isBookmarked = false;
	}

	gigBookmark(gigdtails){
		if(this.localStorageService.isSupported) {
			
			let t_bdtails = [];
			var cur_bookmark = this.localStorageService.get(this.key);
			var exist = 0;
			if(cur_bookmark!=null){
				t_bdtails = Object.keys(cur_bookmark).map(key => cur_bookmark[key]);
				t_bdtails.forEach(function(item, index){
					if(gigdtails.id==item.id)
						exist = 1;
				});
			}
			if(exist==0){
				t_bdtails.push(gigdtails);

				this.localStorageService.set(this.key, t_bdtails);
				this.isBookmarked = true;
			}
			console.log(t_bdtails);
		}
	}

}
