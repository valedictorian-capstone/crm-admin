import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import { AuthRoutes } from './auth.routing';
import { LoginComponent, NavigateComponent } from './components';

const COMPONENTS = [
  LoginComponent,
  NavigateComponent,
];

@NgModule({
  imports: [
    AuthRoutes,
    ExtrasModule.forChild(),
  ],
  declarations: [...COMPONENTS],
})
export class AuthModule { }
