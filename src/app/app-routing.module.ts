import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, Route } from '@angular/router';

import { environment } from '../environments/environment';

const routeMap = {
  devto: () => import('./devto/devto.module').then(m => m.DevtoModule),
  github: () => import('./github/github.module').then(m => m.GithubModule),
  home: () => import('./home/home.module').then(m => m.HomeModule),
  youtube: () => import('./youtube/youtube.module').then(m => m.YoutubeModule)
}

const routes: Routes = Object.keys(environment.pages)
.filter((key) => environment.pages[key].enabled || key === 'home')
.map((key): Route => {
  const page = environment.pages[key];
  return {
    path: page.path,
    loadChildren: routeMap[key]
  };
});

routes.push({ path: '404', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) });
routes.push({ path: '**', redirectTo: `/404` });

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
