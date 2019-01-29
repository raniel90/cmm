import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

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

  constructor(
    private af: AngularFirestore,
    private nav: NavController) {
  }

  async ngOnInit() {
    this.list();
  }

  ionViewDidEnter() {
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

  async doRefresh(event) {
    await this.list();

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
      if ($event.detail.value === 'anthem' && music.anthem === "Sim") {
        return true;
      }

      if ($event.detail.value === 'song' && music.anthem === "Não") {
        return true;
      }

      if ($event.detail.value === 'all') {
        return true;
      }

      return false;
    });
  }
}
