import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerModule } from '../components/banner';
import { CardModule } from '../components/card';
import { TalksRoutingModule } from './talks-routing.module';
import { TalksComponent } from './talks.component';

@NgModule({
  declarations: [
    TalksComponent
  ],
  imports: [
    CommonModule,
    BannerModule,
    CardModule,
    TalksRoutingModule
  ]
})
export class TalksModule { }
