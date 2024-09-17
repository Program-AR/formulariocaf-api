import moment = require("moment")

export enum Weekday { // Same convention than in Moment.ts
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7,
}

const weekdayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export const weekdayName = (momentWeekday: Weekday): string => weekdayNames[momentWeekday - 1]
export const cloneDateAdding = (date, howMuch) => moment(date).clone().add(howMuch)
export const cloneDateSubstracting = (date, howMuch) => moment(date).clone().subtract(howMuch)

export const isBeforeThisWeek = (date: moment.Moment): boolean => moment(date).isBefore(moment().startOf('isoWeek'))