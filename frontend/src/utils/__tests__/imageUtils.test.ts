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

describe('imageUtils', () => {
  let consoleErrorSpy: jest.SpyInstance;
  const mockImageCompression = imageCompression as jest.MockedFunction<typeof imageCompression>;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('processImage', () => {
    beforeEach(() => {
      (heic2any as jest.Mock).mockReset();
    });

    // HEIC画像をJPEG形式に正しく変換できることを確認
    it('should process HEIC image and convert to JPEG', async () => {
      const mockBlob = new Blob(['mock'], { type: 'image/jpeg' });
      (heic2any as jest.Mock).mockResolvedValue(mockBlob);

      const heicFile = new File(['test'], 'test.heic', { type: 'image/heic' });

      const result = await conversionImage(heicFile);

      expect(result).toBeInstanceOf(File);
      expect(result.type).toBe('image/jpeg');
      expect(result.name).toBe('test.jpg');
      expect(heic2any).toHaveBeenCalledWith({
        blob: heicFile,
        toType: 'image/jpeg',
        quality: 0.8,
      });
    });

    // HEIC以外の画像は変換せずにそのまま返すことを確認
    it('should return original file for non-HEIC images', async () => {
      const jpegFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = await conversionImage(jpegFile);

      expect(result).toBe(jpegFile);
      expect(heic2any).not.toHaveBeenCalled();
    });

    // HEIC変換時のエラーが適切に処理されることを確認
    it('should handle conversion errors properly', async () => {
      (heic2any as jest.Mock).mockRejectedValue(new Error('Conversion failed'));

      const heicFile = new File(['test'], 'test.heic', { type: 'image/heic' });

      await expect(conversionImage(heicFile)).rejects.toThrow('HEIC画像の変換に失敗しました。');

      expect(consoleErrorSpy).toHaveBeenCalledWith('HEIC conversion failed:', expect.any(Error));
    });

    // サーバーサイドでの実行時に元のファイルを返すことを確認
    it('should handle server-side execution', async () => {
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
    // 許可された画像タイプが全て受け入れられることを確認
    it('should accept valid image types', () => {
      ALLOWED_IMAGE_TYPES.forEach((type) => {
        const file = new File(['test'], 'test.jpg', { type });
        expect(validateImage(file)).toBeNull();
      });
    });

    // HEIC形式のファイルが受け入れられることを確認
    it('should accept HEIC files', () => {
      const heicFile = new File(['test'], 'test.HEIC', { type: 'image/heic' });
      expect(validateImage(heicFile)).toBeNull();
    });

    // 未対応のファイル形式が適切に拒否されることを確認
    it('should reject invalid file types', () => {
      const invalidFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      expect(validateImage(invalidFile)).toMatch(/未対応のファイル形式です/);
    });

    // サイズ制限を超えるファイルが適切に拒否されることを確認
    it('should reject files larger than MAX_FILE_SIZE', () => {
      const largeFile = new File(['x'.repeat(MAX_FILE_SIZE + 1)], 'test.jpg', {
        type: 'image/jpeg',
      });

      expect(validateImage(largeFile)).toBe('画像サイズは5MB以下にしてください。');
    });

    // カスタムで指定した許可タイプのみが受け入れられることを確認
    it('should work with custom allowed types', () => {
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

    // デフォルト設定での圧縮が正しく動作することを確認
    it('should compress image with default options', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const compressedFile = new File(['compressed'], file.name, { type: 'image/jpeg' });
      mockImageCompression.mockResolvedValue(compressedFile);

      const result = await compressImage(file);

      expect(result).toBeInstanceOf(File);
      expect(mockImageCompression).toHaveBeenCalledWith(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/jpeg',
      });
    });

    // カスタム設定での圧縮が正しく動作することを確認
    it('should compress image with custom options', async () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const compressedFile = new File(['compressed'], file.name, { type: 'image/png' });
      mockImageCompression.mockResolvedValue(compressedFile);

      const customOptions = {
        maxSizeMB: 2,
        maxWidthOrHeight: 800,
        fileType: 'image/png',
      };

      const result = await compressImage(file, customOptions);

      expect(result).toBeInstanceOf(File);
      expect(mockImageCompression).toHaveBeenCalledWith(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/png',
      });
    });

    // 圧縮時のエラーが適切に処理されることを確認
    it('should handle compression errors properly', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const error = new Error('Compression failed');
      mockImageCompression.mockRejectedValue(error);

      await expect(compressImage(file)).rejects.toThrow('Compression failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error compressing image:', error);
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

    // 正常系：画像プレビューの生成が成功する場合
    it('should create image preview successfully', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const expectedDataUrl = 'data:image/jpeg;base64,dGVzdA==';

      // FileReaderのモック実装
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
    // 正常系：有効なデータURLからFileオブジェクトを生成
    it('should convert valid data URL to File object', () => {
      const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
      const filename = 'test.jpg';

      const result = dataURLtoFile(dataUrl, filename);

      expect(result).toBeInstanceOf(File);
      expect(result.name).toBe(filename);
      expect(result.type).toBe('image/jpeg');
    });

    // 正常系：異なるMIMEタイプの処理
    it('should handle different MIME types', () => {
      const dataUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const filename = 'test.png';

      const result = dataURLtoFile(dataUrl, filename);

      expect(result).toBeInstanceOf(File);
      expect(result.name).toBe(filename);
      expect(result.type).toBe('image/png');
    });

    // 正常系：Base64デコードの検証
    it('should correctly decode base64 content', () => {
      const content = 'Hello, World!';
      const base64Content = btoa(content);
      const dataUrl = `data:text/plain;base64,${base64Content}`;
      const filename = 'test.txt';

      const result = dataURLtoFile(dataUrl, filename);

      // FileReaderを使用してファイルの内容を確認
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
