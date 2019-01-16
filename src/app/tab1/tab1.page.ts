import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  musics = ['Eu te agradeço', 'Tua Misericórida'];

  constructor(private router: Router) {

  }

  addMusic() {
    this.router.navigate(['/music'], { queryParams: { is_new: true } });
  }
}
