import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {

  public isNew: boolean;
  musicForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private af: AngularFirestore,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private nav: NavController
  ) {
  }

  initForm() {
    this.musicForm = this.formBuilder.group({
      id: [null],
      name: [null],
      artist: [null]
    });
  }

  goBack() {
    this.nav.navigateBack(['/tabs/tab1']);
  }

  async ngOnInit() {
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
          artist: [music.artist]
        })
      }
    });
  }

  async saveMusic() {
    let message = 'Música cadastrada com sucesso!';
    const music = {
      id: this.musicForm.value.id || new Date().getTime().toString(),
      name: this.musicForm.value.name,
      artist: this.musicForm.value.artist
    };

    let musicObservable = this.af
      .collection("musics")
      .doc(music.id);

    if (this.musicForm.value.id) {
      message = 'Música alterada com sucesso!';
    }  

    await musicObservable.set(music);
    this.presentAlertConfirm(message);
  }

  async removeMusic() {
    const music = {
      id: this.musicForm.value.id || new Date().getTime().toString(),
    };

    let musicObservable = this.af
      .collection("musics")
      .doc(music.id);

    await musicObservable.delete();
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

}
