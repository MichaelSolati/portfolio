import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from '../shared/card/card.module';
import { CodeRoutingModule } from './code-routing.module';
import { CodeComponent } from './code.component';

@NgModule({
  declarations: [
    CodeComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    CodeRoutingModule
  ]
})
export class CodeModule { }
