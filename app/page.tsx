import BusNewsForm from '../components/BusNewsForm';

export default function HomePage() {
  return (
    <main className="container mx-auto max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Cargar Novedad de Bus</h1>
      <BusNewsForm />
    </main>
  );
}
