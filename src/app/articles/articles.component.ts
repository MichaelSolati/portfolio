import { Component } from '@angular/core';

import { MetaService } from '../core/services/meta.service';
import data from './data';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {
  private _meta = {
    title: 'Articles',
    description: 'Stories, guides, and tutorials for developers by me.'
  };

  constructor(metaService: MetaService) {
    metaService.setAll(this._meta);
  }

  get meta() {
    return this._meta;
  }

  get data(): any[] {
    return data;
  }
}
