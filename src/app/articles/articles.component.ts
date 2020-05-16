import { Component } from '@angular/core';

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

  get meta() {
    return this._meta;
  }

  get data(): any[] {
    return data['default'];
  }
}
