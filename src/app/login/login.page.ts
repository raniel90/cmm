import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  loading;

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private nav: NavController,
    private utils: UtilsService) { }

  ngOnInit() {
  }


  async signup() {
    const status = await this.authService.signup(this.email, this.password);
    if (status.success) {
      this.email = this.password = '';
    }
  }

  async login() {
    const status = await this.authService.login(this.email, this.password);
    console.log(status);
    this.email = this.password = '';
  }

  logout() {
    this.authService.logout();
  }
}
