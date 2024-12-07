import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformationRoutingModule } from './information-routing.module';
import { VistaInformationComponent } from './vista-information/vista-information.component';


@NgModule({
  declarations: [
    VistaInformationComponent
  ],
  imports: [
    InformationRoutingModule,
    CommonModule
  ]
})
export class InformationModule { }
