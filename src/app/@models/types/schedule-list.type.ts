import { ScheduleType } from './schedule.type';

export class ScheduleListType {
    [date: string]: {schedules?: ScheduleType[], events?: ScheduleType[]}
}