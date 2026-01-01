import { download } from '$lib/download';

export async function downloadPDF(mainContent: string, filename: string) {
    const pdfData = await createPDF(mainContent);

    const blob = new Blob([pdfData.slice()], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    
    download(blobUrl, filename);

    URL.revokeObjectURL(blobUrl);
}

export async function createPDF(mainContent: string) {
    const { default: typst } = await import('$lib/typst');
    
    const pdfData = await typst.pdf({ mainContent });
    if (!pdfData) {
        throw new Error('Failed to export PDF');
    }

    return pdfData;
}