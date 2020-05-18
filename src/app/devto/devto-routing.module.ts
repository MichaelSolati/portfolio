import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevtoComponent } from './devto.component';

const routes: Routes = [
  { path: '', component: DevtoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevtoRoutingModule { }
