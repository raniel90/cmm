import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../utils.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
})
export class GeneralPage {

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private utils: UtilsService,
    private alertController: AlertController,
    private nav: NavController) { }


  async beforeLogout() {
    const buttonActions = {
      label_yes: 'Sim',
      label_no: 'Não',
      with_cancel: true
    };
    await this.utils.presentAlertConfirm(
      this.alertController, 'Deseja sair da aplicação?', () => this.logout(), buttonActions);
  }

  async logout() {
    await this.authService.logout();
    await this.storage.clear();
    this.nav.navigateRoot(['login']);
  }
}
