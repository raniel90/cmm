import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public worships: any;
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

  addWorship() {
    this.nav.navigateForward(['/worship']);
  }

  editWorship(worship) {
    this.nav.navigateForward(['/worship'], { queryParams: { worship: JSON.stringify(worship) } });
  }

  async list() {
    this.worships = await this.getValueFromObservable(
      this.af.collection('worships', ref => ref.orderBy('date', 'desc')).valueChanges()
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
