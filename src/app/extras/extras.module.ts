import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntModule, FormModule, NebularModule, PrimeModule } from './modules';

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
@NgModule({
  imports: [
    ...ANGULAR_MODULES,
    ...EXTRA_MODULES,
  ],
  declarations: [],
  exports: [
    ...ANGULAR_MODULES,
    ...EXTRA_MODULES,
  ],
})
export class ExtrasModule {
  static forRoot(name: string = 'default'): ModuleWithProviders<ExtrasModule> {
    return {
      ngModule: ExtrasModule,
      providers: [
        ...NebularModule.forRoot().providers,
      ]
    };
  }
}
