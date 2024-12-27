/**
 * @jest-environment node
 */
import CoordinateCanvasPage from '@/app/(protected)/outfit/coordinate/create/canvas/page';

// モックコンポーネントをオブジェクトとして定義
jest.mock('@/features/coordinate/components/contents/CoordinateCanvasPageContent', () => {
  const MockComponent = jest.fn(() => null);
  return {
    __esModule: true,
    default: MockComponent,
  };
});

/**
 * コーディネートキャンバスページのテストスイート
 */
describe('CoordinateCanvasPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('CoordinateCanvasPageContentコンポーネントを正しくレンダリングする', async () => {
    // ページコンポーネントをレンダリング
    const page = await CoordinateCanvasPage();

    // コンポーネントの型を確認
    expect(page.type).toBeDefined();
    expect(typeof page.type).toBe('function');
  });
});
