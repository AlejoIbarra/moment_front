export const useImageActions = () => {
  /**
   * Redimensiona y comprime una imagen en el cliente usando Canvas.
   * @param file El archivo original
   * @param options Opciones de compresión (maxWidth, maxHeight, quality, type)
   * @returns Una promesa que resuelve con un nuevo objeto File optimizado
   */
  const compressImage = (file: File, options = { maxWidth: 2000, maxHeight: 2000, quality: 0.8, type: 'image/jpeg' }): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return resolve(file); // No es una imagen, devolver original
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Calcular nuevas dimensiones manteniendo la relación de aspecto
          if (width > height) {
            if (width > options.maxWidth) {
              height = Math.round((height * options.maxWidth) / width);
              width = options.maxWidth;
            }
          } else {
            if (height > options.maxHeight) {
              width = Math.round((width * options.maxHeight) / height);
              height = options.maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('No se pudo obtener el contexto del canvas'));
          }

          // Dibujar la imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir el canvas a Blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Error al generar el Blob de la imagen'));
              }
              // Crear un nuevo File a partir del Blob
              const compressedFile = new File([blob], file.name, {
                type: options.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            options.type,
            options.quality
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  return {
    compressImage,
  };
};
