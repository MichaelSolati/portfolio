import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { HammerjsConfigService } from './configs/hammerjs-config.service';


const PROVIDERS = [];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HammerModule
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerjsConfigService },
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
