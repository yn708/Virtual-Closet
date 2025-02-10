import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '../constants';
import {
  compressImage,
  conversionImage,
  createImagePreview,
  dataURLtoFile,
  validateImage,
} from '../imageUtils';

// heic2anyのモック
jest.mock('heic2any', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// imageCompressionのモック
jest.mock('browser-image-compression', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(async (file: File, _options: unknown) => {
    return new File(['compressed'], file.name, { type: file.type });
  }),
}));

jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/hooks/image/useImageSelection', () => ({
  useImageSelection: jest.fn(),
}));

describe('useImageField', () => {
  // 既存のモックの設定
  const mockRemoveBgProcess = jest.fn();
  const mockHandleFileChange = jest.fn();
  const mockImage = new File([''], 'test.png', { type: 'image/png' });

  beforeEach(() => {
    jest.clearAllMocks();

    // useImage のモック実装
    (useImage as jest.Mock).mockReturnValue({
      image: mockImage,
      removeBgProcess: mockRemoveBgProcess,
    });

    // useImageSelection のモック実装
    (useImageSelection as jest.Mock).mockReturnValue({
      handleFileChange: mockHandleFileChange,
    });
  });

  describe('imageUtils', () => {
    const mockImageCompression = imageCompression as jest.MockedFunction<typeof imageCompression>;

    describe('processImage', () => {
      beforeEach(() => {
        (heic2any as jest.Mock).mockReset();
      });

      it('HEIC画像をwebp形式に正しく変換できることを確認', async () => {
        const mockBlob = new Blob(['mock'], { type: 'image/webp' });
        (heic2any as jest.Mock).mockResolvedValue(mockBlob);

        const heicFile = new File(['test'], 'test.heic', { type: 'image/heic' });

        const result = await conversionImage(heicFile);

        expect(result).toBeInstanceOf(File);
        expect(result.type).toBe('image/webp');
        expect(result.name).toBe('test.webp');
        expect(heic2any).toHaveBeenCalledWith({
          blob: heicFile,
          toType: 'image/webp',
          quality: 0.8,
        });
      });

      it('サーバーサイドでの実行時に元のファイルを返すことを確認', async () => {
        const originalWindow = global.window;
        Object.defineProperty(global, 'window', {
          configurable: true,
          value: undefined,
        });

        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const result = await conversionImage(file);

        expect(result).toBe(file);

        Object.defineProperty(global, 'window', {
          configurable: true,
          value: originalWindow,
        });
      });
    });

    describe('validateImage', () => {
      it('許可された画像タイプが全て受け入れられることを確認', () => {
        ALLOWED_IMAGE_TYPES.forEach((type) => {
          const file = new File(['test'], 'test.jpg', { type });
          expect(validateImage(file)).toBeNull();
        });
      });

      it('HEIC形式のファイルが受け入れられることを確認', () => {
        const heicFile = new File(['test'], 'test.HEIC', { type: 'image/heic' });
        expect(validateImage(heicFile)).toBeNull();
      });

      it('未対応のファイル形式が適切に拒否されることを確認', () => {
        const invalidFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
        expect(validateImage(invalidFile)).toMatch(/未対応のファイル形式です/);
      });

      it('サイズ制限を超えるファイルが適切に拒否されることを確認', () => {
        const largeFile = new File(['x'.repeat(MAX_FILE_SIZE + 1)], 'test.jpg', {
          type: 'image/jpeg',
        });

        expect(validateImage(largeFile)).toBe('画像サイズは5MB以下にしてください。');
      });

      it('カスタムで指定した許可タイプのみが受け入れられることを確認', () => {
        const customTypes = ['image/png'];
        const jpegFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const pngFile = new File(['test'], 'test.png', { type: 'image/png' });

        expect(validateImage(jpegFile, customTypes)).toMatch(/未対応のファイル形式です/);
        expect(validateImage(pngFile, customTypes)).toBeNull();
      });
    });

    describe('compressImage', () => {
      beforeEach(() => {
        mockImageCompression.mockReset();
      });

      it('デフォルト設定での圧縮が正しく動作することを確認', async () => {
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const compressedFile = new File(['compressed'], file.name, { type: 'image/jpeg' });
        mockImageCompression.mockResolvedValue(compressedFile);

        const result = await compressImage(file);

        expect(result).toBeInstanceOf(File);
        expect(mockImageCompression).toHaveBeenCalledWith(file, {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          fileType: 'image/webp',
        });
      });

      it('カスタム設定での圧縮が正しく動作することを確認', async () => {
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const compressedFile = new File(['compressed'], file.name, { type: 'image/png' });
        mockImageCompression.mockResolvedValue(compressedFile);

        const customOptions = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 800,
          fileType: 'image/png',
        };

        const result = await compressImage(file, customOptions);

        expect(result).toBeInstanceOf(File);
        expect(mockImageCompression).toHaveBeenCalledWith(file, {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: 'image/png',
        });
      });
    });

    describe('createImagePreview', () => {
      let mockFileReader: jest.Mock;
      let originalFileReader: typeof FileReader;

      beforeAll(() => {
        originalFileReader = global.FileReader;
        mockFileReader = jest.fn(() => ({
          readAsDataURL: jest.fn(),
          onload: null,
          onerror: null,
        }));
        global.FileReader = mockFileReader as unknown as typeof FileReader;
      });

      afterAll(() => {
        global.FileReader = originalFileReader;
      });

      it('画像プレビューの生成が正常に完了することを確認', async () => {
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        const expectedDataUrl = 'data:image/jpeg;base64,dGVzdA==';

        mockFileReader.mockImplementation(() => ({
          readAsDataURL() {
            setTimeout(() => {
              if (this.onload) {
                this.onload({ target: { result: expectedDataUrl } });
              }
            }, 0);
          },
          onload: null,
          onerror: null,
        }));

        const result = await createImagePreview(file);
        expect(result).toBe(expectedDataUrl);
      });
    });

    describe('dataURLtoFile', () => {
      it('有効なデータURLからFileオブジェクトが正しく生成されることを確認', () => {
        const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
        const filename = 'test.jpg';

        const result = dataURLtoFile(dataUrl, filename);

        expect(result).toBeInstanceOf(File);
        expect(result.name).toBe(filename);
        expect(result.type).toBe('image/jpeg');
      });

      it('異なるMIMEタイプが正しく処理されることを確認', () => {
        const dataUrl =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
        const filename = 'test.png';

        const result = dataURLtoFile(dataUrl, filename);

        expect(result).toBeInstanceOf(File);
        expect(result.name).toBe(filename);
        expect(result.type).toBe('image/png');
      });

      it('Base64デコードが正しく行われることを確認', () => {
        const content = 'Hello, World!';
        const base64Content = btoa(content);
        const dataUrl = `data:text/plain;base64,${base64Content}`;
        const filename = 'test.txt';

        const result = dataURLtoFile(dataUrl, filename);

        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const decodedContent = e.target?.result;
            expect(decodedContent).toContain(content);
            resolve(null);
          };
          reader.readAsText(result);
        });
      });
    });
  });
});
