import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { environment } from '../environments/environment';

type Path = {
  name: string;
  link: string[];
  hideInNav?: boolean;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('drawer', { static: true }) drawer: MatSidenav;
  private _isHandset$: Observable<boolean> = this._breakpointObserver
    .observe(['(max-width: 599px)'])
    .pipe(map(result => result.matches));
  private _paths: Path[] = [
    { name: 'Home', link: ['/'], hideInNav: true },
    { name: 'Articles', link: ['/', 'articles'], hideInNav: false },
    { name: 'Code', link: ['/', 'code'], hideInNav: false },
    { name: 'Talks', link: ['/', 'talks'], hideInNav: false }
  ];

  constructor(private _breakpointObserver: BreakpointObserver) {}

  get title(): string {
    return environment.name;
  }
  get isHandset$(): Observable<boolean> {
    return this._isHandset$;
  }

  get paths(): Path[] {
    return this._paths;
  }

  @HostListener('window:resize')
  public resize(): void {
    if (
      typeof window !== 'undefined' &&
      window.innerWidth >= 601 &&
      this.drawer.opened
    ) {
      this.drawer.close();
    }
  }

  @HostListener('swiperight')
  public swiperight(): void {
    this._isHandset$
      .pipe(first())
      .subscribe(isHandset => (isHandset ? this.drawer.open() : null));
  }
}
