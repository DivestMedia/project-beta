import { Component } from '@angular/core';
import { App, NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
// import { Observable } from 'rxjs/Observable';

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
	public gigs_cat: any;

	constructor(public navCtrl: NavController,  public loadingCtrl:LoadingController, public alertCtrl: AlertController, public http: Http, public appCtrl: App, public  navParams: NavParams, public localStorageService: LocalStorageService) {
  		this.cur_page = 1;
  		this.gigs_cat = navParams.data;
  		if(typeof this.gigs_cat != 'undefined'){
  			if(this.gigs_cat!=='latest')
  				this.link = this.link+this.gigs_cat+'/';
  		}

		let loader = this.loadingCtrl.create({
		    content: "Please wait..."
		});
		loader.present();

		let key = 'gigs_'+this.gigs_cat+'_'+this.cur_page;
		if(this.localStorageService.isSupported) {
			if(this.localStorageService.get(key)===null){
				let response$ = this.http.get(this.link+this.cur_page+'/'+this.cur_limit+'/').map((res) => res.json());
				response$.subscribe(
					response => {
						this.gigs = response;
						localStorageService.set(key, response);
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
			}else{
				loader.dismissAll();
				let cache_data: any =  this.localStorageService.get(key);
				this.gigs = cache_data;
			}
		}else{
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
	}

	goToSingleGig(gigID){
		this.appCtrl.getRootNav().push(SingleGigPage,{
	  		gigID: gigID
	  	});
	}

	doInfinite(infiniteScroll) {
	    this.cur_page = this.cur_page+1;
	    let key = 'gigs_'+this.gigs_cat+'_'+this.cur_page;
	  	if(this.localStorageService.isSupported) {
			if(this.localStorageService.get(key)===null){
				let response$ = this.http.get(this.link+this.cur_page+'/'+this.cur_limit+'/').map((res) => res.json());
				response$.subscribe(
					response => {
						this.localStorageService.set(key, response);
						if(response.length>0){
				    		var itr = 0;
				    		while(itr < response.length){
				    			this.gigs.push(response[itr]);
				    			itr++;
				    		}
				    	}
						infiniteScroll.complete();
					}, error => {
						this.cur_page = this.cur_page-1;
						let alert = this.alertCtrl.create({
							title:'', 
							subTitle:'Fetching gigs failed!',
							buttons:['OK']
						});
						alert.present();
						infiniteScroll.complete();
						infiniteScroll.enable(false);
					}
				);
			}else{
				let cache_data: any =  this.localStorageService.get(key);
				if(cache_data.length>0){
		    		var itr = 0;
		    		while(itr < cache_data.length){
		    			this.gigs.push(cache_data[itr]);
		    			itr++;
		    		}
		    	}
				infiniteScroll.complete();
			}
		}else{
			let response$ = this.http.get(this.link+this.cur_page+'/'+this.cur_limit+'/').map((res) => res.json());
			response$.subscribe(
				response => {
					if(response.length>0){
			    		var itr = 0;
			    		while(itr < response.length){
			    			this.gigs.push(response[itr]);
			    			itr++;
			    		}
			    	}
					infiniteScroll.complete();
				}, error => {
					this.cur_page = this.cur_page-1;
					let alert = this.alertCtrl.create({
						title:'', 
						subTitle:'Fetching gigs failed!',
						buttons:['OK']
					});
					alert.present();
					infiniteScroll.complete();
					infiniteScroll.enable(false);
				}
			);
		}
	}
}
