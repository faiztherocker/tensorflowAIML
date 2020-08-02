import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectIdentifierComponent } from './object-identifier.component';
import { ObjectIdentifierRoutingModule } from './object-identifier.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjectIdentifierService } from './services/object-identifier.service';

@NgModule({
  declarations: [ObjectIdentifierComponent],
  imports: [CommonModule, ObjectIdentifierRoutingModule, ReactiveFormsModule],
  providers: [ObjectIdentifierService]
})
export class ObjectIdentifierModule {}
