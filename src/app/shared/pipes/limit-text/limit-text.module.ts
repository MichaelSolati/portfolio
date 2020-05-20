import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LimitTextPipe } from './limit-text.pipe';

@NgModule({
  declarations: [
    LimitTextPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LimitTextPipe
  ]
})
export class LimitTextModule { }
