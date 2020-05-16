import { Component } from '@angular/core';

import * as data from './data.json';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent {
  private _meta = {
    title: 'Code',
    description: 'Some of the best code I\'ve written, available for everyone!'
  }

  get meta() {
    return this._meta;
  }

  get data(): any[] {
    return data['default'];
  }
}
