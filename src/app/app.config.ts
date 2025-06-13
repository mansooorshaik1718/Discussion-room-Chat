// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay())]
// };


// import { ApplicationConfig } from '@angular/core';
// // import { provideRouter } from '@angular/router'; // Keep only if you uncommented provideRouter(routes) later

// // import { routes } from './app.routes'; // Keep only if you uncommented provideRouter(routes) later

// export const appConfig: ApplicationConfig = {
//   providers: [
//     // Make sure there are no providers related to 'provideServerRendering' or other SSR functions
//     // provideRouter(routes) // Only if you are using routing. For this app, you likely won't need it initially.
//   ]
// };

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router'; // Keep this for routing, even if routes are empty for now

import { routes } from './app.routes'; // Keep this for routing, even if routes are empty for now

// REMOVE THE FOLLOWING IMPORT:
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Only include provideRouter(routes) IF you intend to use Angular's routing in the future.
    // For a single-page chat app without navigation, it's technically optional but harmless.
    provideRouter(routes)
    // REMOVE provideClientHydration(withEventReplay())
  ]
};