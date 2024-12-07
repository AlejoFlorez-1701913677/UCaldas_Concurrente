import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { GrafoRoutingModule } from './grafo-routing.module';
//import { VistaGrafoComponent } from './vista-grafo/vista-grafo.component';
import { RouterModule } from '@angular/router';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    
  ],
  imports: [
    //GrafoRoutingModule,
    RouterModule, 
    CommonModule,
    NgxGraphModule,
    BrowserAnimationsModule
  ]
})
export class GrafoModule { }
