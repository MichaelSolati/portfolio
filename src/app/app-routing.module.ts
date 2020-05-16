import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  { path: 'articles', loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule)},
  { path: 'code', loadChildren: () => import('./code/code.module').then(m => m.CodeModule)},
  { path: 'talks', loadChildren: () => import('./talks/talks.module').then(m => m.TalksModule)},
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
