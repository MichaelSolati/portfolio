import { Component } from '@angular/core';

import * as data from './data.json';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent {
  get data(): any[] {
    return data['default'];
  }
}
