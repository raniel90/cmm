import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private nav: NavController,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const uid = await this.storage.get('user_uid');

    await this.platform.ready()
    this.statusBar.styleDefault();
    this.splashScreen.hide();

    if (!uid) {
      this.nav.navigateRoot(['login']);
    }
  }
}
