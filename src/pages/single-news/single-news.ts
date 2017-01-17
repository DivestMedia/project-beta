import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the SingleNews page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-single-news',
  templateUrl: 'single-news.html'
})
export class SingleNewsPage {

	news_title: string = '';
	news_thumb: string = '';
	news_content: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  	let news_data = navParams.get('news');
  	if(typeof news_data != 'undefined'){
  		this.news_title = news_data.title;
  		this.news_thumb = news_data.thumb;
  		this.news_content = news_data.content;
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleNewsPage');
  }

}
