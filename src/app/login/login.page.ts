import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { UtilsService } from '../utils.service';
import { Storage } from '@ionic/storage';

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
    private alertController: AlertController) { }

  async login() {
    let msg: string = '';

    await this.presentLoading();
    const response: any = await this.authService.login(this.email, this.password);
    this.utils.dismissLoading(this.loading);
    if (response.success) {
      this.storage.set('email', this.email);
      this.storage.set('uid', response.payload.user.uid);
      this.nav.navigateRoot(['tabs']);
    } else {
      msg = this.authService.getPtBrMessage(response);
      this.utils.presentAlertConfirm(this.alertController, msg);
    }
  }

  logout() {
    this.authService.logout();
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
