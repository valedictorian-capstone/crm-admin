import { ModuleWithProviders, NgModule } from '@angular/core';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxEmojiPickerModule } from 'ngx-emoji-picker';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BarRatingModule } from 'ngx-bar-rating';
import { ImageCropperModule } from 'ngx-image-cropper';
import { environment } from '@environments/environment';
import * as echarts from 'echarts';
import { ClickOutsideModule } from 'ng-click-outside';

const config: SocketIoConfig = { url: environment.socketServer, options: {} };

const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

export const NGX_MODULES = [
  NgxChartsModule,
  NgxEmojiPickerModule,
  PickerModule,
  NgxSkeletonLoaderModule,
  NgxEchartsModule,
  NgxMaskModule,
  SocketIoModule,
  NgxSpinnerModule,
  NgxSmoothDnDModule,
  ClickOutsideModule,
  ImageCropperModule,
  AngularEditorModule,
  BarRatingModule
];
@NgModule({
  exports: [...NGX_MODULES]
})
export class NgxModule {
  static forRoot(): ModuleWithProviders<NgxModule> {
    return {
      ngModule: NgxModule,
      providers: [
        ...NgxMaskModule.forRoot(options).providers,
        ...NgxEchartsModule.forRoot({
          echarts
        }).providers,
        ...SocketIoModule.forRoot(config).providers,
        ...NgxEmojiPickerModule.forRoot().providers,
      ]
    };
  }
  static forChild(): ModuleWithProviders<NgxModule> {
    return {
      ngModule: NgxModule,
      providers: [

      ]
    };
  }
}
