import CoordinateEditorForm from '@/features/coordinate/components/form/CoordinateEditorForm';
import { fetchCoordinateMetaDataAPI } from '@/lib/api/coordinateApi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'コーディネート作成',
};

export default async function PhotoCoordinateCreatePage() {
  const metaData = await fetchCoordinateMetaDataAPI();

  return (
    <main className="w-full min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto">
        <CoordinateEditorForm metaData={metaData} />
      </div>
    </main>
  );
}
