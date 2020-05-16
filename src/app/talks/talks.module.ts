import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from '../shared/card/card.module';
import { TalksRoutingModule } from './talks-routing.module';
import { TalksComponent } from './talks.component';

@NgModule({
  declarations: [
    TalksComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    TalksRoutingModule
  ]
})
export class TalksModule { }
