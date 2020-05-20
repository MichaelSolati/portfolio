import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { CardModule } from '../components/card';
import { ImgLoaderModule } from '../directives/img-loader';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ExperiencesPipe } from './experiences.pipe';
import { TwitterComponent } from './icons/twitter/twitter.component';
import { GithubComponent } from './icons/github/github.component';
import { DevtoComponent } from './icons/devto/devto.component';
import { LinkedinComponent } from './icons/linkedin/linkedin.component';

@NgModule({
  declarations: [
    HomeComponent,
    ExperiencesPipe,
    TwitterComponent,
    GithubComponent,
    DevtoComponent,
    LinkedinComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    CardModule,
    ImgLoaderModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
