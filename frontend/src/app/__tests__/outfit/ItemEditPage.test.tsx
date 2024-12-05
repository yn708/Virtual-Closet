/**
 * @jest-environment node
 */
import ItemEditPage from '@/app/(protected)/outfit/item/edit/page';
import { fetchFashionItemMetaDataAPI } from '@/lib/api/fashionItemsApi';

// モックの設定
jest.mock('@/lib/api/fashionItemsApi', () => ({
  fetchFashionItemMetaDataAPI: jest.fn(),
}));

jest.mock('@/features/fashion-items/components/form/ItemEditorForm', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

/**
 * アイテム編集ページのテストスイート
 */
describe('ItemEditPage', () => {
  // モックメタデータ
  const mockMetaData = {
    categories: [
      { id: 1, name: 'トップス' },
      { id: 2, name: 'ボトムス' },
    ],
    colors: [
      { id: 1, name: '黒' },
      { id: 2, name: '白' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('メタデータを取得してフォームコンポーネントを表示する', async () => {
    // APIモックの戻り値を設定
    (fetchFashionItemMetaDataAPI as jest.Mock).mockResolvedValue(mockMetaData);

    // ページコンポーネントをレンダリング
    const page = await ItemEditPage();

    // ItemEditorFormに正しいpropsが渡されているか確認
    expect(page.props.children.props.children.props.metaData).toEqual(mockMetaData);
  });

  it('APIエラー時に適切に処理する', async () => {
    // APIエラーをモック
    const error = new Error('Failed to fetch meta data');
    (fetchFashionItemMetaDataAPI as jest.Mock).mockRejectedValue(error);

    // エラーがスローされることを確認
    await expect(ItemEditPage()).rejects.toThrow('Failed to fetch meta data');
  });

  it('正しいレイアウトでレンダリングされる', async () => {
    // APIモックの戻り値を設定
    (fetchFashionItemMetaDataAPI as jest.Mock).mockResolvedValue(mockMetaData);

    // ページコンポーネントをレンダリング
    const page = await ItemEditPage();

    // mainタグの存在とクラスを確認
    expect(page.props.className).toBe('w-full min-h-screen px-4 py-8 sm:px-6 lg:px-8');

    // 内部のdivタグのクラスを確認
    const divElement = page.props.children.props;
    expect(divElement.className).toBe('w-full max-w-5xl mx-auto');
  });
});
