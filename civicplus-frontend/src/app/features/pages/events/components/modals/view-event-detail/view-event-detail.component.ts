import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    BehaviorSubject,
    Subject,
    distinctUntilChanged,
    filter,
    map,
} from 'rxjs';

import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

import { UIStatus } from '@app/core';
import { EventsState, UIState } from '../../../state';

@Component({
    standalone: true,
    selector: 'app-view-event-detail',
    templateUrl: './view-event-detail.component.html',
    styleUrl: './view-event-detail.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        DividerModule,
        RadioButtonModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
    ],
})
export class ViewEventDetailComponent {
    uiState = inject(UIState);
    eventsState = inject(EventsState);

    viewEventDetail$ = this.uiState.modals$.pipe(
        map((modals) => modals.viewEventDetail),
        distinctUntilChanged()
    );
    isOpen$ = this.viewEventDetail$.pipe(map((modal) => modal.isOpen));
    context$ = this.viewEventDetail$.pipe(
        filter((modal) => modal.isOpen),
        map((modal) => modal.context)
    );
    status$ = new BehaviorSubject<UIStatus>('idle');
    private destroyed$ = new Subject<void>();
    eventDetail$ = this.eventsState.eventDetail$;
    eventId: string = '';

    eventId$ = this.viewEventDetail$.pipe(map((data) => data.context));

    eventDetailForm = new FormGroup({
        title: new FormControl<string | null>(null),
        description: new FormControl<string | null>(null),
        startDate: new FormControl<string | null>(null),
        endDate: new FormControl<string | null>(null),
    });

    ngOnInit(): void {
        this.eventId$.subscribe((id) => {
            this.status$.next('loading');
            if (id) {
                this.eventsState.loadEventDetails(id).then(() => {
                    this.status$.next('success');
                    this.setupDetail();
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    close(): void {
        this.clear();
        this.uiState.closeViewEventDetailModal();
    }

    clear(): void {
        this.status$.next('idle');
        this.eventDetailForm.reset();
    }

    private setupDetail(): void {
        this.eventDetail$.subscribe((detail) => {
            this.eventId = detail?.id ?? '';
            this.eventDetailForm.patchValue({
                title: detail?.title,
                description: detail?.description,
                startDate: detail?.startDate,
                endDate: detail?.endDate,
            });
        });
    }
}
