import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private af: AngularFirestore
  ) {
  }

  openUrl(target) {
    let a = document.createElement('a')
    a.target = '_blank'
    a.href = target;
    a.click();
  }

  async getValueFromObservable(observable) {
    return await new Promise(resolve => {
      observable.subscribe(data => {
        resolve(data);
      });
    });
  }

  async presentAlertConfirm(controller, message, callback?, options?) {
    let buttons = [{
      text: options && options.label_yes ? options.label_yes : 'Ok',
      handler: () => {
        if (callback) {
          callback();
        }
      },
    }];

    if (options && options.with_cancel) {
      buttons.push({
        text: options && options.label_no ? options.label_no : 'Cancelar',
        handler: () => {
        },
      });
    }

    const alert = await controller.create({
      header: 'Mensagem',
      message: message,
      buttons: buttons
    });

    await alert.present();
  }

  async presentLoading(controller) {
    const loading = await controller.create({
      message: 'Por favor, aguarde...',
    });
    return await loading;
  }

  async dismissLoading(loading) {
    if (loading) {
      await loading.dismiss();
    }
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
}
