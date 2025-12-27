export async function exportPDF(mainContent: string, filename: string) {
    const { default: typst } = await import('$lib/typst');
    
    const pdfData = await typst.pdf({ mainContent });
    if (!pdfData) {
        throw new Error('Failed to export PDF');
    }

    const blob = new Blob([pdfData.slice()], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.target = '_blank';
    link.download = filename;
    link.click();
    link.remove();

    URL.revokeObjectURL(blobUrl);
}