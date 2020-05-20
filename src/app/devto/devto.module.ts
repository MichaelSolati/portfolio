import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerModule } from '../shared/components/banner';
import { CardModule } from '../shared/components/card';
import { DevtoRoutingModule } from './devto-routing.module';
import { DevtoComponent } from './devto.component';

@NgModule({
  declarations: [
    DevtoComponent
  ],
  imports: [
    CommonModule,
    BannerModule,
    CardModule,
    DevtoRoutingModule
  ]
})
export class DevtoModule { }
