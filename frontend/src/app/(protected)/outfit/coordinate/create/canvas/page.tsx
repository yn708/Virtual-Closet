import CoordinateCanvasPageContent from '@/features/coordinate/components/contents/CoordinateCanvasPageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'コーディネート作成',
};

export default function CoordinateCanvasPage() {
  return <CoordinateCanvasPageContent />;
}
