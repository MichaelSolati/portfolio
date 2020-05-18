import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgMeta, GoogleMeta } from 'ngmeta';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private _ngmeta: NgMeta, @Inject(DOCUMENT) private _dom: Document) { }

  setAll({ title, description } : GoogleMeta): void {
    const path = new URL(this._dom.URL).pathname;
    const twitter = environment.twitter;
    this._ngmeta.setAll({
      title: title + ' | ' + environment.name,
      description,
      image: `${environment.site.config.baseURL}/assets/screenshots${(path === '/') ? 'home' : path}.png`,
      twitter,
      canonical: environment.site.config.baseURL + path
    })
  }
}
