import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
  musicForm: FormGroup;
  loading: any;
  themes;

  constructor(
    private route: ActivatedRoute,
    private af: AngularFirestore,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private nav: NavController,
    private loadingController: LoadingController,
    private themeService: ThemeService
  ) {
  }

  initForm() {
    this.musicForm = this.formBuilder.group({
      id: [null],
      name: [null],
      beginMusic: [null],
      link: [null],
      artist: [null],
      anthem: [null],
      theme: [null],
      tone: [null],
      reference: [null],
      sheetMusic: [null],
    });

    
  }

  goBack() {
    this.nav.navigateRoot(['/tabs']);
  }

  async ngOnInit() {
    this.themes = this.themeService.getThemes();
    this.initForm();
    this.mount();
  }

  mount() {
    this.route.queryParams.subscribe(params => {
      let music;

      if (!params || !params.music) {
        return;
      }

      music = JSON.parse(params.music);

      if (music) {
        this.musicForm = this.formBuilder.group({
          id: [music.id],
          name: [music.name],
          beginMusic: [music.beginMusic],
          link: [music.link],
          artist: [music.artist],
          anthem: [music.anthem],
          theme: [music.theme],
          tone: [music.tone],
          reference: [music.reference],
          sheetMusic: [music.sheetMusic],
        })
      }
    });
  }

  async saveMusic() {
    let message = 'Música cadastrada com sucesso!';
    const music = {
      id: this.musicForm.value.id || new Date().getTime().toString(),
      name: this.musicForm.value.name,
      beginMusic: this.musicForm.value.beginMusic,
      link: this.musicForm.value.link,
      artist: this.musicForm.value.artist,
      anthem: this.musicForm.value.anthem,
      theme: this.musicForm.value.theme,
      tone: this.musicForm.value.tone,
      reference: this.musicForm.value.reference,
      sheetMusic: this.musicForm.value.sheetMusic
    };

    await this.presentLoading();

    let musicObservable = this.af
      .collection("musics")
      .doc(music.id);

    if (this.musicForm.value.id) {
      message = 'Música alterada com sucesso!';
    }

    await musicObservable.set(music);
    await this.dismissLoading();
    this.presentAlertConfirm(message);
  }

  async removeMusic() {
    let hasMusicInPlaylist: any;

    await this.presentLoading();

    hasMusicInPlaylist = await this.hasMusicInPlaylist();

    if (hasMusicInPlaylist) {
      await this.dismissLoading();
      await this.presentAlert('Não é possível remover esta música, pois ela já está cadastrada em um culto!');
      return;
    }

    let musicObservable = this.af
      .collection("musics")
      .doc(this.musicForm.value.id);

    await musicObservable.delete();
    await this.dismissLoading();
    this.presentAlertConfirm('Música removida com sucesso!');
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

  async presentAlertRemoveMusic() {
    const alert = await this.alertController.create({
      header: 'Atenção',
      message: 'Você deseja excluir esta música?',
      buttons: [
        {
          text: 'Sim',
          cssClass: 'color-danger',
          handler: () => {
            this.removeMusic();
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

  async hasMusicInPlaylist() {
    let hasMusicInPlaylist = false;

    const musicFromPlaylist: any = await this.getValueFromObservable(
      this.af.collection('playlists', ref => ref
        .where('music_id', '==', this.musicForm.value.id)
        .limit(1))
        .valueChanges()
    );

    if (musicFromPlaylist && musicFromPlaylist.length) {
      hasMusicInPlaylist = true;
    }

    return hasMusicInPlaylist;
  }

  async getValueFromObservable(observable) {
    return await new Promise(resolve => {
      observable.subscribe(data => {
        resolve(data);
      });
    });
  }

}
