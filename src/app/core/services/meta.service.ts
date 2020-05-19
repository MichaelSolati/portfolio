import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgMeta } from 'ngmeta';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private _ngmeta: NgMeta, private _router: Router) { }

  setAll({ title, description }): void {
    const path = this._router.url.split('?')[0];
    const fof = (path === '/404');
    const image = `${environment.site.baseURL}/assets/screenshots${(path === '/') ? '/home' : path}.png`;
    const twitter = environment.site.twitter;

    this._ngmeta.setAll({
      title,
      description,
      image: !fof ? image : null,
      twitter,
      canonical: environment.site.baseURL + path
    });
  }
}
