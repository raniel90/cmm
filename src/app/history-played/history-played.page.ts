import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-history-played',
  templateUrl: './history-played.page.html',
  styleUrls: ['./history-played.page.scss'],
})
export class HistoryPlayedPage implements OnInit {

  constructor(
    private af: AngularFirestore,
    private nav: NavController,
    private storage: Storage,
    private utils: UtilsService
  ) { }

  music: any = {};
  worships = [];

  goBack() {
    this.nav.navigateBack(['tabs/tab3']);
  }

  async ngOnInit() {
    let worships = [];
    let keys = [];
    let musicHistory = await this.storage.get('musicHistory');

    if (musicHistory) {
      this.music = JSON.parse(musicHistory);
    }

    keys = Object.keys(this.music.worshipIds);

    for (let i = 0; i < keys.length; i++) {
      const worshipId = keys[i];
      const worship = await this.getWorship(worshipId);
      worships.push(worship[0]);
    }

    this.worships = _.orderBy(worships, ['date'], ['desc']);
  }

  async getWorship(worshipId) {
    return await this.utils.getValueFromObservable(
      this.af.collection('worships', ref => ref.where('id', '==', worshipId)).valueChanges());
  }

  async ngOnDestroy() {
    await this.storage.remove('musicHistory');
  }
}
