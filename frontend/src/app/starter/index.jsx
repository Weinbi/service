import PageMeta from '@/components/PageMeta';
const Index = () => {
  return <>
    <PageMeta title="Starter" />
    <div className="card h-full flex flex-col items-center justify-center border-dashed border-2 border-gray-300 bg-transparent rounded-2xl shadow-none">
      <h2 className="text-2xl font-bold text-gray-400 mb-2">Starter Route</h2>
      <p className="text-gray-400">This is the Starter page wrapped by PageWrapper.</p>
    </div>
  </>;
};
export default Index;