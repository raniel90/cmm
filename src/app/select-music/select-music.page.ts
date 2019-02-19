import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';
import { ThemeService } from '../theme.service';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-select-music',
  templateUrl: './select-music.page.html',
  styleUrls: ['./select-music.page.scss'],
})
export class SelectMusicPage implements OnInit {
  public themes: any;
  public musicsSelected = {};
  public themesTemp: any;
  public filter = {
    name: '',
    themes: []
  };
  public selectedSegment = 'all';
  public selectedTheme = 'all';
  objectKeys = Object.keys;

  constructor(
    private af: AngularFirestore,
    private nav: NavController,
    private storage: Storage,
    private actionSheet: ActionSheetController,
    private themeService: ThemeService,
    private navController: NavController,
    private utils: UtilsService) {
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
    let musicsSavedObj = {};
    let musicsSaved = await this.storage.get('musics');
    let musicsArray: any = await this.utils.getValueFromObservable(
      this.af.collection('musics', ref =>
        ref.orderBy('name', 'asc')).valueChanges()
    );

    musicsSaved = JSON.parse(musicsSaved);
    musicsSaved.forEach((musicSaved) => {
      musicsSavedObj[musicSaved.id] = musicSaved;
    });

    musicsArray.forEach((music) => {
      if (music.theme && music.theme.length) {
        music.theme.forEach((item) => {
          if (!themesObj[item]) {
            themesObj[item] = {
              musics: {}
            };
          }

          if (musicsSavedObj[music.id] && item === musicsSavedObj[music.id].theme_name) {
            music.selected = true;
            music.theme_name = item;
            this.musicsSelected[music.id] = music;
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

    if (Object.keys(this.musicsSelected).length) {
      this.selectedSegment = 'saved';
    }
  }

  async listByFilter() {
    let filter = {
      anthem: (this.selectedSegment === 'anthem' ? "Sim" : "Não")
    };

    this.themes = await this.utils.getValueFromObservable(
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

  selectMusic(musicSelected, indexTheme, indexMusic) {
    let music;

    if (musicSelected.selected) {
      this.removeMusic(musicSelected);
      return;
    }

    music = this.themes[indexTheme].musics[indexMusic];

    music.theme_name = this.themes[indexTheme].name;
    this.themes[indexTheme].musics[indexMusic].selected = true;
    this.musicsSelected[music.id] = music;
  }

  removeMusic(music) {
    const indexTheme = this.themes.map((theme) => theme.name).indexOf(music.theme_name);
    const indexMusic = this.themes[indexTheme].musics.map((music) => music.id).indexOf(music.id);

    this.themes[indexTheme].musics[indexMusic].selected = false;
    delete this.musicsSelected[music.id];
  }

  viewMusic(music) {
    this.nav.navigateForward(['/music'], { queryParams: { music: JSON.stringify(music), is_edit: false } });
  }

  async showOptions(music, indexTheme, indexMusic) {
    let buttons = [];
    let type = music.anthem === 'Sim' ? 'Hino' : 'Música';

    if (music.link) {
      buttons.push({
        text: `Abrir no Youtube`,
        handler: () => {
          this.utils.openUrl(music.link);
        }
      });
    }

    if (music.linkSpotify) {
      buttons.push({
        text: `Abrir no Spotify`,
        handler: () => {
          this.utils.openUrl(music.linkSpotify);
        }
      });
    }

    if (music.linkDeezer) {
      buttons.push({
        text: `Abrir no Deezer`,
        handler: () => {
          this.utils.openUrl(music.linkDeezer);
        }
      });
    }

    if (music.sheetMusic) {
      buttons.push({
        text: `Abrir site da cifra`,
        handler: () => {
          this.utils.openUrl(music.sheetMusic);
        }
      });
    }

    buttons.push({
      text: `Detalhar ${type}`,
      handler: () => {
        this.viewMusic(music);
      }
    });

    buttons.push({
      text: music.selected ? 'Remover do repertório' : 'Adicionar ao repertório',
      handler: () => {
        this.selectMusic(music, indexTheme, indexMusic);
      }
    });

    const actionSheet = await this.actionSheet.create({
      header: `${music.artist} - ${music.name}`,
      buttons: buttons
    });
    await actionSheet.present();
  }

  goBack() {
    this.storage.set('musics', JSON.stringify(this.musicsSelected));
    this.navController.navigateBack(['/worship']);
  }
}
