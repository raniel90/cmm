import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

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
    private route: ActivatedRoute,
    private af: AngularFirestore,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private nav: NavController,
    private loadingController: LoadingController,
    private storage: Storage) { }

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
    this.nav.navigateBack(['/tabs/tab2']);
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

    await this.presentLoading();

    let worshipObservable = this.af
      .collection("worships")
      .doc(worship.id);

    if (this.worshipForm.value.id) {
      message = 'Culto alterado com sucesso!';
    }

    await worshipObservable.set(worship);
    await this.savePlaylist(worship);
    await this.storage.remove('musics');
    await this.dismissLoading();
    this.presentAlertConfirm(message);
  }

  async savePlaylist(worship) {
    const isEdit = this.worshipForm.value.id ? true : false;

    if (isEdit) {
      await this.removePlaylist(worship.id);
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

  async removeWorship() {
    const worship = {
      id: this.worshipForm.value.id || new Date().getTime().toString(),
    };

    await this.presentLoading();

    let worshipObservable = this.af
      .collection("worships")
      .doc(worship.id);

    await worshipObservable.delete();
    await this.removePlaylist(worship.id);
    await this.storage.remove('musics');
    await this.dismissLoading();
    this.presentAlertConfirm('Culto removido com sucesso!');
  }

  async removePlaylist(id) {
    const docsToRemove: any = await this.getValueFromObservable(
      this.af.collection('playlists', ref => ref
        .where('worship_id', '==', id))
        .valueChanges()
    );

    if (!docsToRemove) {
      return;
    }

    await docsToRemove.forEach((doc) => {
      const observable = this.af
        .collection("playlists")
        .doc(`${doc.music_id}_${doc.worship_id}`);

      observable.delete();
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

  async presentAlertConfirm(message) {
    const alert = await this.alertController.create({
      header: 'Mensagem',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.goBack();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertRemoveWorship() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você deseja excluir este Culto?',
      buttons: [
        {
          text: 'Sim',
          cssClass: 'color-danger',
          handler: () => {
            this.removeWorship();
          }
        },
        {
          text: 'Não',
          handler: () => {

          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Por favor, aguarde...',
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
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
}
