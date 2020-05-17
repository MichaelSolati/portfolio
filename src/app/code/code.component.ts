import { Component } from '@angular/core';

import { MetaService } from '../core/services/meta.service';
import data from './data';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent {
  private _meta = {
    title: 'Code',
    description: 'Some of the best code I\'ve written, available for everyone!'
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
