/**
 * @jest-environment node
 */
import CoordinateEditPage from '@/app/(protected)/outfit/coordinate/create/page';
import { fetchCoordinateMetaDataAPI } from '@/lib/api/coordinateApi';

// モックの設定
jest.mock('@/lib/api/coordinateApi', () => ({
  fetchCoordinateMetaDataAPI: jest.fn(),
}));

// モックコンポーネントをオブジェクトとして定義
jest.mock('@/features/coordinate/components/form/CoordinateEditorForm', () => {
  const MockComponent = jest.fn(() => null);
  return {
    __esModule: true,
    default: MockComponent,
  };
});

/**
 * コーディネート編集ページのテストスイート
 */
describe('PhotoCoordinateCreatePage', () => {
  // モックメタデータ
  const mockMetaData = {
    seasons: [
      { id: 1, name: '春' },
      { id: 2, name: '夏' },
    ],
    scenes: [
      { id: 1, name: 'デイリー' },
      { id: 2, name: 'オフィス' },
    ],
    tastes: [
      { id: 1, name: 'カジュアル' },
      { id: 2, name: 'フォーマル' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('メタデータを取得してフォームコンポーネントを表示する', async () => {
    (fetchCoordinateMetaDataAPI as jest.Mock).mockResolvedValue(mockMetaData);
    const page = await CoordinateEditPage();
    expect(page.props.children.props.children.props.metaData).toEqual(mockMetaData);
  });

  it('APIエラー時に適切に処理する', async () => {
    const error = new Error('Failed to fetch coordinate meta data');
    (fetchCoordinateMetaDataAPI as jest.Mock).mockRejectedValue(error);
    await expect(CoordinateEditPage()).rejects.toThrow('Failed to fetch coordinate meta data');
  });

  it('正しいレイアウトでレンダリングされる', async () => {
    (fetchCoordinateMetaDataAPI as jest.Mock).mockResolvedValue(mockMetaData);
    const page = await CoordinateEditPage();
    expect(page.props.className).toBe('w-full min-h-screen px-4 py-8 sm:px-6 lg:px-8');
    const divElement = page.props.children.props;
    expect(divElement.className).toBe('w-full max-w-5xl mx-auto');
  });

  it('CoordinateEditorFormが正しく配置されている', async () => {
    (fetchCoordinateMetaDataAPI as jest.Mock).mockResolvedValue(mockMetaData);
    const page = await CoordinateEditPage();
    const formComponent = page.props.children.props.children;

    // コンポーネントの型と属性を確認
    expect(formComponent.type).toBeDefined();
    expect(typeof formComponent.type).toBe('function');
    expect(formComponent.props.metaData).toEqual(mockMetaData);
  });
});
