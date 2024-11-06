import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UIState {
    modals$ = new BehaviorSubject<{
        addNewEvent: {
            isOpen: boolean;
        };
        viewEventDetail: {
            isOpen: boolean;
            context?: string;
        };
       
    }>({
        addNewEvent: {
            isOpen: false,
        },
        viewEventDetail: {
            isOpen: false,
        },
    });

    openAddNewEventModal() {
        this.modals$.next({
            ...this.modals$.value,
            addNewEvent: {
                isOpen: true,
            },
        });
    }

    closeAddNewEventModal() {
        this.modals$.next({
            ...this.modals$.value,
            addNewEvent: {
                isOpen: false,
            },
        });
    }

    openViewEventDetailModal(context: string) {
        this.modals$.next({
            ...this.modals$.value,
            viewEventDetail: {
                isOpen: true,
                context,
            },
        });
    }

    closeViewEventDetailModal() {
        this.modals$.next({
            ...this.modals$.value,
            viewEventDetail: {
                isOpen: false,
            },
        });
    }

}
