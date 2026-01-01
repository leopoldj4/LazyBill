export function download(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = filename;
    link.click();
    link.remove();
}