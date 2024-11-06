import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { ButtonModule } from 'primeng/button';

import { UIStatus } from '@app/core';
import { AuthService } from '@app/core';
import { StorageService } from '@app/core';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
})
export class AuthComponent {
    router = inject(Router);
    authService = inject(AuthService);
    private storageService = inject(StorageService);
    status$ = new BehaviorSubject<UIStatus>('idle');

    auth() {
        this.status$.next('loading');
        return lastValueFrom(this.authService.authentication()).then((res) => {
            if (res.success) {
                this.storageService.setItem('bearer_token', res.data);
                window.location.href = '/event';
                return Promise.resolve();
            } else {
                this.status$.next('error');
                return Promise.reject(res.error);
            }
        });
    }
}
