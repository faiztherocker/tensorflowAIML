import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObjectIdentifierComponent } from './object-identifier.component';

const ObjectIdentifierModuleRoutes: Routes = [
  {
    path: '',
    component: ObjectIdentifierComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ObjectIdentifierModuleRoutes)]
})
export class ObjectIdentifierRoutingModule {}
