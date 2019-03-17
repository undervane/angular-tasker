export class ScheduleType {

    name: string;
    icon?: string;
    color?: string;
    description?: string;
    allDay?: boolean;
    time?: {
        start: Date;
        end: Date;
    }

}