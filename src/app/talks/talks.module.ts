import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalksRoutingModule } from './talks-routing.module';
import { TalksComponent } from './talks.component';


@NgModule({
  declarations: [TalksComponent],
  imports: [
    CommonModule,
    TalksRoutingModule
  ]
})
export class TalksModule { }
