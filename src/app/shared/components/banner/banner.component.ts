import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

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
}
