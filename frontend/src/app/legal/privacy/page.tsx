import DocumentLayout from '@/components/layout/DocumentLayout';
import { privacyData } from '@/utils/data/privacy';

export default function PrivacyPolicyPage() {
  return <DocumentLayout data={privacyData} />;
}
