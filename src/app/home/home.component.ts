import { Component } from '@angular/core';

import { MetaService } from '../core/services/meta.service';
import data from './data';
import { environment } from '../../environments/environment';

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
  private _meta = environment.pages.home;

  constructor(metaService: MetaService) {
    if (this.data.description) {
      this._meta.description = this.data.description;
    }
    metaService.setAll(this._meta);
  }

  get active(): any {
    return this._active;
  }

  get data(): any {
    return data || {};
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
