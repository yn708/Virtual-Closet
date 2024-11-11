import { compressImage, processImage } from '@/utils/imageUtils';
import { renderHook } from '@testing-library/react';
import { useImageProcessing } from '../useImageProcessing';

jest.mock('@/utils/imageUtils', () => ({
  compressImage: jest.fn(),
  processImage: jest.fn(),
}));

describe('useImageProcessing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockFile = (name: string, type: string): File => {
    return new File([''], name, { type });
  };

  describe('processImageFile', () => {
    // HEICファイルの処理をテスト
    it('should process and compress HEIC files', async () => {
      const mockHeicFile = createMockFile('test.heic', 'image/heic');
      const processedFile = createMockFile('processed.jpg', 'image/jpeg');

      (processImage as jest.Mock).mockResolvedValue(processedFile);
      (compressImage as jest.Mock).mockResolvedValue('compressed-result');

      const { result } = renderHook(() => useImageProcessing());
      const output = await result.current.processImageFile(mockHeicFile);

      expect(processImage).toHaveBeenCalledWith(mockHeicFile);
      expect(compressImage).toHaveBeenCalledWith(processedFile);
      expect(output).toBe('compressed-result');
    });

    // 通常の画像ファイルの処理をテスト
    it('should only compress non-HEIC files', async () => {
      const mockJpegFile = createMockFile('test.jpg', 'image/jpeg');
      (compressImage as jest.Mock).mockResolvedValue('compressed-result');

      const { result } = renderHook(() => useImageProcessing());
      const output = await result.current.processImageFile(mockJpegFile);

      expect(processImage).not.toHaveBeenCalled();
      expect(compressImage).toHaveBeenCalledWith(mockJpegFile);
      expect(output).toBe('compressed-result');
    });
  });
});
