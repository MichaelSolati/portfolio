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

const pathInNav = {
  devto: false,
  github: false,
  home: true,
  youtube: false
};

const paths: Path[] = Object.keys(environment.pages)
  .filter((key) => environment.pages[key].enabled || key === 'home')
  .map((key): Path => {
    const page = environment.pages[key];
    return {
      name: page.name,
      link: (page.path === '') ? ['/'] : ['/', page.path],
      hideInNav: pathInNav[key]
    };
  })
  // @ts-ignore
  .sort((a, b) => b.name - a.name);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('drawer', { static: true }) drawer: MatSidenav;
  private _isHandset$: Observable<boolean> = this._breakpointObserver
    .observe(['(max-width: 575px)'])
    .pipe(map(result => result.matches));

  constructor(private _breakpointObserver: BreakpointObserver) { }

  get title(): string {
    return environment.site.name;
  }

  get isHandset$(): Observable<boolean> {
    return this._isHandset$;
  }

  get homePath(): string[] {
    return (environment.pages.home.path === '') ? ['/'] : ['/', environment.pages.home.path];
  }

  get paths(): Path[] {
    return paths;
  }

  @HostListener('window:resize')
  public resize(): void {
    if (
      typeof window !== 'undefined' &&
      window.innerWidth >= 576 &&
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
