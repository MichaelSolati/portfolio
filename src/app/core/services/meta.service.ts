import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private _scroll = true;

  constructor(
    private _titleService: Title,
    private _metaService: Meta,
    @Inject(DOCUMENT) private _dom
  ) { }

  setAll({
    title,
    description,
    image,
    canonical = this._dom.URL,
    twitter = `@${environment.twitter}`,
    sitename = `${environment.name}`
  }:
    { [key: string]: string }
  ): void {
    this._scrollToTop();
    this.setTitle(title);
    this.setDescription(description);
    this.setFacebook({ title, description, image, sitename, canonical });
    this.setGoogle({ title, description, image });
    this.setTwitter({ title, description, image, twitter });
    this.setCanonical(canonical);
  }

  setCanonical(canonical: string = this._dom.URL) {
    let element: HTMLElement = this._dom.querySelector("link[rel=\'canonical\']");

    if (!element) {
      element = this._dom.createElement('link');
      element.setAttribute('rel', 'canonical');
      this._dom.head.appendChild(element);
    }

    element.setAttribute('href', canonical);
  }

  setDescription(content: string): void {
    const name = 'description';
    const elements = this._metaService.getTags(`name="${name}"`);
    if (elements.length) {
      this._metaService.updateTag({ name: 'description', content }, `name="${name}"`);
    } else {
      this._metaService.addTag({ name: 'description', content });
    }
  }

  setFacebook(
    { locale, type, title, description, image, sitename, canonical }:
      { [key: string]: string }
  ): void {
    const fields = [
      { property: 'og:locale', content: locale },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: sitename },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: canonical }
    ];

    fields.forEach((field) => {
      if (field.content) {
        const elements = this._metaService.getTags(`property="${field.property}"`);
        if (elements.length) {
          this._metaService.updateTag({ property: field.property, content: field.content }, `property="${field.property}"`);
        } else {
          this._metaService.updateTag({ property: field.property, content: field.content });
        }
      }
    });
  }

  setGoogle(
    { title, description, image }:
      { [key: string]: string }
  ): void {
    const fields = [
      { itemprop: 'name', content: title },
      { itemprop: 'description', content: description },
      { itemprop: 'image', content: image }
    ];

    fields.forEach((field) => {
      if (field.content) {
        const elements = this._metaService.getTags(`itemprop="${field.itemprop}"`);
        if (elements.length) {
          this._metaService.updateTag({ itemprop: field.itemprop, content: field.content }, `itemprop="${field.itemprop}"`);
        } else {
          this._metaService.updateTag({ itemprop: field.itemprop, content: field.content });
        }
      }
    });
  }

  setScroll(scroll: boolean): void {
    this._scroll = scroll;
  }

  setTitle(title: string): void {
    this._titleService.setTitle(title);
  }

  setTwitter(
    { title, description, image, twitter }:
      { [key: string]: string }
  ): void {
    const fields = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:site', content: twitter }
    ];

    fields.forEach((field) => {
      if (field.content) {
        const elements = this._metaService.getTags(`name="${field.name}"`);
        if (elements.length) {
          this._metaService.updateTag({ name: field.name, content: field.content }, `name="${field.name}"`);
        } else {
          this._metaService.updateTag({ name: field.name, content: field.content });
        }
      }
    });
  }

  private _scrollToTop(): void {
    if (this._scroll && (typeof window !== 'undefined') && !window.location.pathname.includes('#')) {
      window.scrollTo(0, 0);
    }
  }
}
