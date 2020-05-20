import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  animations: [
    trigger(
      'unsplashLoaded',
      [
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('2s ease-in', style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class BannerComponent {
  @Input() background: string = './assets/backgrounds/github.webp';
  @Input() description: string;
  @Input() title: string;
  @Input() topics: string = 'code';
  loadUnsplash = false;
  unsplashLoaded = false;

  constructor() {
    interval(15000).pipe(first()).subscribe(() => (this.loadUnsplash = true));
  }
}
