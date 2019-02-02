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
  public selectedSegment = 'all';

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

  async listByFilter() {
    let filter = {
      anthem: (this.selectedSegment === 'anthem' ? "Sim" : "Não")
    };

    this.musics = await this.getValueFromObservable(
      this.af.collection('musics', ref => ref
        .where('anthem', '==', filter.anthem)
        .orderBy('name', 'asc')).valueChanges()
    );
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
    if (this.selectedSegment === 'all') {
      await this.list();
    } else {
      this.listByFilter();
    }

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
      this.selectedSegment = $event.detail.value;
      if (this.selectedSegment === 'anthem' && music.anthem === "Sim") {
        return true;
      }

      if (this.selectedSegment === 'song' && music.anthem === "Não") {
        return true;
      }

      if (this.selectedSegment === 'all') {
        return true;
      }

      return false;
    });
  }

}
