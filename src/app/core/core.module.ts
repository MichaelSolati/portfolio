import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { NgMeta } from 'ngmeta';

import { MetaService } from './services/meta.service';
import { environment } from '../../environments/environment';

const PROVIDERS = [
  NgMeta,
  MetaService
];

const IMPORTS: any[] = [
  CommonModule,
  AngularFireModule.initializeApp(environment.firebase)
];

if (environment.production) {
  IMPORTS.push(AngularFireAnalyticsModule);
}

@NgModule({
  declarations: [],
  imports: IMPORTS,
  providers: PROVIDERS
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: PROVIDERS
    };
  }
}
