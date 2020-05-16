import { Component } from '@angular/core';

import * as data from './data.json';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {
  get data(): any[] {
    return data['default'];
  }
}
