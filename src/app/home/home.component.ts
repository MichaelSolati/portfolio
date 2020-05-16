import { Component } from '@angular/core';

import * as data from './data.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  get data(): any {
    return data['default'];
  }
}
