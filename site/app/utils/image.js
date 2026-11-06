/**
 * Use the browser's image loading to load an image and
 * grab the `src` it chooses from a `srcSet`
 */
export async function loadImageFromSrcSet({ src, srcSet, sizes }) {
  return new Promise((resolve, reject) => {
    if (!src && !srcSet) {
      reject(new Error('No image src or srcSet provided'));
      return;
    }

    const tempImage = new Image();
    const cleanup = () => {
      tempImage.removeEventListener('load', onLoad);
      tempImage.removeEventListener('error', onError);
    };
    const onLoad = () => {
      const source = tempImage.currentSrc || tempImage.src;
      cleanup();
      resolve(source);
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Could not load image source: ${srcSet || src}`));
    };

    tempImage.addEventListener('load', onLoad, { once: true });
    tempImage.addEventListener('error', onError, { once: true });
    if (sizes) tempImage.sizes = sizes;
    if (srcSet) tempImage.srcset = srcSet;
    if (src) tempImage.src = src;
  });
}

/**
 * Generates a transparent png of a given width and height
 */
export async function generateImage(width = 1, height = 1) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, width, height);

      canvas.toBlob(blob => {
        canvas.remove();
        if (!blob) {
          reject(new Error('Video thumbnail failed to load'));
          return;
        }
        try {
          resolve(URL.createObjectURL(blob));
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      canvas.remove();
      reject(error);
    }
  });
}

/**
 * Use native html image `srcSet` resolution for non-html images
 */
export async function resolveSrcFromSrcSet({ srcSet, sizes }) {
  const sources = await Promise.all(
    srcSet.split(', ').map(async srcString => {
      const [src, width] = srcString.split(' ');
      const size = Number(width.replace('w', ''));
      const image = await generateImage(size);
      return { src, image, width };
    })
  );

  const fakeSrcSet = sources.map(({ image, width }) => `${image} ${width}`).join(', ');
  const fakeSrc = await loadImageFromSrcSet({ srcSet: fakeSrcSet, sizes });

  const output = sources.find(src => src.image === fakeSrc);
  return output.src;
}
