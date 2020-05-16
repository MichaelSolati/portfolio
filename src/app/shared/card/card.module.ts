import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { SharedModule } from  '../shared.module';
import { CardComponent } from './card.component';

@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    SharedModule
  ],
  exports: [
    CardComponent
  ]
})
export class CardModule { }
