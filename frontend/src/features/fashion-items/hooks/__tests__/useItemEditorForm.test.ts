import { initialState } from '@/utils/data/initialState';
import { useItemEditorForm } from '../useItemEditorForm';

// ImageContextとToastのみをモック
jest.mock('@/context/ImageContext', () => ({
  useImage: () => ({
    isProcessing: false,
    preview: 'preview-url',
    clearImage: jest.fn(),
  }),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// モジュール全体をモック
jest.mock('@/lib/actions/outfit/fashionItemsCreateAction', () => ({
  fashionItemsCreateAction: jest.fn(),
}));

jest.mock('@/lib/actions/outfit/fashionItemsUpdateAction', () => ({
  fashionItemsUpdateAction: jest.fn(),
}));

jest.mock('react-dom', () => ({
  useFormState: jest.fn(() => [initialState, jest.fn()]),
}));

describe('useItemEditorForm', () => {
  // setupプロパティ用のモックデータ
  const setup = () => {
    const initialData = {
      id: '1',
      image: 'test.jpg',
      sub_category: { id: '1', subcategory_name: 'カテゴリー' },
      brand: { id: '1', brand_name: 'ブランド', brand_name_kana: 'ブランド' },
      seasons: [{ id: '1', season_name: 'シーズン' }] as [{ id: string; season_name: string }],
      price_range: { id: '1', price_range: '1000-2000' },
      design: { id: '1', design_pattern: 'パターン' },
      main_color: { id: '1', color_name: '色', color_code: '#000000' },
      is_owned: true,
      is_old_clothes: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const props = {
      initialData,
      onSuccess: jest.fn(),
    };

    return {
      initialData,
      props,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 基本的な初期化のテスト
  it('should initialize with default values', () => {
    const { props } = setup();
    const hook = useItemEditorForm(props);

    expect(hook.state).toBeDefined();
    expect(hook.formAction).toBeDefined();
    expect(hook.isProcessing).toBe(false);
    expect(hook.preview).toBe('preview-url');
  });

  // 初期データがある場合のテスト
  it('should initialize with initial data', () => {
    const { props } = setup();
    const hook = useItemEditorForm(props);

    expect(hook.state).toEqual(initialState);
  });

  // 画像プレビューのテスト
  it('should provide image preview', () => {
    const { props } = setup();
    const hook = useItemEditorForm(props);

    expect(hook.preview).toBe('preview-url');
  });

  // 処理状態のテスト
  it('should provide processing state', () => {
    const { props } = setup();
    const hook = useItemEditorForm(props);

    expect(hook.isProcessing).toBe(false);
  });
});
