import { handleArrayField, handleBooleanField, handleIdField, handleImage } from '../form-helpers';

describe('Form Handlers', () => {
  describe('handleImage', () => {
    it('Fileオブジェクトが渡された場合、FormDataに追加してtrueを返す', () => {
      const apiFormData = new FormData();
      const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      const appendSpy = jest.spyOn(apiFormData, 'append');

      const result = handleImage(apiFormData, mockFile);

      expect(result).toBe(true);
      expect(appendSpy).toHaveBeenCalledWith('image', mockFile);
    });

    it('File以外のデータが渡された場合、falseを返す', () => {
      const apiFormData = new FormData();
      const appendSpy = jest.spyOn(apiFormData, 'append');

      const result = handleImage(apiFormData, 'not-a-file');

      expect(result).toBe(false);
      expect(appendSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleArrayField', () => {
    let apiFormData: FormData;
    let appendSpy: jest.SpyInstance;

    beforeEach(() => {
      apiFormData = new FormData();
      appendSpy = jest.spyOn(apiFormData, 'append');
    });

    it('Create時: 有効な配列が渡された場合、FormDataに追加してtrueを返す', () => {
      const currentValues = ['1', '2', '3'];

      const result = handleArrayField(apiFormData, 'seasons', currentValues);

      expect(result).toBe(true);
      expect(appendSpy).toHaveBeenCalledTimes(3);
      expect(appendSpy).toHaveBeenCalledWith('seasons', '1');
      expect(appendSpy).toHaveBeenCalledWith('seasons', '2');
      expect(appendSpy).toHaveBeenCalledWith('seasons', '3');
    });

    it('Update時: 値が変更された場合、FormDataに新しい値を追加してtrueを返す', () => {
      const currentValues = ['2', '3'];
      const initialData = {
        seasons: [{ id: '1' }, { id: '2' }],
      };

      const result = handleArrayField(apiFormData, 'seasons', currentValues, initialData);

      expect(result).toBe(true);
      expect(appendSpy).toHaveBeenCalledWith('seasons', '2');
      expect(appendSpy).toHaveBeenCalledWith('seasons', '3');
    });

    it('Update時: 初期値が存在し現在値が空配列の場合、空配列をアペンドしてtrueを返す', () => {
      const currentValues: string[] = [];
      const initialData = {
        seasons: [{ id: '1' }, { id: '2' }],
      };

      const result = handleArrayField(apiFormData, 'seasons', currentValues, initialData);

      expect(result).toBe(true);
      expect(appendSpy).toHaveBeenCalledWith('seasons', '[]');
    });

    it('Update時: 値が変更されていない場合、falseを返す', () => {
      const currentValues = ['1', '2'];
      const initialData = {
        seasons: [{ id: '1' }, { id: '2' }],
      };

      const result = handleArrayField(apiFormData, 'seasons', currentValues, initialData);

      expect(result).toBe(false);
      expect(appendSpy).not.toHaveBeenCalled();
    });

    it('無効な入力の場合、falseを返す', () => {
      expect(handleArrayField(apiFormData, 'seasons', null)).toBe(false);
      expect(handleArrayField(apiFormData, 'seasons', undefined)).toBe(false);
      expect(handleArrayField(apiFormData, 'seasons', 'not-an-array' as unknown as string[])).toBe(
        false,
      );
      expect(appendSpy).not.toHaveBeenCalled();
    });
  });

  describe('handleIdField', () => {
    let apiFormData: FormData;
    let appendSpy: jest.SpyInstance;

    beforeEach(() => {
      apiFormData = new FormData();
      appendSpy = jest.spyOn(apiFormData, 'append');
    });

    it('値が変更された場合、FormDataに新しい値を追加してtrueを返す', () => {
      const initialValue = { id: '1', name: 'Old Name' };
      const newValue = '2';

      const result = handleIdField(apiFormData, 'brand', newValue, initialValue);

      expect(result).toBe(true);
      expect(appendSpy).toHaveBeenCalledWith('brand', '2');
    });

    it('値が変更されていない場合、falseを返す', () => {
      const initialValue = { id: '1', name: 'Name' };
      const newValue = '1';

      const result = handleIdField(apiFormData, 'brand', newValue, initialValue);

      expect(result).toBe(false);
      expect(appendSpy).not.toHaveBeenCalled();
    });

    it('新しい値がnullの場合、空文字列をアペンドしてtrueを返す', () => {
      const initialValue = { id: '1', name: 'Name' };
      const newValue = null;

      const result = handleIdField(apiFormData, 'brand', newValue, initialValue);

      expect(result).toBe(true);
      expect(appendSpy).toHaveBeenCalledWith('brand', '');
    });

    it('初期値がnullの場合も適切に処理する', () => {
      const initialValue = null;
      const newValue = '1';

      const result = handleIdField(apiFormData, 'brand', newValue, initialValue);

      expect(result).toBe(true);
      expect(appendSpy).toHaveBeenCalledWith('brand', '1');
    });
  });

  describe('handleBooleanField', () => {
    let apiFormData: FormData;
    let appendSpy: jest.SpyInstance;

    beforeEach(() => {
      apiFormData = new FormData();
      appendSpy = jest.spyOn(apiFormData, 'append');
    });

    it('値が変更された場合、FormDataに新しい値を追加してtrueを返す', () => {
      const result = handleBooleanField(apiFormData, 'is_owned', true, false);

      expect(result).toBe(true);
      expect(appendSpy).toHaveBeenCalledWith('is_owned', 'true');
    });

    it('値が変更されていない場合、falseを返す', () => {
      const result = handleBooleanField(apiFormData, 'is_owned', true, true);

      expect(result).toBe(false);
      expect(appendSpy).not.toHaveBeenCalled();
    });

    it('ブール値以外が渡された場合、falseを返す', () => {
      const result = handleBooleanField(
        apiFormData,
        'is_owned',
        'true' as unknown as boolean,
        false,
      );

      expect(result).toBe(false);
      expect(appendSpy).not.toHaveBeenCalled();
    });

    it('初期値が未定義の場合も適切に処理する', () => {
      const result = handleBooleanField(apiFormData, 'is_owned', true);

      expect(result).toBe(true);
      expect(appendSpy).toHaveBeenCalledWith('is_owned', 'true');
    });
  });
});
