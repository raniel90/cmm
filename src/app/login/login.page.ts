import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { UtilsService } from '../utils.service';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loading;
  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private nav: NavController,
    private utils: UtilsService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private af: AngularFirestore) { }

  async login() {
    let msg: string = '';

    await this.presentLoading();
    const response: any = await this.authService.login(this.email, this.password);
    this.utils.dismissLoading(this.loading);
    if (response.success) {
      await this.setUser(response);
      this.nav.navigateRoot(['tabs']);
    } else {
      msg = this.authService.getPtBrMessage(response);
      this.utils.presentAlertConfirm(this.alertController, msg);
    }
  }

  async setUser(response) {
    const user: any = await this.getUserByUid(response.payload.user.uid);

    if (user && user.length) {
      await this.storage.set('user_email', this.email);
      await this.storage.set('user_uid', response.payload.user.uid);
      await this.storage.set('user_root', user[0].root);
    }
  }

  async getUserByUid(uid) {
    const user: any = await this.utils.getValueFromObservable(
      this.af.collection('users', ref =>
        ref.where('uid', '==', uid)).valueChanges()
    );

    return user;
  }

  goToRegister() {
    this.nav.navigateForward(['/register']);
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
    });
    return await this.loading.present();
  }
}
