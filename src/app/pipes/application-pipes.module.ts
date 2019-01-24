import { NgModule } from '@angular/core';
import { FilterNamePipe } from './filter-name.pipe';

@NgModule({
  declarations: [
    FilterNamePipe
  ],
  exports: [
    FilterNamePipe
  ]
})
export class ApplicationPipesModule { }
