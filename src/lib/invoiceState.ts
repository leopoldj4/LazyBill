import MailIcon from "@lucide/svelte/icons/mail";
import CheckIcon from "@lucide/svelte/icons/check";
import TrashIcon from "@lucide/svelte/icons/trash";
import PencilIcon from "@lucide/svelte/icons/pencil";
import type { InvoiceState } from "$convex/invoiceState";

type Detail = { name: string, icon: typeof PencilIcon, bgColor: string, textColor: string };

export const InvoiceStateDetail: Record<InvoiceState, Detail> = {
    new: {
        name: 'Neu',
        icon: PencilIcon,
        bgColor: 'bg-yellow-500',
        textColor: 'text-yellow-500',
    },
    sent: {
        name: 'Gesendet',
        icon: MailIcon,
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-500',
    },
    paid: {
        name: 'Bezahlt',
        icon: CheckIcon,
        bgColor: 'bg-green-500',
        textColor: 'text-green-500',
    },
    cancelled: {
        name: 'Storniert',
        icon: TrashIcon,
        bgColor: 'bg-gray-500',
        textColor: 'text-gray-500',
    },
} as const;
