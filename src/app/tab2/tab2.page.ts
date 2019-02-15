import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public worships: any;
  public worshipFilter;
  public worshipsTemp;
  public filter = {
    name: ''
  };

  constructor(
    private af: AngularFirestore,
    private nav: NavController,
    private storage: Storage,
    private actionSheet: ActionSheetController,
    private utils: UtilsService, ) {
  }

  async ngOnInit() {
    this.worshipFilter = null;
    await this.storage.remove('worshipFilter');
    this.list();
  }

  async ionViewWillEnter() {
    let worshipFilter = await this.storage.get('worshipFilter');

    if (worshipFilter) {
      this.worshipFilter = JSON.parse(worshipFilter);
      this.worships = [];
      this.applyFilter();
    } else {
      await this.list();
    }
  }

  async ngOnDestroy() {
    await this.storage.remove('worshipFilter');
  }

  addWorship() {
    this.nav.navigateForward(['/worship']);
  }

  async editWorship(worship) {
    await this.storage.set('worship', JSON.stringify(worship));
    this.nav.navigateForward(['/worship']);
  }

  applyFilter() {
    const filter = this.worshipFilter || {};

    this.worships = this.worshipsTemp.filter((worship) => {
      let date = null;
      let startDate = null;
      let endDate = null;

      if (filter.start_date && filter.end_date) {
        date = moment(moment(worship.date).format('YYYY-MM-DD'), 'YYYY-MM-DD');
        startDate = moment(filter.start_date).format('YYYY-MM-DD');
        endDate = moment(filter.end_date).format('YYYY-MM-DD');

        if (!date.isBetween(startDate, endDate, null, '[]')) {
          return false;
        }
      }

      if (filter.band && worship.band !== filter.band) {
        return false;
      }

      if (filter.shift && worship.shift !== filter.shift) {
        return false;
      }

      return true;
    });
  }

  async list() {
    this.worships = await this.utils.getValueFromObservable(this.af.collection('worships', ref => ref
      .orderBy('date', 'desc')
    ).valueChanges());
    this.worshipsTemp = this.worships;
  }

  async doRefresh(event) {
    await this.list();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  filterWorship() {
    this.nav.navigateForward(['/worship-filter']);
  }

  async showOptions(worship) {
    let buttons = [];

    buttons.push({
      text: `Compartilhar no Whatsapp`,
      handler: () => {
        let data;
        let musics = `*Músicas*:\n\n`;
        const header = `*Banda:* ${worship.band}\n*Culto:* ${worship.shift}\n\n`;

        worship.musics.forEach((worshipMusic) => {
          musics += `Banda/Artista: ${worshipMusic.artist}\nNome da música: ${worshipMusic.name}\nInício da música: ${worshipMusic.beginMusic}\n\n`;
        });

        data = `${header}${musics}`;

        let target = `https://wa.me/?text=${encodeURIComponent(data)}`;

        this.utils.openUrl(target);
      }
    });

    buttons.push({
      text: `Detalhar/Alterar Culto`,
      handler: () => {
        this.editWorship(worship);
      }
    });

    const actionSheet = await this.actionSheet.create({
      header: `Ações`,
      buttons: buttons
    });
    await actionSheet.present();
  }
}
