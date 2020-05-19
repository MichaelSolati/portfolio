import { Component } from '@angular/core';

import { MetaService } from '../core/services/meta.service';
import data from './data';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent {
  private _meta = environment.pages.youtube;

  constructor(metaService: MetaService) {
    metaService.setAll(this._meta);
  }

  get background(): string {
    return './assets/backgrounds/youtube.webp';
  }

  get data(): any[] {
    return data;
  }

  get meta() {
    return this._meta;
  }

  get topics(): string {
    return environment.pages.youtube.topics.join(',');
  }
}
