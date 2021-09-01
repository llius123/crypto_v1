const schedule = require('node-schedule');



export interface Time {
    second?: number | null,
    minute?: number | null,
    hour?: number | null,
    date?: number | null,
    month?: number | null,
    year?: number | null,
    dayOfWeek?: number | null,
    tz?: number
}

export class WorkerV1 {
    constructor() { }

    public startWorkers(times: Time[], callbackFN: () => void) {
        times.forEach(function (time) {
            schedule.scheduleJob(time, () => { callbackFN() });
        })
    }
}