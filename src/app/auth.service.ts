import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebaseAuth: AngularFireAuth) { }

  async signup(email: string, password: string) {
    try {
      await this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      return this.getSuccessStatus();
    } catch (e) {
      return this.getErrorStatus(e);
    }
  }

  async login(email: string, password: string) {
    try {
      await this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      return this.getSuccessStatus();
    } catch (e) {
      return this.getErrorStatus(e);
    }
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

  getSuccessStatus() {
    return {
      success: true
    }
  }

  getErrorStatus(err) {
    return {
      success: false,
      msg: JSON.stringify(err.message)
    }
  }
}
