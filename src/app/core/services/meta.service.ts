import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgMeta, GoogleMeta } from 'ngmeta';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private _ngmeta: NgMeta, private _router: Router) { }

  setAll({ title, description } : GoogleMeta): void {
    const path = this._router.url.split('?')[0];
    const twitter = environment.site.twitter;
    this._ngmeta.setAll({
      title: title + ' | ' + environment.site.name,
      description,
      image: `${environment.site.baseURL}/assets/screenshots${(path === '/') ? '/home' : path}.png`,
      twitter,
      canonical: environment.site.baseURL + path
    })
  }
}
