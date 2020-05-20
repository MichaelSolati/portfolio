import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImgLoaderDirective } from './img-loader.directive';

@NgModule({
  declarations: [
    ImgLoaderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImgLoaderDirective
  ]
})
export class ImgLoaderModule { }
