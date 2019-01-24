import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-select-music',
  templateUrl: './select-music.page.html',
  styleUrls: ['./select-music.page.scss'],
})
export class SelectMusicPage implements OnInit {

  musics;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private storage: Storage) { }

  async ngOnInit() {
    this.musics = await this.storage.get('musics');
    this.musics = JSON.parse(this.musics);
    this.musics.push('nova música');
  }

  goBack() {
    this.storage.set('musics', JSON.stringify(this.musics));
    this.navController.navigateBack(['/worship']);
  }

}
