import { Directive, ElementRef, OnDestroy } from '@angular/core';

import { svg } from './svg';

@Directive({
  selector: '[appImgLoader]'
})
export class ImgLoaderDirective implements OnDestroy {
  constructor(private _el: ElementRef<HTMLImageElement>) {
    _el.nativeElement.setAttribute('loading', 'lazy');
    _el.nativeElement.classList.add('loading');

    this._onError = this._onError.bind(this);
    this._onLoad = this._onLoad.bind(this);

    _el.nativeElement.addEventListener('error', this._onError);
    _el.nativeElement.addEventListener('load', this._onLoad);
  }

  ngOnDestroy(): void {
    this._el.nativeElement.removeEventListener('error', this._onError);
    this._el.nativeElement.removeEventListener('load', this._onLoad);
  }

  private _onError(): void {
    this._onLoad();
    this._el.nativeElement.style.backgroundColor = '#ffffff';
    this._el.nativeElement.src = svg;
    this._el.nativeElement.alt = 'Img not found, here is Jerry.';
    this._el.nativeElement.removeEventListener('error', this._onError);
  }

  private _onLoad(): void {
    this._el.nativeElement.classList.remove('loading');
    this._el.nativeElement.removeEventListener('load', this._onLoad);
  }

}
