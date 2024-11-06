import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InputSwitchModule } from 'primeng/inputswitch';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import {
    AddNewEventComponent,
    ViewEventDetailComponent,
} from './components/modals';

import { UIState, EventsState } from './state';

@Component({
    standalone: true,
    selector: 'app-event',
    templateUrl: './events.component.html',
    styleUrl: './events.component.scss',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TooltipModule,
        InputSwitchModule,
        TableModule,
        AddNewEventComponent,
        ViewEventDetailComponent,
    ],
    providers: [UIState, EventsState],
})
export class EventComponent {
    @ViewChild('eventsTable', { static: false }) eventsTable: Table | undefined;

    uiState = inject(UIState);
    eventsState = inject(EventsState);
    status$ = this.eventsState.status$;
    events$ = this.eventsState.events$;
    eventItems$ = this.eventsState.eventItems$;

    ngOnInit(): void {
        this.eventsState.init();
    }
    refresh(): void {
        this.eventsState.refresh();
    }
    openAddNewEventModal() {
        this.uiState.openAddNewEventModal();
    }

    openViewDetailModal(id: string) {
        this.uiState.openViewEventDetailModal(id);
    }

}
