import { getLocalTimeZone, today as todayFn, CalendarDate } from "@internationalized/date";

type DateString = `${number}-${number}-${number}`;

export function formatDate(date: CalendarDate): DateString {
	return `${date.year}-${date.month}-${date.day}`;
}

export function parseDate(date: string): CalendarDate {
	const [year, month, day] = date.split('-').map(Number);
	return new CalendarDate("AD", year, month, day);
}

export function today(): DateString {
	return formatDate(todayFn(getLocalTimeZone()));
}