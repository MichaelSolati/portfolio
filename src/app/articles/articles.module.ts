import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerModule } from '../shared/banner/banner.module';
import { CardModule } from '../shared/card/card.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';

@NgModule({
  declarations: [
    ArticlesComponent
  ],
  imports: [
    CommonModule,
    BannerModule,
    CardModule,
    ArticlesRoutingModule
  ]
})
export class ArticlesModule { }
