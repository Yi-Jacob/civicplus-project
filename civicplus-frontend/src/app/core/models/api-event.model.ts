export interface EventListItem {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}

export interface Events {
    total: number;
    items: EventListItem[];
}
