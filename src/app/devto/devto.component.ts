import { Component } from '@angular/core';

import { MetaService } from '../core/services/meta.service';
import data from './data';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-devto',
  templateUrl: './devto.component.html',
  styleUrls: ['./devto.component.scss']
})
export class DevtoComponent {
  private _meta = environment.pages.devto;

  constructor(metaService: MetaService) {
    metaService.setAll(this._meta);
  }

  get background(): string {
    return './assets/backgrounds/devto.webp';
  }

  get data(): any[] {
    return data;
  }

  get meta() {
    return this._meta;
  }

  get topics(): string {
    return environment.pages.devto.topics.join(',');
  }
}
