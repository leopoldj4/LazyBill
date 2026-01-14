import { getLocalTimeZone, today as todayFn, CalendarDate, CalendarDateTime } from "@internationalized/date";

type DateString = `${number}-${number}-${number}`;
type DateTimeString = string; // ISO 8601 format: YYYY-MM-DDTHH:mm

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

// DateTime utilities for time entries
export function formatDateTime(dateTime: CalendarDateTime): DateTimeString {
	const pad = (n: number) => n.toString().padStart(2, '0');
	return `${dateTime.year}-${pad(dateTime.month)}-${pad(dateTime.day)}T${pad(dateTime.hour)}:${pad(dateTime.minute)}`;
}

export function parseDateTime(dateTime: string): CalendarDateTime {
	const [datePart, timePart] = dateTime.split('T');
	const [year, month, day] = datePart.split('-').map(Number);
	const [hour, minute] = (timePart || '00:00').split(':').map(Number);
	return new CalendarDateTime(year, month, day, hour, minute);
}

export function nowDateTime(): CalendarDateTime {
	const now = new Date();
	return new CalendarDateTime(
		now.getFullYear(),
		now.getMonth() + 1,
		now.getDate(),
		now.getHours(),
		now.getMinutes()
	);
}

export function formatDateTimeDisplay(dateTime: string): string {
	const parsed = parseDateTime(dateTime);
	const date = parsed.toDate(getLocalTimeZone());
	return date.toLocaleString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}


export function formatDateTimeRange(startDateTime: string, endDateTime: string): string {
	const start = parseDateTime(startDateTime);
	const end = parseDateTime(endDateTime);

	const startDate = start.toDate(getLocalTimeZone());
	const endDate = end.toDate(getLocalTimeZone());

	const dateOptions: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	};

	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
	};

	const startDateStr = startDate.toLocaleDateString('de-DE', dateOptions);
	const endDateStr = endDate.toLocaleDateString('de-DE', dateOptions);
	const startTimeStr = startDate.toLocaleTimeString('de-DE', timeOptions);
	const endTimeStr = endDate.toLocaleTimeString('de-DE', timeOptions);

	if (startDateStr === endDateStr) {
		return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
	}

	return `${startDateStr} ${startTimeStr} - ${endDateStr} ${endTimeStr}`;
}

export function calculateDuration(startDateTime: string, endDateTime: string): string {
	const start = parseDateTime(startDateTime);
	const end = parseDateTime(endDateTime);

	const startMs = start.toDate(getLocalTimeZone()).getTime();
	const endMs = end.toDate(getLocalTimeZone()).getTime();
	const diffMs = Math.abs(endMs - startMs);

	const hours = Math.floor(diffMs / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

	if (hours === 0) {
		return `${minutes} Min.`;
	}

	if (minutes === 0) {
		return `${hours} Std.`;
	}

	return `${hours} Std. ${minutes} Min.`;
}

export function calculateDurationInHours(startDateTime: string, endDateTime: string, smallestUnit: number): number {
	const start = parseDateTime(startDateTime);
	const end = parseDateTime(endDateTime);

	const startMs = start.toDate(getLocalTimeZone()).getTime();
	const endMs = end.toDate(getLocalTimeZone()).getTime();
	const diffMinutes = Math.abs(endMs - startMs) / (1000 * 60);

	// Round up to the nearest smallestUnit (in minutes), then convert to hours
	const roundedMinutes = Math.ceil(diffMinutes / smallestUnit) * smallestUnit;
	return roundedMinutes / 60;
}