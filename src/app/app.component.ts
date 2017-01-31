import { Component, ViewChild } from '@angular/core';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Platform, App, Nav, MenuController } from 'ionic-angular';
import { FacebookAuth, Auth, User } from '@ionic/cloud-angular';
import { LocalStorageService } from 'angular-2-local-storage';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NewsPage } from '../pages/news/news';
import { BandsPage } from '../pages/bands/bands';
import { TabsPage } from '../pages/tabs/tabs';
import { VenuesPage } from '../pages/venues/venues';
import { BookmarktabsPage } from '../pages/bookmarktabs/bookmarktabs';


export interface PageInterface {
  title: string;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  @ViewChild(Nav) nav: Nav;

  appPages: PageInterface[] = [
    { title: 'Home', tabComponent: HomePage, icon: 'home' },
    { title: 'Gigs', tabComponent: TabsPage, index: 1, icon: 'headset' },
    { title: 'Bands', tabComponent: BandsPage, index: 2, icon: 'microphone' },
    { title: 'News', tabComponent: NewsPage, index: 3, icon: 'paper' },
    { title: 'Venues', tabComponent: VenuesPage, index: 4, icon: 'pin' },
    { title: 'Bookmarks', tabComponent: BookmarktabsPage, index: 5, icon: 'bookmark' },
  ];

  constructor(platform: Platform, public appCtrl: App, public menuCtrl: MenuController, public facebookAuth: FacebookAuth, public user:User, public auth:Auth , private localStorageService: LocalStorageService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      if(this.auth.isAuthenticated()) {
        this.enableMenu(true);

        this.rootPage = HomePage;
      } else {
        this.enableMenu(false);
        this.rootPage = LoginPage; 
      
      }

    });
  }

  enableMenu(loggedIn: boolean) {
    this.menuCtrl.enable(loggedIn, 'loggedInMenu');
  }

  openPage(page: PageInterface) {
    if (page.index) {
      this.nav.setRoot(page.tabComponent, { tabIndex: page.index });
    } else {
      this.nav.setRoot(page.tabComponent).catch(() => {
        console.log("Didn't set nav root");
      });
    }
  }

  logout() {
    this.localStorageService.clearAll();
    if(this.user.social && this.user.social.facebook) {
      this.facebookAuth.logout();
    } else {
      this.auth.logout();
    }
    this.enableMenu(false);
    this.nav.setRoot(LoginPage);
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }
    if (this.nav.getActive() && this.nav.getActive().component === page.tabComponent) {
      return 'primary';
    }
    return;
  }
}