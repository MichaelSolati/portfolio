import { Injectable } from '@angular/core';
import { NgMeta, GoogleMeta } from 'ngmeta';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private _ngmeta: NgMeta) { }

  setAll({ title, description, image } : GoogleMeta): void {
    const twitter = environment.twitter;
    this._ngmeta.setAll({
      title: title + ' | ' + environment.name,
      description,
      image,
      twitter
    })
  }
}
