import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerModule } from '../shared/banner/banner.module';
import { CardModule } from '../shared/card/card.module';
import { CodeRoutingModule } from './code-routing.module';
import { CodeComponent } from './code.component';

@NgModule({
  declarations: [
    CodeComponent
  ],
  imports: [
    CommonModule,
    BannerModule,
    CardModule,
    CodeRoutingModule
  ]
})
export class CodeModule { }
