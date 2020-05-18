import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerModule } from '../components/banner';
import { CardModule } from '../components/card';
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
