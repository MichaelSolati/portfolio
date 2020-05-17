import { Component } from '@angular/core';

import { MetaService } from '../core/services/meta.service';
import data from './data';

@Component({
  selector: 'app-talks',
  templateUrl: './talks.component.html',
  styleUrls: ['./talks.component.scss']
})
export class TalksComponent {
  private _meta = {
    title: 'Talks',
    description: 'From major conferences to smaller meetups, I\'ve spoken at a slew of events.'
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
