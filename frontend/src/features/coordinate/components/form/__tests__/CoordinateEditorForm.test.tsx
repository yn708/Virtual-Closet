import { usePhotoCoordinateForm } from '@/features/coordinate/hooks/usePhotoCoordinateForm';
import type { FormState } from '@/types';
import type { BaseCoordinate } from '@/types/coordinate';
import { BACKEND_URL } from '@/utils/constants';
import { render, screen } from '@testing-library/react';
import CoordinateEditorForm from '../CoordinateEditorForm';

// モジュールのモック
jest.mock('../../../hooks/usePhotoCoordinateForm', () => ({
  usePhotoCoordinateForm: jest.fn(),
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

jest.mock('./../field/CoordinateEditorSelectFormFields', () => {
  return function MockCoordinateEditorSelectFormFields({
    isProcessing,
    state,
    initialData,
  }: {
    isProcessing: boolean;
    state: FormState;
    initialData?: BaseCoordinate;
  }) {
    return (
      <div data-testid="select-form-fields">
        {isProcessing && <span>Processing...</span>}
        {state.errors && <span>Error State</span>}
        {initialData && <span>Has Initial Data</span>}
      </div>
    );
  };
});

describe('CoordinateEditorForm', () => {
  // テストで使用するモックデータ
  const mockMetaData = {
    seasons: [{ id: '1', name: '春', season_name: '春' }],
    scenes: [{ id: '1', name: 'カジュアル', scene: 'カジュアル' }],
    tastes: [{ id: '1', name: 'シンプル', taste: 'シンプル' }],
  };

  const mockFormHook = {
    state: { message: null, errors: null, success: false },
    formAction: jest.fn(),
    isProcessing: false,
    preview: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (usePhotoCoordinateForm as jest.Mock).mockReturnValue(mockFormHook);
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
    (usePhotoCoordinateForm as jest.Mock).mockReturnValue({
      ...mockFormHook,
      isProcessing: true,
    });

    render(<CoordinateEditorForm metaData={mockMetaData} />);

    expect(screen.getByTestId('image-form-field')).toHaveTextContent('Processing...');
    expect(screen.getByTestId('select-form-fields')).toHaveTextContent('Processing...');
  });

  it('プレビュー画像が存在する場合に正しく表示されること', () => {
    const previewUrl = 'test-preview-url';
    (usePhotoCoordinateForm as jest.Mock).mockReturnValue({
      ...mockFormHook,
      preview: previewUrl,
    });

    render(<CoordinateEditorForm metaData={mockMetaData} />);

    expect(screen.getByTestId('image-form-field')).toHaveTextContent(`Preview: ${previewUrl}`);
  });

  it('初期データがある場合に正しく表示されること', () => {
    const initialData: BaseCoordinate = {
      id: '1',
      image: 'http://backend:8000/media/test.jpg',
      seasons: [{ id: 'season-1', season_name: '春' }],
      scenes: [{ id: 'scene-1', scene: 'カジュアル' }],
      tastes: [{ id: 'taste-1', taste: 'シンプル' }],
    };

    render(
      <CoordinateEditorForm
        metaData={mockMetaData}
        initialData={initialData}
        onSuccess={jest.fn()}
      />,
    );

    const expectedImageUrl = `${BACKEND_URL}/media/test.jpg`;
    expect(screen.getByTestId('image-form-field')).toHaveTextContent(
      `Preview: ${expectedImageUrl}`,
    );
    expect(screen.getByTestId('select-form-fields')).toHaveTextContent('Has Initial Data');
  });

  it('カスタムフックが正しいパラメータで呼び出されること', () => {
    const onSuccess = jest.fn();
    const initialData: BaseCoordinate = {
      id: '1',
      image: 'test.jpg',
      seasons: [{ id: 'season-1', season_name: '春' }],
      scenes: [{ id: 'scene-1', scene: 'カジュアル' }],
      tastes: [{ id: 'taste-1', taste: 'シンプル' }],
    };

    render(
      <CoordinateEditorForm
        metaData={mockMetaData}
        initialData={initialData}
        onSuccess={onSuccess}
      />,
    );

    expect(usePhotoCoordinateForm).toHaveBeenCalledWith({
      initialData,
      onSuccess,
    });
  });
});
