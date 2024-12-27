import { useImage } from '@/context/ImageContext';
import { photoCoordinateCreateAction } from '@/lib/actions/outfit/photoCoordinateCreateAction';
import type { FormState } from '@/types';
import type { CoordinateMetaDataType } from '@/types/coordinate';
import { render, screen } from '@testing-library/react';
import { useFormState } from 'react-dom';
import CoordinateEditorForm from '../CoordinateEditorForm';

// モジュールのモック
jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/lib/actions/outfit/photoCoordinateCreateAction', () => ({
  photoCoordinateCreateAction: jest.fn(),
}));

// 子コンポーネントのモック
jest.mock('@/features/fashion-items/components/form/field/ImageFormField', () => {
  return function MockImageFormField({
    isProcessing,
    preview,
    error,
  }: {
    isProcessing: boolean;
    preview?: string;
    error?: string;
  }) {
    return (
      <div data-testid="image-form-field">
        {isProcessing && <span>Processing...</span>}
        {preview && <span>Preview: {preview}</span>}
        {error && <span>Error: {error}</span>}
      </div>
    );
  };
});

jest.mock('../field/CoordinateEditorSelectFormFields', () => {
  return function MockCoordinateEditorSelectFormFields({
    isProcessing,
    state,
  }: {
    isProcessing: boolean;
    state: FormState;
  }) {
    return (
      <div data-testid="select-form-fields">
        {isProcessing && <span>Processing...</span>}
        {state.errors && <span>Error State</span>}
      </div>
    );
  };
});

// React DOM のフックをモック
jest.mock('react-dom', () => {
  const originalModule = jest.requireActual('react-dom');
  return {
    ...originalModule,
    useFormState: jest.fn((action) => [{ message: null, errors: null, success: false }, action]),
  };
});

describe('CoordinateEditorForm', () => {
  // テストで使用するモックデータ
  const mockMetaData: CoordinateMetaDataType = {
    seasons: [{ id: '1', name: '春', season_name: '春' }],
    scenes: [{ id: '1', name: 'カジュアル', scene: 'カジュアル' }],
    tastes: [{ id: '1', name: 'シンプル', taste: 'シンプル' }],
  };

  const mockImageContext = {
    isProcessing: false,
    preview: null,
    clearImage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useImage as jest.Mock).mockReturnValue(mockImageContext);
  });

  it('フォームが正しくレンダリングされること', () => {
    const { container } = render(<CoordinateEditorForm metaData={mockMetaData} />);

    // フォームの基本要素の確認
    const formElement = container.querySelector('form');
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveClass('max-w-7xl', 'mx-auto', 'p-6');

    // タイトルの確認
    expect(screen.getByText('コーディネート登録')).toBeInTheDocument();

    // 子コンポーネントの存在確認
    expect(screen.getByTestId('image-form-field')).toBeInTheDocument();
    expect(screen.getByTestId('select-form-fields')).toBeInTheDocument();
  });

  it('画像処理中の状態が正しく反映されること', () => {
    (useImage as jest.Mock).mockReturnValue({
      ...mockImageContext,
      isProcessing: true,
    });

    render(<CoordinateEditorForm metaData={mockMetaData} />);

    expect(screen.getByTestId('image-form-field')).toHaveTextContent('Processing...');
    expect(screen.getByTestId('select-form-fields')).toHaveTextContent('Processing...');
  });

  it('プレビュー画像が存在する場合に正しく表示されること', () => {
    const previewUrl = 'test-preview-url';
    (useImage as jest.Mock).mockReturnValue({
      ...mockImageContext,
      preview: previewUrl,
    });

    render(<CoordinateEditorForm metaData={mockMetaData} />);

    expect(screen.getByTestId('image-form-field')).toHaveTextContent(`Preview: ${previewUrl}`);
  });

  it('フォーム送信が成功した場合にclearImageが呼ばれること', async () => {
    const mockFormData = new FormData();
    (photoCoordinateCreateAction as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Success',
      errors: null,
    });

    render(<CoordinateEditorForm metaData={mockMetaData} />);

    // フォームアクションのシミュレート
    const formAction = (useFormState as jest.Mock).mock.calls[0][0];
    await formAction({ success: false }, mockFormData);

    expect(mockImageContext.clearImage).toHaveBeenCalled();
  });

  it('フォーム送信がエラーの場合にclearImageが呼ばれないこと', async () => {
    const mockFormData = new FormData();
    (photoCoordinateCreateAction as jest.Mock).mockResolvedValue({
      success: false,
      message: 'Error',
      errors: { image: 'Invalid image' },
    });

    render(<CoordinateEditorForm metaData={mockMetaData} />);

    // フォームアクションのシミュレート
    const formAction = (useFormState as jest.Mock).mock.calls[0][0];
    await formAction({ success: false }, mockFormData);

    expect(mockImageContext.clearImage).not.toHaveBeenCalled();
  });
});
