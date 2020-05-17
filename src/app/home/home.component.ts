import { Component } from '@angular/core';

import { environment } from '../../environments/environment';
import { MetaService } from '../core/services/meta.service';
import * as data from './data.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private _meta = {
    title: environment.name,
    description: this.data.description,
  };

  constructor(metaService: MetaService) {
    metaService.setAll({
      ...this._meta,
      title: 'Home'
    });
  }

  get data(): any {
    return data['default'];
  }
}
