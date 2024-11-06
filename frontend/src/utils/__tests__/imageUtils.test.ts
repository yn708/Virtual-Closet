import heic2any from 'heic2any';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '../constants';
import { processImage, validateImage } from '../imageUtils';

// heic2anyのモック
jest.mock('heic2any', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('imageUtils', () => {
  let consoleErrorSpy: jest.SpyInstance;

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

      const result = await processImage(heicFile);

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
      const result = await processImage(jpegFile);

      expect(result).toBe(jpegFile);
      expect(heic2any).not.toHaveBeenCalled();
    });

    // HEIC変換時のエラーが適切に処理されることを確認
    it('should handle conversion errors properly', async () => {
      (heic2any as jest.Mock).mockRejectedValue(new Error('Conversion failed'));

      const heicFile = new File(['test'], 'test.heic', { type: 'image/heic' });

      await expect(processImage(heicFile)).rejects.toThrow('HEIC画像の変換に失敗しました。');

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
      const result = await processImage(file);

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
});
