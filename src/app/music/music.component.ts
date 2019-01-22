import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
      name: [null]
    });
  }

  goBack() {
    this.nav.navigateBack(['/tabs/tab1']);
  }

  async ngOnInit() {
    this.initForm();

    this.route.queryParams.subscribe(params => {
      this.isNew = params.is_new;
    });
  }

  async addMusic() {
    const music = {
      name: this.musicForm.value.name,
    };

    let musicObservable = this.af
      .collection("musics")
      .doc(new Date().getTime().toString());

    await musicObservable.set(music);
    this.presentAlertConfirm();
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: 'Música cadastrada com sucesso!',
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

}
