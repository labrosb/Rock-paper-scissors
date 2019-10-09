import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './welcome/welcome.component';
import { SingleStageComponent } from './single-stage/single-stage.component';
import { MultiStageComponent } from './multi-stage/multi-stage.component';

import { AppComponent } from './app.component';

const appRoutes: Routes = [
  { path: '',      component: WelcomeComponent,      data: { depth: 1 } },
  { path: 'play',  component: SingleStageComponent,  data: { depth: 2 } },
  { path: 'xPlay', component: MultiStageComponent,   data: { depth: 2 } }
];

const rootRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    SingleStageComponent,
    MultiStageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    rootRouting,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
