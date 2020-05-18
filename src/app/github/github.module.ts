import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerModule } from '../components/banner';
import { CardModule } from '../components/card';
import { GithubRoutingModule } from './github-routing.module';
import { GithubComponent } from './github.component';

@NgModule({
  declarations: [
    GithubComponent
  ],
  imports: [
    CommonModule,
    BannerModule,
    CardModule,
    GithubRoutingModule
  ]
})
export class GithubModule { }
