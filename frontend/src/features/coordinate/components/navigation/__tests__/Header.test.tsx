import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { fetchCoordinateMetaDataAPI } from '@/lib/api/coordinateApi';
import type { BaseCoordinate, CoordinateMetaDataType } from '@/types/coordinate';
import { TOP_URL } from '@/utils/constants';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Header from '../Header';

// モックの設定
jest.mock('@/context/CoordinateCanvasContext', () => ({
  useCoordinateCanvasState: jest.fn(),
}));

jest.mock('@/lib/api/coordinateApi', () => ({
  fetchCoordinateMetaDataAPI: jest.fn(),
}));

jest.mock('@/components/elements/link/IconLink', () => ({
  __esModule: true,
  default: ({ href, label }: { href: string; label: string }) => (
    <a href={href} data-testid="icon-link">
      {label}
    </a>
  ),
}));

jest.mock('@/context/FashionItemsContext', () => ({
  FashionItemsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fashion-items-provider">{children}</div>
  ),
}));

jest.mock('../../dialog/FormDialog', () => ({
  __esModule: true,
  default: ({
    isLoading,
    metaData,
    initialData,
  }: {
    isLoading: boolean;
    metaData: CoordinateMetaDataType | null;
    initialData?: BaseCoordinate;
  }) => (
    <div data-testid="form-dialog">
      Loading: {isLoading.toString()}, MetaData: {metaData ? 'exists' : 'null'}, InitialData:{' '}
      {initialData ? initialData.id : 'none'}
    </div>
  ),
}));

describe('Header Component', () => {
  const mockMetaData: CoordinateMetaDataType = {
    seasons: [{ id: '1', name: '春', season_name: '春' }],
    scenes: [{ id: '1', name: 'カジュアル', scene: 'カジュアル' }],
    tastes: [{ id: '1', name: 'シンプル', taste: 'シンプル' }],
  };

  const mockInitialData: BaseCoordinate = {
    id: 'coord-1',
    image: 'coordinate-image.jpg',
    seasons: [{ id: 'season-1', season_name: '春' }],
    scenes: [{ id: 'scene-1', scene: 'カジュアル' }],
    tastes: [{ id: 'taste-1', taste: 'シンプル' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchCoordinateMetaDataAPI as jest.Mock).mockResolvedValue(mockMetaData);
  });

  describe('レイアウトとコンポーネントの表示', () => {
    it('initialDataがない場合、トップページへ戻るリンクが表示されること', async () => {
      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: [] },
      });

      render(<Header onSuccess={() => {}} />);

      const link = await screen.findByTestId('icon-link');
      expect(link).toHaveTextContent('トップへ戻る');
      expect(link).toHaveAttribute('href', TOP_URL);
    });

    it('initialDataがある場合、トップページへ戻るリンクが表示されないこと', () => {
      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: [] },
      });

      render(<Header initialData={mockInitialData} onSuccess={() => {}} />);

      expect(screen.queryByTestId('icon-link')).not.toBeInTheDocument();
    });
  });

  describe('アイテム選択状態による表示', () => {
    it('アイテムが2個未満の場合、警告メッセージが表示されること', async () => {
      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: [{ id: '1' }] },
      });

      render(<Header onSuccess={() => {}} />);

      expect(screen.getByText(/アイテムは2個以上選択する必要があります/)).toBeInTheDocument();
      expect(screen.queryByTestId('form-dialog')).not.toBeInTheDocument();
    });

    it('アイテムが2個以上の場合、FormDialogが表示されること', async () => {
      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: [{ id: '1' }, { id: '2' }] },
      });

      render(<Header onSuccess={() => {}} />);

      expect(screen.queryByText(/アイテムは2個以上選択する必要があります/)).not.toBeInTheDocument();
      expect(screen.getByTestId('form-dialog')).toBeInTheDocument();
    });

    it('selectedItemsがundefinedの場合、警告メッセージが表示されること', async () => {
      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: undefined },
      });

      render(<Header onSuccess={() => {}} />);

      expect(screen.getByText(/アイテムは2個以上選択する必要があります/)).toBeInTheDocument();
    });
  });

  describe('メタデータの取得とローディング', () => {
    it('コンポーネントマウント時にメタデータを取得すること', async () => {
      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: [{ id: '1' }, { id: '2' }] },
      });

      render(<Header onSuccess={() => {}} />);

      await waitFor(() => {
        expect(fetchCoordinateMetaDataAPI).toHaveBeenCalledTimes(1);
      });
    });

    it('メタデータ取得中はローディング状態になること', async () => {
      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: [{ id: '1' }, { id: '2' }] },
      });

      let resolvePromise: (value: CoordinateMetaDataType) => void;
      const mockPromise = new Promise<CoordinateMetaDataType>((resolve) => {
        resolvePromise = resolve;
      });

      (fetchCoordinateMetaDataAPI as jest.Mock).mockReturnValue(mockPromise);

      render(<Header onSuccess={() => {}} />);

      const formDialog = screen.getByTestId('form-dialog');
      expect(formDialog).toHaveTextContent('Loading: true');

      await act(async () => {
        resolvePromise!(mockMetaData);
      });

      await waitFor(() => {
        expect(formDialog).toHaveTextContent('Loading: false');
      });
    });

    it('APIエラー時にエラーがコンソールに出力されること', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('API Error');
      (fetchCoordinateMetaDataAPI as jest.Mock).mockRejectedValue(mockError);

      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: [{ id: '1' }, { id: '2' }] },
      });

      render(<Header onSuccess={() => {}} />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch metadata:', mockError);
      });

      consoleSpy.mockRestore();
    });
  });

  describe('FormDialogのprops', () => {
    it('編集モード時に正しいpropsが渡されること', async () => {
      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: [{ id: '1' }, { id: '2' }] },
      });

      const mockOnSuccess = jest.fn();

      render(<Header initialData={mockInitialData} onSuccess={mockOnSuccess} />);

      const formDialog = await screen.findByTestId('form-dialog');
      expect(formDialog).toHaveTextContent('InitialData: coord-1');
    });

    it('新規作成時に正しいpropsが渡されること', async () => {
      (useCoordinateCanvasState as jest.Mock).mockReturnValue({
        state: { selectedItems: [{ id: '1' }, { id: '2' }] },
      });

      render(<Header onSuccess={() => {}} />);

      const formDialog = await screen.findByTestId('form-dialog');
      expect(formDialog).toHaveTextContent('InitialData: none');
    });
  });
});
