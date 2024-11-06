import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, lastValueFrom, catchError } from 'rxjs';

import { EventsService, Events, UIStatus, EventListItem } from '@app/core';

@Injectable()
export class EventsState {
    eventsService = inject(EventsService);

    events$ = new BehaviorSubject<Events | null>(null);
    eventItems$ = new BehaviorSubject<EventListItem[]>([]);
    eventDetail$ = new BehaviorSubject<EventListItem | null>(null);

    status$ = new BehaviorSubject<UIStatus>('idle');

    config$ = new BehaviorSubject<{
        refreshTriggered: number;
    }>({
        refreshTriggered: 0,
    });

    private initialized = false;
    init(): void {
        if (this.initialized) {
            return;
        }
        this.config$.subscribe(() => {
            this.loadEvents();
        });
    }

    refresh(): void {
        this.config$.next({
            ...this.config$.getValue(),
            refreshTriggered: new Date().getTime(),
        });
    }

    loadEvents(): Promise<void> {
        this.status$.next('loading');
        return lastValueFrom(this.eventsService.loadEvents()).then((res) => {
            if (res.success) {
                this.events$.next(res.data);
                this.eventItems$.next(res.data.items);
                this.status$.next('success');
                return Promise.resolve();
            } else {
                if (res.error === '401') {
                    window.location.href = '/auth';
                    this.status$.next('error');
                }
                return Promise.reject(res.error);
            }
        });
    }

    loadEventDetails(id: string): Promise<void> {
        return lastValueFrom(this.eventsService.loadEventDetails(id))
            .then((res) => {
                this.eventDetail$.next(res.data);
                this.status$.next('success');
                return Promise.resolve();
            })
            .catch((error) => {
                this.status$.next('error');
                return Promise.reject(error);
            });
    }

    saveEvent(config: EventListItem): Promise<void> {
        this.status$.next('loading');
        return lastValueFrom(this.eventsService.saveEvent(config))
            .then((res) => {
                if (res.success) {
                    this.status$.next('success');
                    this.refresh();
                    return Promise.resolve();
                } else {
                    return Promise.reject(res.error);
                }
            })
            .catch(() => {
                this.status$.next('error');
            });
    }

    // deleteEquipment(equipmentID: number, isActive: boolean): Promise<void> {
    //     this.status$.next('loading');
    //     return lastValueFrom(
    //         this.fleetManagementApiService.deleteEquipment(
    //             equipmentID,
    //             isActive
    //         )
    //     ).then((res) => {
    //         if (!res.success) {
    //             this.status$.next('error');
    //             return Promise.reject(res.error);
    //         }
    //         this.refresh();
    //         this.status$.next('success');
    //         return Promise.resolve();
    //     });
    // }
}
