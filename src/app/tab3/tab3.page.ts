import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    private af: AngularFirestore,
    private actionSheet: ActionSheetController,
    private storage: Storage,
    private nav: NavController,
    private utils: UtilsService
  ) { }

  musics = [];
  reportName = '';
  musicsTemp = {};
  objectKeys = Object.keys;

  async ionViewDidEnter() {
    this.reportName = '';
    this.mount();
  }

  async mount() {
    let playlists: any = await this.utils.getValueFromObservable(
      this.af.collection('playlists').valueChanges()
    );
    let musicsArray: any = await this.utils.getValueFromObservable(
      this.af.collection('musics').valueChanges()
    );

    musicsArray.forEach((music) => {
      this.musicsTemp[music.id] = {
        ...music,
        count: 0,
        worshipIds: {}
      };
    });

    playlists.forEach((playlist) => {
      if (this.musicsTemp[playlist.music_id]) {
        this.musicsTemp[playlist.music_id].count++;
        this.musicsTemp[playlist.music_id].worshipIds[playlist.worship_id] = true;
      }
    });
  }

  async doRefresh(event) {
    await this.mount();
    this.showReport();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  showReport() {
    if (this.reportName === 'more_played') {
      this.musicsPlayed('desc');
    }

    if (this.reportName === 'less_played') {
      this.musicsPlayed('asc');
    }
  }

  musicsPlayed(orderBy) {
    let musicsTempArray = [];

    Object.keys(this.musicsTemp).forEach((key) => musicsTempArray.push(this.musicsTemp[key]));
    this.musics = _.orderBy(musicsTempArray, ['count'], [orderBy]);
  }

  async viewHistoryPlayed(music) {
    await this.storage.set('musicHistory', JSON.stringify(music));
    this.nav.navigateForward(['/history-played']);
  }
}
