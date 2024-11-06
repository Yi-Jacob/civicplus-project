import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    {
        path: 'auth',
        loadComponent: () =>
            import('./features/pages/auth/auth.component').then(
                (c) => c.AuthComponent
            ),
    },
    {
        path: 'event',
        loadComponent: () =>
            import('./features/pages/events/events.component').then(
                (c) => c.EventComponent
            ),
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    { path: '**', redirectTo: 'auth' },
];
