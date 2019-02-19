import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-worship',
  templateUrl: './worship.page.html',
  styleUrls: ['./worship.page.scss'],
})
export class WorshipPage implements OnInit {
  public worship;
  public loading: any;
  public worshipForm: FormGroup;

  constructor(
    private af: AngularFirestore,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private nav: NavController,
    private loadingController: LoadingController,
    private storage: Storage,
    private utils: UtilsService) { }

  initForm() {
    this.worshipForm = this.formBuilder.group({
      id: [null],
      date: [new Date().toISOString()],
      band: [null],
      shift: [null],
      musics: [[]]
    });
  }

  async ngOnDestroy() {
    await this.storage.remove('worship');
    await this.storage.remove('musics');
  }

  async ionViewDidEnter() {
    let musics = await this.storage.get('musics');

    if (musics) {
      this.worshipForm.value.musics = JSON.parse(musics) || [];
    }
  }

  goBack() {
    this.storage.set('goToTab2', 'true');
    this.nav.navigateBack(['/tabs']);
  }

  async ngOnInit() {
    this.initForm();
    await this.mount();
  }

  async mount() {
    let worship = await this.storage.get('worship');

    if (!worship) {
      return;
    }

    worship = JSON.parse(worship);

    if (worship) {
      this.worshipForm = this.formBuilder.group({
        id: [worship.id],
        date: [worship.date],
        band: [worship.band],
        shift: [worship.shift],
        musics: [worship.musics]
      })
    }
  }

  async saveWorship() {
    let message = 'Culto cadastrado com sucesso!';
    const worship = {
      id: this.worshipForm.value.id || new Date().getTime().toString(),
      date: this.worshipForm.value.date,
      band: this.worshipForm.value.band,
      shift: this.worshipForm.value.shift,
      musics: this.worshipForm.value.musics
    };

    if (!worship.musics || !worship.musics.length) {
      await this.presentAlert("Por favor, selecione pelo menos uma música");
      return;
    }

    this.loading = await this.utils.presentLoading(this.alertController);
    this.loading.present();

    let worshipObservable = this.af
      .collection("worships")
      .doc(worship.id);

    if (this.worshipForm.value.id) {
      message = 'Culto alterado com sucesso!';
    }

    await worshipObservable.set(worship);
    await this.savePlaylist(worship);
    await this.storage.remove('musics');
    await this.utils.dismissLoading(this.loading);
    await this.utils.presentAlertConfirm(this.alertController, message, () => this.goBack());
  }

  async savePlaylist(worship) {
    const isEdit = this.worshipForm.value.id ? true : false;

    if (isEdit) {
      await this.utils.removePlaylist(worship.id);
    }

    await worship.musics.forEach((music) => {
      const observable = this.af
        .collection("playlists")
        .doc(`${music.id}_${worship.id}`);

      observable.set({
        music_id: music.id,
        worship_id: worship.id,
        date: worship.date
      });
    });
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

  addMusics() {
    this.storage.set('musics', JSON.stringify(this.worshipForm.value.musics));
    this.nav.navigateForward(['/select-music']);
  }

  async getValueFromObservable(observable) {
    return await new Promise(resolve => {
      observable.subscribe(data => {
        resolve(data);
      });
    });
  }

  reorderItems(ev) {
    let musicSelectedTemp: any[] = this.worshipForm.value.musics;
    let itemToMove = musicSelectedTemp.splice(ev.detail.from, 1)[0];

    musicSelectedTemp.splice(ev.detail.to, 0, itemToMove);
    musicSelectedTemp.forEach((item, index) => musicSelectedTemp[index].order = index);
    this.worshipForm.value.musics = musicSelectedTemp;

    ev.detail.complete();
  }
}
