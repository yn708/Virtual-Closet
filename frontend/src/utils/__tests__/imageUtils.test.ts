import { useImage } from '@/context/ImageContext';
import { useImageSelection } from '@/hooks/image/useImageSelection';
import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';
import html2canvas from 'html2canvas';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '../constants';
import {
  compressImage,
  conversionImage,
  createImagePreview,
  dataURLtoFile,
  generatePreviewImage,
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

jest.mock('html2canvas', () => jest.fn());

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
          maxSizeMB: 0.5,
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
    describe('generatePreviewImage', () => {
      let mockCanvas: HTMLCanvasElement;
      let mockFileInput: HTMLInputElement;
      let mockBlob: Blob;

      beforeEach(() => {
        // Canvas モックの設定
        mockCanvas = document.createElement('canvas');
        mockCanvas.toBlob = jest.fn().mockImplementation((callback) => {
          mockBlob = new Blob([''], { type: 'image/png' });
          callback(mockBlob);
        });

        // html2canvas モックの設定
        (html2canvas as jest.Mock).mockResolvedValue(mockCanvas);

        // DataTransfer モックの設定
        const mockDataTransferItems = {
          add: jest.fn(),
          clear: jest.fn(),
          remove: jest.fn(),
        };

        const mockDataTransferFiles = {
          0: new File([''], 'coordinate_preview.png', { type: 'image/png' }),
          length: 1,
          item: () => mockDataTransferFiles[0],
        };

        const MockDataTransfer = jest.fn().mockImplementation(() => ({
          items: mockDataTransferItems,
          files: mockDataTransferFiles,
        }));

        global.DataTransfer = MockDataTransfer;

        // グローバルモックの設定
        global.URL.createObjectURL = jest.fn(() => 'mock-url');

        // FileInputのモック設定
        mockFileInput = document.createElement('input');
        mockFileInput.type = 'file';
        mockFileInput.name = 'image';
        Object.defineProperty(mockFileInput, 'files', {
          writable: true,
          value: mockDataTransferFiles,
        });

        // document.querySelector モックの設定
        document.querySelector = jest.fn(() => mockFileInput);

        // getBoundingClientRect モックの設定
        const mockDOMRect = {
          width: 800,
          height: 600,
          top: 0,
          left: 0,
          right: 800,
          bottom: 600,
          x: 0,
          y: 0,
          toJSON: () => ({
            width: 800,
            height: 600,
            top: 0,
            left: 0,
            right: 800,
            bottom: 600,
            x: 0,
            y: 0,
          }),
        };

        jest
          .spyOn(Element.prototype, 'getBoundingClientRect')
          .mockImplementation(() => mockDOMRect);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('キャンバス要素が存在しない場合はnullを返すこと', async () => {
        const result = await generatePreviewImage(null);
        expect(result).toBeNull();
      });

      it('キャンバス要素から正常にプレビュー画像を生成できること', async () => {
        const mockElement = document.createElement('div');
        mockElement.className = 'coordinate-canvas';

        // mockImageCompressionの成功ケースを設定
        mockImageCompression.mockImplementationOnce(async (file) => {
          return new File(['compressed'], file.name, { type: 'image/jpeg' });
        });

        const result = await generatePreviewImage(mockElement);

        expect(html2canvas).toHaveBeenCalledWith(
          mockElement,
          expect.objectContaining({
            scale: expect.any(Number),
            width: 800,
            height: 600,
            useCORS: true,
            allowTaint: true,
            logging: false,
            imageTimeout: 0,
            onclone: expect.any(Function),
          }),
        );
        expect(result).toBe('mock-url');
      });

      it('画像生成時にエラーが発生した場合はnullを返すこと', async () => {
        (html2canvas as jest.Mock).mockRejectedValue(new Error('Canvas generation failed'));

        const mockElement = document.createElement('div');
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const result = await generatePreviewImage(mockElement);

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith('Preview generation failed:', expect.any(Error));

        consoleSpy.mockRestore();
      });

      it('onclone関数が要素のスタイルを正しく調整すること', async () => {
        const mockElement = document.createElement('div');
        mockElement.className = 'coordinate-canvas';

        // 操作UI要素の追加
        const operationUI = document.createElement('div');
        operationUI.className = 'operation-ui';
        mockElement.appendChild(operationUI);

        // 画像要素の追加
        const img = document.createElement('img');
        mockElement.appendChild(img);

        await generatePreviewImage(mockElement);

        const onclone = (html2canvas as jest.Mock).mock.calls[0][1].onclone;
        const clonedDoc = {
          querySelector: () => mockElement,
          getElementsByTagName: () => [img],
        };

        await onclone(clonedDoc);

        // スタイルの検証
        const images = mockElement.getElementsByTagName('img');
        expect(images[0].style.imageRendering).toBe('high-quality');

        const operationUIs = mockElement.querySelectorAll('.operation-ui');
        expect((operationUIs[0] as HTMLElement).style.display).toBe('none');
      });

      it('プレビュー画像がFormDataに正しく追加されること', async () => {
        const mockElement = document.createElement('div');
        mockElement.className = 'coordinate-canvas';

        await generatePreviewImage(mockElement);

        // hidden input要素にファイルが設定されていることを確認
        const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
        expect(fileInput).toBeTruthy();
        expect(fileInput.files).toBeTruthy();
        expect(fileInput.files![0].name).toBe('coordinate_preview.png');
        expect(fileInput.files![0].type).toBe('image/png');
      });

      it('hidden input要素が見つからない場合でもURLを返すこと', async () => {
        // document.querySelectorをnullを返すようにモック化
        const originalQuerySelector = document.querySelector;
        document.querySelector = jest.fn().mockReturnValue(null);

        const mockElement = document.createElement('div');
        mockElement.className = 'coordinate-canvas';

        // mockImageCompressionの成功ケースを設定
        mockImageCompression.mockImplementationOnce(async (file) => {
          return new File(['compressed'], file.name, { type: 'image/jpeg' });
        });

        const result = await generatePreviewImage(mockElement);

        expect(result).toBe('mock-url');

        // 元のquerySelectorを復元
        document.querySelector = originalQuerySelector;
      });
    });
  });
});
