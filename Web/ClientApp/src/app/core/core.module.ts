import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { LazyTranslationService } from './services/lazy-translation.service';
import { TranslateHttpLoader } from './services/translate-http-loader';
import { HttpService } from './services/http.service';

export function HttpLoaderFactory(lazy: LazyTranslationService) {
  lazy.add('all');
  return new TranslateHttpLoader(lazy);
}

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [LazyTranslationService]
      }
    }),
  ],
  exports: [
    TranslateModule
  ],
  providers: [
    { provide: HttpClient, useClass: HttpService }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
  }
}
