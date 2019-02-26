import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { UtilsService } from '../utils.service';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  loading;
  email: string;
  password: string;

  constructor(private authService: AuthService,
    private storage: Storage,
    private nav: NavController,
    private utils: UtilsService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private af: AngularFirestore) { }

  async signup() {
    let msg = '';

    await this.presentLoading();
    const response: any = await this.authService.signup(this.email, this.password);

    if (response.success) {
      this.storage.set('user_email', this.email);
      this.storage.set('user_uid', response.payload.user.uid);
      await this.saveUser(this.email, response.payload.user.uid)
      this.utils.dismissLoading(this.loading);
      this.nav.navigateRoot(['tabs']);
    } else {
      this.utils.dismissLoading(this.loading);
      msg = this.authService.getPtBrMessage(response);
      this.utils.presentAlertConfirm(this.alertController, msg);
    }
  }

  async saveUser(email, uid) {
    let musicObservable = this.af
      .collection('users')
      .doc(email);

    await musicObservable.set({
      email: email,
      uid: uid
    });
  }

  goBack() {
    this.nav.navigateBack(['/login']);
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
    });
    return await this.loading.present();
  }

}
