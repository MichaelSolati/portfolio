import { Component } from '@angular/core';

import { environment } from '../../environments/environment';
import { MetaService } from '../core/services/meta.service';
import * as data from './data.json';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {
  private _meta = {
    title: 'Articles',
    description: 'Stories, guides, and tutorials for developers by me.'
  }

  constructor(metaService: MetaService) {
    metaService.setAll({
      ...this._meta,
      title: `${this._meta.title} | ${environment.name}`
    });
  }

  get meta() {
    return this._meta;
  }

  get data(): any[] {
    return data['default'];
  }
}
