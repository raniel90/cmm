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
      const payload = await this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
      return this.getSuccessStatus(payload);
    } catch (e) {
      return this.getErrorStatus(e);
    }
  }

  async login(email: string, password: string) {
    try {
      const payload = await this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
      return this.getSuccessStatus(payload);
    } catch (e) {
      return this.getErrorStatus(e);
    }
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

  getSuccessStatus(payload) {
    return {
      success: true,
      payload: payload
    }
  }

  getErrorStatus(err) {
    return {
      success: false,
      code: err && err.code ? err.code : null,
      msg: JSON.stringify(err.message)
    }
  }

  getPtBrMessage(response) {
    const code = response.code;

    if (code === "auth/wrong-password") {
      return 'Senha incorreta!'
    }

    if (code === "auth/user-not-found") {
      return 'Usuário não cadastrado!'
    }

    if (code === "auth/invalid-email") {
      return 'E-mail inválido!'
    }

    if (code === "auth/email-already-in-use") {
      return 'E-mail já cadastrado!'
    }

    if (code === "auth/weak-password") {
      return 'A senha deve ter no mínimo 6 caracteres!'
    }

    return code;
  }
}
