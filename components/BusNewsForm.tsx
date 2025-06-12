'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface PreviewData {
  image?: string;
  category: string;
  comment: string;
  date: string;
}

const categories = [
  'Gráfica externa',
  'Gráfica interna',
  'Chapería',
  'Pintura',
  'Interiores',
  'Limpieza interior',
  'Desperfectos generales',
];

export default function BusNewsForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState(categories[0]);
  const [comment, setComment] = useState('');
  const [preview, setPreview] = useState<PreviewData | null>(null);

  const currentDate = new Date().toLocaleString();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPreview({
      image: imagePreview ?? undefined,
      category,
      comment,
      date: currentDate,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block font-medium mb-1">Imagen</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-contain" />
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2 w-full"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Comentario</label>
          <textarea
            className="border rounded p-2 w-full"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Fecha y Hora</label>
          <input
            type="text"
            value={currentDate}
            disabled
            className="border rounded p-2 w-full bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cargar novedad
        </button>
      </form>

      {preview && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Previsualización</h2>
          {preview.image && (
            <img src={preview.image} alt="Preview" className="mb-2 h-40 object-contain" />
          )}
          <p className="font-medium">Categoría: {preview.category}</p>
          <p className="font-medium">Fecha y Hora: {preview.date}</p>
          <p className="whitespace-pre-wrap">{preview.comment}</p>
        </div>
      )}
    </div>
  );
}
