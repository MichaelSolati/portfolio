import { Component } from '@angular/core';

import { environment } from '../../environments/environment';
import { MetaService } from '../core/services/meta.service';
import * as data from './data.json';

@Component({
  selector: 'app-talks',
  templateUrl: './talks.component.html',
  styleUrls: ['./talks.component.scss']
})
export class TalksComponent {
  private _meta = {
    title: 'Talks',
    description: 'From major conferences to smaller meetups, I\'ve spoken at a slew of events.'
  }

  constructor(metaService: MetaService) {
    metaService.setAll(this._meta);
  }

  get meta() {
    return this._meta;
  }

  get data(): any[] {
    return data['default'];
  }
}
