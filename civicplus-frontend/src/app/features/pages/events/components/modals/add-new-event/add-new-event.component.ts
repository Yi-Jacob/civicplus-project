import { Component, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { BehaviorSubject, Subject, distinctUntilChanged, map } from 'rxjs';

import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';

import { UIStatus } from '@app/core';
import { EventsState, UIState } from '../../../state';

@Component({
    standalone: true,
    selector: 'app-add-new-event',
    templateUrl: './add-new-event.component.html',
    styleUrl: './add-new-event.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        CalendarModule,
        DividerModule,
        RadioButtonModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
    ],
})
export class AddNewEventComponent {
    uiState = inject(UIState);
    eventsState = inject(EventsState);

    addNewEvent$ = this.uiState.modals$.pipe(
        map((modals) => modals.addNewEvent),
        distinctUntilChanged()
    );
    isOpen$ = this.addNewEvent$.pipe(map((modal) => modal.isOpen));

    status$ = new BehaviorSubject<UIStatus>('idle');
    private destroyed$ = new Subject<void>();
    eventDetail$ = this.eventsState.eventDetail$;

    addNewEventForm = new FormGroup({
        title: new FormControl<string | null>(null, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        description: new FormControl<string | null>(null, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        startDate: new FormControl<Date | null>(null, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        startTime: new FormControl<Date | null>(null, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        endDate: new FormControl<Date | null>(null, {
            validators: [Validators.required],
            nonNullable: true,
        }),
        endTime: new FormControl<Date | null>(null, {
            validators: [Validators.required],
            nonNullable: true,
        }),
    });

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    close(): void {
        this.clear();
        this.uiState.closeAddNewEventModal();
    }

    clear(): void {
        this.status$.next('idle');
        this.addNewEventForm.reset();
    }

    save(): void {
        if (this.addNewEventForm.invalid) {
            Object.values(this.addNewEventForm.controls).forEach((control) => {
                control.markAsDirty();
                control.markAsTouched();
            });
            return;
        }
        this.status$.next('loading');
        const formValues = this.addNewEventForm.getRawValue();
        this.eventsState
            .saveEvent({
                id: '',
                title: formValues.title ?? '',
                description: formValues.description ?? '',
                startDate: this.combineDateTimeToISO(
                    formValues.startDate,
                    formValues.startTime
                ),

                endDate: this.combineDateTimeToISO(
                    formValues.endDate,
                    formValues.endTime
                ),
            })
            .then(() => {
                this.status$.next('success');
                this.close();
            })
            .catch(() => {
                this.status$.next('error');
            });
    }

    combineDateTimeToISO(date: Date | null, time: Date | null): string {
        if (date && time) {
            const combinedDate = new Date(date);
            const combinedTime = new Date(time);

            combinedDate.setHours(combinedTime.getHours());
            combinedDate.setMinutes(combinedTime.getMinutes());
            combinedDate.setSeconds(0, 0);
            return combinedDate.toISOString().replace('.000', '');
        }
        return '';
    }
}
