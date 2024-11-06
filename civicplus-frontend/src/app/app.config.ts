import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

import { ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(ROUTES),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
    ],
};