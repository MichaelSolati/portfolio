import { Component } from '@angular/core';

import { environment } from '../../environments/environment';
import { MetaService } from '../core/services/meta.service';
import data from './data';

const defaultFilter = { title: 'All', type: null, icon: 'list' };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private _active = defaultFilter;
  private _filters = [
    defaultFilter,
    { title: 'Work', type: 'work', icon: 'business' },
    { title: 'Education', type: 'education', icon: 'school' },
    { title: 'Volunteer', type: 'volunteer', icon: 'group' }
  ];
  private _meta = {
    title: environment.name,
    description: this.data.description
  };

  constructor(metaService: MetaService) {
    metaService.setAll({
      ...this._meta,
      title: 'Home'
    });
  }

  get active(): any {
    return this._active;
  }

  get data(): any {
    return data;
  }

  get filters(): any[] {
    return this._filters;
  }

  get meta(): any {
    return this._meta;
  }

  selectFilter(filter: any): void {
    this._active = filter;
  }
}
