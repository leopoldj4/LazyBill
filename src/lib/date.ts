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

export function daysUntilDue(invoiceDate: string, dueInDays: number): number {
	const dueDate = parseDate(invoiceDate).add({ days: dueInDays });
	const today = todayFn(getLocalTimeZone());
	const dueDateMs = dueDate.toDate(getLocalTimeZone()).getTime();
	const todayMs = today.toDate(getLocalTimeZone()).getTime();
	return Math.ceil((dueDateMs - todayMs) / (1000 * 60 * 60 * 24));
}