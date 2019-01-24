import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'music', loadChildren: './music/music.module#MusicModule' },
  { path: 'worship', loadChildren: './worship/worship.module#WorshipPageModule' },
  { path: 'select-music', loadChildren: './select-music/select-music.module#SelectMusicPageModule' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
