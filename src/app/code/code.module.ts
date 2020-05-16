import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeRoutingModule } from './code-routing.module';
import { CodeComponent } from './code.component';


@NgModule({
  declarations: [CodeComponent],
  imports: [
    CommonModule,
    CodeRoutingModule
  ]
})
export class CodeModule { }
