import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }


  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }

}
