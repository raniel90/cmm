import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-worship-filter',
  templateUrl: './worship-filter.page.html',
  styleUrls: ['./worship-filter.page.scss'],
})
export class WorshipFilterPage implements OnInit {

  filter = {
    band: null,
    end_date: null,
    start_date: null,
    shift: null
  };

  constructor(
    private storage: Storage,
    private navController: NavController,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  async filterWorship() {
    if (this.filter.start_date && this.filter.end_date && moment(this.filter.end_date).isBefore(moment(this.filter.start_date))) {
      await this.presentAlert('A data de término não pode ser inferior à data inicial!');
      return;
    }

    this.storage.set('worshipFilter', JSON.stringify(this.filter));
    this.storage.set('goToTab2', 'true');
    this.navController.navigateRoot(['/tabs']);
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }
}