import { NgModule } from '@angular/core';
import { ExtrasModule } from '@extras/extras.module';
import {
  HeaderComponent,
  MainComponent,
  SideBarComponent
} from './components';
import { CoreRoutes } from './core.routing';
import { LayoutComponent } from './pages';

const COMPONENTS = [
  HeaderComponent,
  MainComponent,
  SideBarComponent,
];

const PAGES = [
  LayoutComponent,
];

@NgModule({
  imports: [
    CoreRoutes,
    ExtrasModule.forRoot(),
  ],
  declarations: [...PAGES, ...COMPONENTS]
})
export class CoreModule { }
