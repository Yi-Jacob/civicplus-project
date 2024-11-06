import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiRoutes } from '../constants/api-routes.constant';
import { EventListItem, Events } from '../models/api-event.model';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class EventsService {
    private http = inject(HttpClient);
    private storageService = inject(StorageService);

    bearerToken = this.storageService.getItem('bearer_token');

    headers = new HttpHeaders({
        Authorization: `Bearer ${this.bearerToken}`,
    });

    loadEvents() {
        return this.http.get<{
            success: boolean;
            data: Events;
            error?: string;
        }>(`${ApiRoutes.event}LoadEvents.php`, { headers: this.headers });
    }

    loadEventDetails(id: string) {
        return this.http.get<{
            success: boolean;
            data: EventListItem;
            error?: string;
        }>(`${ApiRoutes.event}LoadEventDetail.php?id=${id}`, {
            headers: this.headers,
        });
    }

    saveEvent(config: EventListItem) {
        return this.http.post<{
            success: boolean;
            data: Events;
            error?: string;
        }>(`${ApiRoutes.event}SaveEvent.php`, config, {
            headers: this.headers,
        });
    }
}
