import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXtfeXRcQmBfUEV2X0dWYUA=');
                 
                 
                
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
