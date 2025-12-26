import MailIcon from "@lucide/svelte/icons/mail";
import CheckIcon from "@lucide/svelte/icons/check";
import TrashIcon from "@lucide/svelte/icons/trash";
import PencilIcon from "@lucide/svelte/icons/pencil";

enum InvoiceState {
    DRAFT = 'draft',
    SENT = 'sent',
    PAID = 'paid',
    CANCELLED = 'cancelled',
}

export const InvoiceStateDetail = {
    [InvoiceState.DRAFT]: {
        name: 'Entwurf',
        icon: PencilIcon,
        bgColor: 'bg-yellow-500',
        textColor: 'text-yellow-500',
    },
    [InvoiceState.SENT]: {
        name: 'Gesendet',
        icon: MailIcon,
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-500',
    },
    [InvoiceState.PAID]: {
        name: 'Bezahlt',
        icon: CheckIcon,
        bgColor: 'bg-green-500',
        textColor: 'text-green-500',
    },
    [InvoiceState.CANCELLED]: {
        name: 'Storniert',
        icon: TrashIcon,
        bgColor: 'bg-gray-500',
        textColor: 'text-gray-500',
    },
} as const;
