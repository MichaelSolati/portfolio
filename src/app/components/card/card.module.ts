import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { SharedModule } from  '../../shared/shared.module';
import { CardComponent } from './card.component';
import { ExperienceCardComponent } from './experience-card/experience-card.component';

@NgModule({
  declarations: [
    CardComponent,
    ExperienceCardComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    SharedModule
  ],
  exports: [
    CardComponent,
    ExperienceCardComponent
  ]
})
export class CardModule { }
