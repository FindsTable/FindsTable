// Detect WebP support using Canvas
export function detectWebPSupport(): Promise<boolean> {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        if (canvas && canvas.getContext('2d')) {
            canvas.toBlob((blob) => {
                resolve(blob?.type === 'image/webp');
            }, 'image/webp');
        } else {
            resolve(false);
        }
    });
}
