import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

import { MetaService } from '../core/services/meta.service';
import { environment } from 'src/environments/environment.general';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  private _meta = {
    title: '404',
    header: '404',
    description: 'Page not found...'
  };

  constructor(@Inject(PLATFORM_ID) platformId: any, @Optional() @Inject(RESPONSE) response: Response, metaService: MetaService) {
    metaService.setAll(this._meta);

    if (!isPlatformBrowser(platformId)) {
      response.status(404);
    }
  }

  get home(): string {
    return environment.pages.home.path;
  }

  get meta(): any {
    return this._meta;
  }
}
