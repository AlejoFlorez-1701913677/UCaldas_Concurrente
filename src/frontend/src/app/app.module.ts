import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './public/master-page/header/header.component';
import { RouteNotFoundComponent } from './public/errors/route-not-found/route-not-found.component';
import { ServerErrorComponent } from './public/errors/server-error/server-error.component';
import { SideMenuComponent } from './public/master-page/side-menu/side-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VistaGrafoComponent } from './modules/grafo/vista-grafo/vista-grafo.component'
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './registro/registro.component';
import { HttpClientModule } from '@angular/common/http';
import { PopupComponent } from './popup/popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FileSelectorComponent } from './modules/file-selector/file-selector.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RouteNotFoundComponent,
    ServerErrorComponent,
    SideMenuComponent,
    VistaGrafoComponent,
    RegistroComponent,
    PopupComponent,
    FileSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGraphModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
