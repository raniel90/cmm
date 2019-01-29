import { NgModule } from '@angular/core';
import { FilterNamePipe } from './filter-name.pipe';
import { FilterNameDefaultPipe } from './filter-name-default.pipe';

@NgModule({
  declarations: [
    FilterNamePipe,
    FilterNameDefaultPipe
  ],
  exports: [
    FilterNamePipe,
    FilterNameDefaultPipe
  ]
})
export class ApplicationPipesModule { }
