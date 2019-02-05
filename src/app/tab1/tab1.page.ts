import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  public musics: any;
  public musicsTemp: any;
  public filter = {
    name: ''
  };
  public selectedSegment = 'all';

  constructor(
    private af: AngularFirestore,
    private nav: NavController,
    private storage: Storage) {
  }

  async ngOnInit() {
    this.list();
  }

  /**
   * Workaround for tabs
   */
  async redirectAfterAction() {
    const goToTab2 = await this.storage.get('goToTab2');

    if (goToTab2 === 'true') {
      await this.storage.set('goToTab1', 'true');
      await this.storage.remove('goToTab2');
      this.nav.navigateRoot(['/tabs/tab2']);
    }
  }

  async ionViewDidEnter() {
    await this.redirectAfterAction();
    this.list();
  }

  addMusic() {
    this.nav.navigateForward(['/music']);
  }

  editMusic(music) {
    this.nav.navigateForward(['/music'], { queryParams: { music: JSON.stringify(music) } });
  }

  async list() {
    this.musics = await this.getValueFromObservable(
      this.af.collection('musics', ref =>
        ref.orderBy('name', 'asc')).valueChanges()
    );
    this.musicsTemp = this.musics;
  }

  async listByFilter() {
    let filter = {
      anthem: (this.selectedSegment === 'anthem' ? "Sim" : "Não")
    };

    this.musics = await this.getValueFromObservable(
      this.af.collection('musics', ref => ref
        .where('anthem', '==', filter.anthem)
        .orderBy('name', 'asc')).valueChanges()
    );
  }

  async doRefresh(event) {
    if (this.selectedSegment === 'all') {
      await this.list();
    } else {
      this.listByFilter();
    }

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async getValueFromObservable(observable) {
    return await new Promise(resolve => {
      observable.subscribe(data => {
        resolve(data);
      });
    });
  }

  async filterByCategory($event) {
    this.musics = this.musicsTemp.filter((music) => {
      this.selectedSegment = $event.detail.value;
      if (this.selectedSegment === 'anthem' && music.anthem === "Sim") {
        return true;
      }

      if (this.selectedSegment === 'song' && music.anthem === "Não") {
        return true;
      }

      if (this.selectedSegment === 'all') {
        return true;
      }

      return false;
    });
  }
}
