import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-select-music',
  templateUrl: './select-music.page.html',
  styleUrls: ['./select-music.page.scss'],
})
export class SelectMusicPage implements OnInit {
  public musicsTemp;
  public musics;
  public filter = {
    name: ''
  };

  constructor(
    private navController: NavController,
    private storage: Storage,
    private af: AngularFirestore) { }

  async ngOnInit() {
    await this.list();
    await this.setSelectedMusics();
  }

  async setSelectedMusics() {
    let musicsSavedById = {};
    let musicsSaved = await this.storage.get('musics');

    
    if (musicsSaved) {
      musicsSaved = JSON.parse(musicsSaved);
      
      musicsSaved.forEach((musicSaved) => {
        musicsSavedById[musicSaved.id] = musicSaved;
      });
    }

    this.musics = this.musics.map((music) => {
      music.selected = false;
      music.hidden = false;

      if (musicsSavedById[music.id]) {
        music.selected = true;
      }

      return music;
    });
  }

  async list() {
    this.musics = await this.getValueFromObservable(
      this.af.collection('musics', ref => ref.orderBy('name', 'asc')).valueChanges()
    );
    this.musicsTemp = this.musics;
  }

  selectMusic(music, index) {
    this.musics[index].selected = !music.selected;
  }

  goBack() {
    let musicsSelected = this.musics.filter((music => music.selected));
    this.storage.set('musics', JSON.stringify(musicsSelected));
    this.navController.navigateBack(['/worship']);
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
