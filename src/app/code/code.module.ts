import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerModule } from '../components/banner';
import { CardModule } from '../components/card';
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
