import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { NewsPage } from '../news/news';
import { BandsPage } from '../bands/bands';
import { GigsPage } from '../gigs/gigs';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = NewsPage;
  tab2Root: any = GigsPage;
  tab3Root: any = BandsPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
