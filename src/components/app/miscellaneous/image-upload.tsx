'use client';

import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { ImageIcon } from 'lucide-react'; // O tu ícono preferido

interface ImageUploadProps {
  onUpload: (url: string) => void;
  preset?: string;
}

export const ImageUpload = ({ 
  onUpload, 
  preset = 'tu_upload_preset_aqui' // Reemplaza con el nombre de tu preset
}: ImageUploadProps) => {

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    // Verificamos que la subida fue exitosa y tenemos la info
    if (result.event === 'success' && result.info && typeof result.info !== 'string') {
      console.log('Imagen subida:', result.info.secure_url);
      
      // Enviamos la URL al componente padre
      onUpload(result.info.secure_url);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <CldUploadButton
        uploadPreset={preset}
        onSuccess={handleUpload}
        options={{
          maxFiles: 1, // Limitar a 1 archivo
        //   resourceType: 'pdf', // O 'image' si solo subes imágenes
          // Puedes personalizar estilos del widget aquí si deseas
        }}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
      >
        <ImageIcon className="w-4 h-4" />
        Subir Imagen
      </CldUploadButton>
    </div>
  );
};