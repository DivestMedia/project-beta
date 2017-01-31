import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { BookmarksPage } from '../bookmarks/bookmarks';
/*
  Generated class for the Bookmarktabs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'bookmarktabs.html'
})
export class BookmarktabsPage {

   // set the root pages for each tab
  tab1Root: any = BookmarksPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
