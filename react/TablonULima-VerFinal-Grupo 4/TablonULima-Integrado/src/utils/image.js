export const MAX_AVATAR_MB = 2;
export const AVATAR_TYPES = /^image\/(png|jpeg|webp)$/;

// Recorta la imagen a un cuadrado y la reduce, para no llenar el límite de localStorage.
export function resizeImage(src, size) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const s = Math.min(img.width, img.height);
      canvas.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = src;
  });
}

export function readFileAsDataUrl(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
