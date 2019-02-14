import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  public themes: any;
  public themesTemp: any;
  public filter = {
    name: '',
    themes: []
  };
  public selectedSegment = 'all';
  public selectedTheme = 'all';

  constructor(
    private af: AngularFirestore,
    private nav: NavController,
    private storage: Storage,
    private actionSheet: ActionSheetController,
    private themeService: ThemeService) {
  }

  async ngOnInit() {
    this.filter.themes = this.themeService.getThemes();
    this.list();
  }

  /**
   * Workaround for tabs
   */
  async redirectAfterAction() {
    const goToTab2 = await this.storage.get('goToTab2');

    if (goToTab2 === 'true') {
      await this.storage.set('goToTab1', 'true');
      await this.storage.remove('goToTab2');
      this.nav.navigateRoot(['/tabs/tab2']);
    }
  }

  async ionViewDidEnter() {
    await this.redirectAfterAction();
    this.list();
  }

  addMusic() {
    this.nav.navigateForward(['/music']);
  }

  editMusic(music) {
    this.nav.navigateForward(['/music'], { queryParams: { music: JSON.stringify(music) } });
  }

  async list() {
    let themesObj = {}
    let themesArray = [];
    let musicsArray: any = await this.getValueFromObservable(
      this.af.collection('musics', ref =>
        ref.orderBy('name', 'asc')).valueChanges()
    );

    musicsArray.forEach((music) => {
      if (music.theme && music.theme.length) {
        music.theme.forEach((item) => {
          if (!themesObj[item]) {
            themesObj[item] = {
              musics: {}
            };
          }

          themesObj[item].musics[music.id] = music;
        });
      }
    });

    Object.keys(themesObj).forEach((themeKey) => {
      let musics = [];
      const theme = themesObj[themeKey];

      Object.keys(theme.musics).forEach((musicKey) => {
        musics.push(theme.musics[musicKey]);
      });

      themesArray.push({
        name: themeKey,
        musics: _.orderBy(musics, ['name'], ['asc'])
      });
    });

    this.themes = _.orderBy(themesArray, ['name'], ['asc']);
    this.themesTemp = this.themes;
  }

  async listByFilter() {
    let filter = {
      anthem: (this.selectedSegment === 'anthem' ? "Sim" : "Não")
    };

    this.themes = await this.getValueFromObservable(
      this.af.collection('musics', ref => ref
        .where('anthem', '==', filter.anthem)
        .orderBy('name', 'asc')).valueChanges()
    );
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

  filterData() {
    this.themes = this.themesTemp.map((theme) => {
      const musics = theme.musics.filter((music) => {
        if (this.selectedSegment === 'anthem' && music.anthem === "Não") {
          return false;
        }

        if (this.selectedSegment === 'song' && music.anthem === "Sim") {
          return false;
        }

        if (this.selectedTheme !== 'all' && theme.name !== this.selectedTheme) {
          return false;
        }

        return true;
      });

      return {
        name: theme.name,
        musics: musics
      };
    });
  }

  async showOptions(music) {
    let type = music.anthem === 'Sim' ? 'Hino' : 'Música';
    let buttons = [];

    if (music.link && music.link.includes('spotify')) {
      buttons.push({
        text: `Abrir no Spotify`,
        handler: () => {
          window.open(music.link);
        }
      });
    }

    if (music.link && music.link.includes('youtube')) {
      buttons.push({
        text: `Abrir no Youtube`,
        handler: () => {
          window.open(music.link);
        }
      });
    }

    if (music.sheetMusic) {
      buttons.push({
        text: `Abrir site da cifra`,
        handler: () => {
          window.open(music.sheetMusic);
        }
      });
    }

    buttons.push({
      text: `Detalhar/Alterar ${type}`,
      handler: () => {
        this.editMusic(music);
      }
    });

    const actionSheet = await this.actionSheet.create({
      header: `${music.artist} - ${music.name}`,
      buttons: buttons
    });
    await actionSheet.present();
  }
}
