import { privacyData } from '@/utils/data/privacy';
import { termsData } from '@/utils/data/terms';
import { fireEvent, render, screen } from '@testing-library/react';
import { LegalDialog } from '../LegalDialog';

describe('LegalDialog', () => {
  // 利用規約のテスト
  describe('利用規約の表示', () => {
    beforeEach(() => {
      render(<LegalDialog data={termsData} label="利用規約" />);
      // ダイアログを開く
      fireEvent.click(screen.getByRole('button', { name: '利用規約' }));
    });

    it('利用規約の基本情報が正しく表示される', () => {
      // ダイアログのタイトルを確認（roleを使用）
      expect(screen.getByRole('heading', { name: '利用規約' })).toBeInTheDocument();
      expect(screen.getByText(/この利用規約（以下、「本規約」）は/)).toBeInTheDocument();
    });

    it('利用規約の重要なセクションが表示される', () => {
      expect(screen.getByText('第1条（適用）')).toBeInTheDocument();
      expect(screen.getByText('第2条（利用登録）')).toBeInTheDocument();
      expect(screen.getByText('第4条（禁止事項）')).toBeInTheDocument();
    });

    it('サブアイテムを含むセクションが正しく表示される', () => {
      expect(
        screen.getByText(/利用登録の申請に際して虚偽の事項を届け出た場合/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/本規約に違反したことがある者からの申請である場合/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/その他、本サービスが利用登録を相当でないと判断した場合/),
      ).toBeInTheDocument();
    });
  });

  describe('プライバシーポリシーの表示', () => {
    beforeEach(() => {
      render(<LegalDialog data={privacyData} label="プライバシーポリシー" />);
      // ダイアログを開く
      fireEvent.click(screen.getByRole('button', { name: 'プライバシーポリシー' }));
    });

    it('プライバシーポリシーの基本情報が正しく表示される', () => {
      expect(screen.getByRole('heading', { name: 'プライバシーポリシー' })).toBeInTheDocument();
      expect(screen.getByText(/本ウェブサイト上で提供するサービス/)).toBeInTheDocument();
    });

    it('重要な個人情報の定義が表示される', () => {
      expect(screen.getByText('第1条（個人情報）')).toBeInTheDocument();
      expect(screen.getByText(/「個人情報」とは，個人情報保護法にいう/)).toBeInTheDocument();
    });

    it('個人情報の収集方法が正しく表示される', () => {
      expect(screen.getByText('第2条（個人情報の収集方法）')).toBeInTheDocument();
      expect(
        screen.getByText(/メールアドレスまたはGoogleアカウント情報を取得します/),
      ).toBeInTheDocument();
    });
  });

  describe('UI操作', () => {
    it('ダイアログが開閉できる', () => {
      render(<LegalDialog data={termsData} label="利用規約" />);

      // 初期状態では内容が表示されていない
      expect(screen.queryByText('第1条（適用）')).not.toBeInTheDocument();

      // ダイアログを開く
      fireEvent.click(screen.getByText('利用規約'));
      expect(screen.getByText('第1条（適用）')).toBeInTheDocument();
    });
  });
});
