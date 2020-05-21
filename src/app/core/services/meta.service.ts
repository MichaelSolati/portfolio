import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { NgMeta } from 'ngmeta';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private _ngmeta: NgMeta, private _router: Router, @Inject(DOCUMENT) private  _dom: Document) { }

  setAll({ title, description }): void {
    if (typeof window !== 'undefined') {
      this._dom.querySelector('mat-sidenav-content').scrollTo(0, 0);
    }
    const path = this._router.url.split('?')[0];
    const key = Object.keys(environment.pages)
      .find(k => (environment.pages[k].enabled || k === 'home') && (`/${environment.pages[k].path}` === path));
    const image = `${environment.site.baseURL}/assets/screenshots/${key ? key : '404'}.png`;
    const twitter = environment.site.twitter;

    this._ngmeta.setAll({
      title,
      description,
      image,
      twitter,
      canonical: environment.site.baseURL + path
    });
  }
}
