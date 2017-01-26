import { Component } from '@angular/core';
import { App, NavController, MenuController, ViewController } from 'ionic-angular';
import { FacebookAuth, Auth, User } from '@ionic/cloud-angular';
// import { LoginPage } from '../login/login';
// import { NewsPage } from '../news/news';
// import { BandsPage } from '../bands/bands';
// import { GigsPage } from '../gigs/gigs';

import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	cur_username:string = '';
  constructor(public viewCtrl: ViewController, public appCtrl: App, public menuCtrl: MenuController, public navCtrl: NavController, public facebookAuth: FacebookAuth, public user:User, public auth:Auth , private localStorageService: LocalStorageService) {
  	this.localStorageService = localStorageService;
    if(this.user.social && this.user.social.facebook){
    	this.cur_username = user.social.facebook.data.full_name;
    }else if(typeof user.details.name != 'undefined'){
    	this.cur_username = user.details.name;
    }
    
  }
   

}
