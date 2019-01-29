import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelectMusicPage } from './select-music.page';
import { ApplicationPipesModule } from '../pipes/application-pipes.module';

const routes: Routes = [
  {
    path: '',
    component: SelectMusicPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicationPipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectMusicPage]
})
export class SelectMusicPageModule {}
