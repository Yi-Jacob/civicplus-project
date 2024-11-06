import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiRoutes } from '../constants/api-routes.constant';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    private http = inject(HttpClient);

    authentication() {
        return this.http.get<{
            success: boolean;
            data: string;
            error?: string;
        }>(`${ApiRoutes.auth}`);
    }
}
