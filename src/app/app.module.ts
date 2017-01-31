
import { NgModule, ErrorHandler } from '@angular/core';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { NewsPage } from '../pages/news/news';
import { SingleNewsPage } from '../pages/single-news/single-news';
import { BandsPage } from '../pages/bands/bands';
import { SingleBandPage } from '../pages/single-band/single-band';
import { GigsPage } from '../pages/gigs/gigs';
import { SingleGigPage } from '../pages/single-gig/single-gig';
import { VenuesPage } from '../pages/venues/venues';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { BookmarktabsPage } from '../pages/bookmarktabs/bookmarktabs';

// Services
import { NewsServices } from '../providers/news-services';

// Plugins
import { LocalStorageModule } from 'angular-2-local-storage';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'bc75e59b'
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    NewsPage,
    SingleNewsPage,
    BandsPage,
    SingleBandPage,
    GigsPage,
    SingleGigPage,
    TabsPage,
    VenuesPage,
    BookmarksPage,
    BookmarktabsPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    LocalStorageModule.withConfig({
            prefix: 'MyApp',
            storageType: 'localStorage'
        })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    NewsPage,
    SingleNewsPage,
    BandsPage,
    SingleBandPage,
    GigsPage,
    SingleGigPage,
    TabsPage,
    VenuesPage,
    BookmarksPage,
    BookmarktabsPage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},NewsServices]
})
export class AppModule {}