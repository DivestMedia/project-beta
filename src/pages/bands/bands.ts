import { Component } from '@angular/core';
import { App, NavController, AlertController, LoadingController } from 'ionic-angular';

import { Http } from '@angular/http';
// import { Observable } from 'rxjs/Observable';

// import { LocalStorageService } from 'angular-2-local-storage';

import { SingleBandPage } from '../single-band/single-band';

@Component({
	selector: 'page-bands',
	templateUrl: 'bands.html'
})
export class BandsPage {

	public Bands = [];
	public link = 'http://www.gigsmanila.com/api/bands/';
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

		this.is_infinite = false;

		let response$ = this.http.get(this.link+'1/').map((res) => res.json());
		// let response$ = this.http.get(this.link+this.cur_page+'/'+this.cur_limit+'/').map((res) => res.json());
		response$.subscribe(
			response => {
				this.Bands = response;
				console.log(response);
				loader.dismissAll();
			}, error => {
				loader.dismissAll();
				let alert = this.alertCtrl.create({
					title:'', 
					subTitle:'Fetching bands failed!',
					buttons:['OK']
				});
				alert.present();
			}
		);
		this.genCharArray('A', 'Z');
	}

	bandFilter(filter_val){
		this.is_active = filter_val;
		if(filter_val=='0-9')
			filter_val = 1;

		let loader = this.loadingCtrl.create({
		    content: "Please wait..."
		});
		loader.present();

		let response$ = this.http.get(this.link+filter_val+'/').map((res) => res.json());

		this.is_infinite = false;
		response$.subscribe(
			response => {
				this.Bands = response;
				loader.dismissAll();

			}, error => {
				loader.dismissAll();
				let alert = this.alertCtrl.create({
					title:'', 
					subTitle:'Fetching bands failed!',
					buttons:['OK']
				});
				alert.present();
			}
		);
	}

	genCharArray(charA, charZ) {
	    var i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
	    this.filter.push('0-9');
	    for (; i <= j; ++i) {
	        this.filter.push(String.fromCharCode(i));
	    }
	}

	goToSingleBand(bandID){
		this.appCtrl.getRootNav().push(SingleBandPage,{
	  		bandID: bandID
	  	});
	}

 	doInfinite(infiniteScroll) {
	    this.cur_page = this.cur_page+1;
	    // let key = 'news_p_'+this.cur_page;
  	
		let response$ =  this.http.get(this.link+this.cur_page+'/'+this.cur_limit+'/').map((res) => res.json());
		response$.subscribe(
			response => {
				if(response.length>0){
		    		var itr = 0;
		    		while(itr < response.length){
		    			this.Bands.push(response[itr]);
		    			itr++;
		    		}
		    	}
				infiniteScroll.complete();
			}, error => {
				this.cur_page = this.cur_page-1;
				let alert = this.alertCtrl.create({
					title:'', 
					subTitle:'Fetching bands failed!',
					buttons:['OK']
				});
				alert.present();
				infiniteScroll.complete();
				infiniteScroll.enable(false);
			}
		);
  	}


}
