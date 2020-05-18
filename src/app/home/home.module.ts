import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { BannerModule } from '../components/banner';
import { CardModule } from '../components/card';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ExperiencesPipe } from './experiences.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    ExperiencesPipe
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    BannerModule,
    CardModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
