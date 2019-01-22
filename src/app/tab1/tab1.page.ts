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
    this.nav.navigateForward(['/music'], { queryParams: { is_new: true } });
  }

  async list() {
    this.musics = await this.getValueFromObservable(
      this.af.collection('musics', ref => ref.orderBy('name', 'asc')).valueChanges()
    );
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
}
