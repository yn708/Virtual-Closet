import ItemEditorForm from '@/features/fashion-items/components/form/ItemEditorForm';
import { fetchFashionMetaDataAPI } from '@/lib/api/fashionItemsApi';

export default async function ItemEditPage() {
  const metaData = await fetchFashionMetaDataAPI();

  return (
    <main className="w-full min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto">
        <ItemEditorForm metaData={metaData} />
      </div>
    </main>
  );
}
