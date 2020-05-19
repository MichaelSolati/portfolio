import { Component } from '@angular/core';

import { MetaService } from '../core/services/meta.service';
import data from './data';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.scss']
})
export class GithubComponent {
  private _meta = environment.pages.github;

  constructor(metaService: MetaService) {
    metaService.setAll(this._meta);
  }

  get background(): string {
    return './assets/backgrounds/github.webp';
  }

  get data(): any[] {
    return data;
  }

  get meta() {
    return this._meta;
  }

  get topics(): string {
    return environment.pages.github.topics.join(',');
  }
}
