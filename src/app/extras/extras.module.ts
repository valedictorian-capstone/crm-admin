import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntModule, FormModule, NebularModule, PrimeModule } from './modules';
import { ActionMenuComponent } from './components';
import { LengthPipe } from './pipes';
export const EXTRA_MODULES = [
  FormModule,
  AntModule,
  NebularModule,
  PrimeModule,
];

export const ANGULAR_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  CommonModule
];

export const COMPONENTS = [
  ActionMenuComponent
];
export const PIPES = [
  LengthPipe
];
@NgModule({
  imports: [
    ...ANGULAR_MODULES,
    ...EXTRA_MODULES,
  ],
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  exports: [
    ...ANGULAR_MODULES,
    ...EXTRA_MODULES,
    ...COMPONENTS,
    ...PIPES
  ],
})
export class ExtrasModule {
  static forRoot(name: string = 'default'): ModuleWithProviders<ExtrasModule> {
    return {
      ngModule: ExtrasModule,
      providers: [
        // ...NebularModule.forRoot().providers,
      ]
    };
  }
  static forChild(name: string = 'default'): ModuleWithProviders<ExtrasModule> {
    return {
      ngModule: ExtrasModule,
      providers: [
        ...NebularModule.forChild().providers,
      ]
    };
  }
}
