import { Component } from '@angular/core';
import { App, NavController, AlertController, LoadingController } from 'ionic-angular';

import { Http } from '@angular/http';
// import { Observable } from 'rxjs/Observable';

import { NewsServices } from '../../providers/news-services';

import { LocalStorageService } from 'angular-2-local-storage';

import { SingleNewsPage } from '../single-news/single-news';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})

export class NewsPage {
	public LatestNews = [];
	public link = 'http://www.gigsmanila.com/api/news/';
	public cur_page = 1;

  constructor(public appCtrl: App, public navCtrl: NavController, public alertCtrl: AlertController, public http: Http, public loadingCtrl:LoadingController, public NewsSrvc:NewsServices,  private localStorageService: LocalStorageService) {
  	this.NewsSrvc = NewsSrvc;
  	this.http = http;
  	this.localStorageService = localStorageService;

  	// var offline = Observable.fromEvent(window, "offline");
   //  var online = Observable.fromEvent(window, "online");

   //  offline.subscribe(() => {
   //      alert('offline');
   //  });

   //  online.subscribe(()=>{
   //      alert('online');
   //  });

  	let loader = this.loadingCtrl.create({
	    content: "Please wait..."
	});
	loader.present();
	// localStorageService.clearAll();
	let key = 'news_p_'+this.cur_page;
	if(this.localStorageService.isSupported) {
		if(this.localStorageService.get(key)===null){
			let response$ = NewsSrvc.getNews(this.link,this.cur_page);
			response$.subscribe(
				response => {
					this.LatestNews = response;
					localStorageService.set(key, response);
					console.log(response);
					loader.dismissAll();
				}, error => {
					loader.dismissAll();
					let alert = this.alertCtrl.create({
						title:'', 
						subTitle:'Fetching news failed!',
						buttons:['OK']
					});
					alert.present();
				}
			);
		}else{
			loader.dismissAll();
			let cache_data: any =  this.localStorageService.get(key);
			this.LatestNews = cache_data;
		}
	}else{
		let response$ = NewsSrvc.getNews(this.link,this.cur_page);
		response$.subscribe(
			response => {
				this.LatestNews = response;
				console.log(response);
				loader.dismissAll();
			}, error => {
				loader.dismissAll();
				let alert = this.alertCtrl.create({
					title:'', 
					subTitle:'Fetching news failed!',
					buttons:['OK']
				});
				alert.present();
			}
		);
	}
	
  }

	goToSingleNews(news){
  	this.appCtrl.getRootNav().push(SingleNewsPage,{
  		news: news
  	});
  }

  doRefresh(refresher) {
  	this.cur_page = 1;
    // const response$ = this.NewsSrvc.getNews(this.link,this.cur_page);

 	let key = 'news_p_'+this.cur_page;
	if(this.localStorageService.isSupported) {
		if(this.localStorageService.get(key)===null){
			let response$ = this.NewsSrvc.getNews(this.link,this.cur_page);
			response$.subscribe(
				response => {
					this.LatestNews = response;
					this.localStorageService.set(key, response);
					console.log(response);
					refresher.complete();
				}, error => {
					let alert = this.alertCtrl.create({
						title:'', 
						subTitle:'Fetching news failed!',
						buttons:['OK']
					});
					alert.present();
				}
			);
		}else{
			let cache_data: any =  this.localStorageService.get(key);
			this.LatestNews = cache_data;
			refresher.complete();
		}
	}else{
		let response$ = this.NewsSrvc.getNews(this.link,this.cur_page);
		response$.subscribe(
			response => {
				this.LatestNews = response;
				console.log(response);
				refresher.complete();
			}, error => {
				let alert = this.alertCtrl.create({
					title:'', 
					subTitle:'Fetching news failed!',
					buttons:['OK']
				});
				alert.present();
				refresher.complete();
			}
		);
	}
  }

  doInfinite(infiniteScroll) {
    this.cur_page = this.cur_page+1;
    let key = 'news_p_'+this.cur_page;
  	if(this.localStorageService.isSupported) {
		if(this.localStorageService.get(key)===null){
			let response$ = this.NewsSrvc.getNews(this.link,this.cur_page);
			response$.subscribe(
				response => {
					this.localStorageService.set(key, response);
					if(response.length>0){
			    		var itr = 0;
			    		while(itr < response.length){
			    			this.LatestNews.push(response[itr]);
			    			itr++;
			    		}
			    	}
					infiniteScroll.complete();
				}, error => {
					this.cur_page = this.cur_page-1;
					let alert = this.alertCtrl.create({
						title:'', 
						subTitle:'Fetching news failed!',
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
	    			this.LatestNews.push(cache_data[itr]);
	    			itr++;
	    		}
	    	}
			infiniteScroll.complete();
		}
	}else{
		let response$ = this.NewsSrvc.getNews(this.link,this.cur_page);
		response$.subscribe(
			response => {
				if(response.length>0){
		    		var itr = 0;
		    		while(itr < response.length){
		    			this.LatestNews.push(response[itr]);
		    			itr++;
		    		}
		    	}
				infiniteScroll.complete();
			}, error => {
				this.cur_page = this.cur_page-1;
				let alert = this.alertCtrl.create({
					title:'', 
					subTitle:'Fetching news failed!',
					buttons:['OK']
				});
				alert.present();
				infiniteScroll.complete();
				infiniteScroll.enable(false);
			}
		);
	}
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad NewsPage');
  // }

}
