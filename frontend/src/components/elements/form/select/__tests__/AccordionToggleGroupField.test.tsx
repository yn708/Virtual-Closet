import type { SelectionGroup } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccordionToggleGroupField from '../AccordionToggleGroupField';
describe('AccordionToggleGroupField', () => {
  const mockGroups: SelectionGroup[] = [
    {
      name: 'tastes',
      label: 'テイスト',
      options: [
        {
          id: '1',
          name: 'カジュアル', // nameプロパティを追加
          taste: 'カジュアル',
        },
        {
          id: '2',
          name: 'フォーマル', // nameプロパティを追加
          taste: 'フォーマル',
        },
      ],
      labelKey: 'taste',
      maxSelections: 1,
    },
    {
      name: 'scenes',
      label: 'シーン',
      options: [
        {
          id: '1',
          name: 'デイリー', // nameプロパティを追加
          scene: 'デイリー',
        },
        {
          id: '2',
          name: 'オフィス', // nameプロパティを追加
          scene: 'オフィス',
        },
      ],
      labelKey: 'scene',
      maxSelections: 2,
    },
  ];
  it('グループとオプションが正しくレンダリングされる', () => {
    render(<AccordionToggleGroupField groups={mockGroups} />);

    // 各グループのラベルが表示されている
    expect(screen.getByText('テイスト')).toBeInTheDocument();
    expect(screen.getByText('シーン')).toBeInTheDocument();

    // 最大選択数のメッセージが表示される
    expect(screen.getByText('1つまで選択可能')).toBeInTheDocument();
    expect(screen.getByText('2つまで選択可能')).toBeInTheDocument();
  });

  it('オプションを選択できる', async () => {
    const user = userEvent.setup();
    render(<AccordionToggleGroupField groups={mockGroups} />);

    // アコーディオンを開く
    const trigger = screen.getByText('テイスト');
    await user.click(trigger);

    // オプションを選択
    const casualOption = screen.getByRole('button', { name: 'カジュアル を選択' });
    await user.click(casualOption);

    // 選択結果がバッジとして表示される（クラスで特定）
    const badge = screen.getByText('カジュアル', {
      selector: '.bg-gray-100', // バッジのクラスを使用して特定
    });
    expect(badge).toBeInTheDocument();
  });

  it('最大選択数を超えて選択できない', async () => {
    const user = userEvent.setup();
    render(<AccordionToggleGroupField groups={mockGroups} />);

    // アコーディオンを開く
    await user.click(screen.getByText('テイスト'));

    // 1つ目を選択
    const casualOption = screen.getByRole('button', { name: 'カジュアル を選択' });
    await user.click(casualOption);

    // 2つ目は選択できない
    const formalOption = screen.getByRole('button', { name: 'フォーマル を選択' });
    expect(formalOption).toBeDisabled();
  });

  it('エラーメッセージが表示される', () => {
    const groupsWithError = [
      {
        ...mockGroups[0],
        error: ['選択してください'],
      },
    ];

    render(<AccordionToggleGroupField groups={groupsWithError} />);
    expect(screen.getByText('選択してください')).toBeInTheDocument();
  });

  it('hidden inputが正しく生成される', async () => {
    const user = userEvent.setup();
    const { container } = render(<AccordionToggleGroupField groups={mockGroups} />);

    // アコーディオンを開く
    await user.click(screen.getByText('テイスト'));

    // オプションを選択
    const casualOption = screen.getByRole('button', { name: 'カジュアル を選択' });
    await user.click(casualOption);

    // hidden inputの確認
    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveAttribute('name', 'tastes');
    expect(hiddenInput).toHaveAttribute('value', '1');
  });
});
