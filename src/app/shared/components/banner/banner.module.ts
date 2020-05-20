import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';

import { ImgLoaderModule } from  '../../directives/img-loader';

@NgModule({
  declarations: [
    BannerComponent
  ],
  imports: [
    CommonModule,
    ImgLoaderModule
  ],
  exports: [
    BannerComponent
  ]
})
export class BannerModule { }
