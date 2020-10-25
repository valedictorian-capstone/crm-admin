import { NgModule } from '@angular/core';
import { AuthRoutes } from './auth.routing';
import { LoginComponent, NavigateComponent } from './components';
import { ExtrasModule } from '@extras/extras.module';

const COMPONENTS = [
  LoginComponent,
  NavigateComponent,
];

@NgModule({
  imports: [
    AuthRoutes,
    ExtrasModule.forRoot(),
  ],
  declarations: [...COMPONENTS],
})
export class AuthModule { }
