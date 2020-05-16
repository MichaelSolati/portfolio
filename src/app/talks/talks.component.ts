import { Component } from '@angular/core';

import * as data from './data.json';

@Component({
  selector: 'app-talks',
  templateUrl: './talks.component.html',
  styleUrls: ['./talks.component.scss']
})
export class TalksComponent {
  get data(): any[] {
    return data['default'];
  }
}
