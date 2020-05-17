import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMeta } from 'ngmeta';

import { MetaService } from './services/meta.service';

const PROVIDERS = [
  NgMeta,
  MetaService
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: PROVIDERS
    };
  }
}
