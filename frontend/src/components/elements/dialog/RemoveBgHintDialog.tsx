'use client';

import { Lightbulb } from 'lucide-react';
import IconButton from '../button/IconButton';
import BaseDialog from './BaseDialog';

const RemoveBgHintDialog = () => {
  return (
    <BaseDialog
      trigger={
        <IconButton
          Icon={Lightbulb}
          label="背景除去ヒント"
          size="sm_2"
          className="text-primary hover:text-primary-foreground hover:bg-amber-500 transition-colors"
          labelClassName="text-xs md:text-sm"
          type="button"
          variant="ghost"
        >
          背景除去がうまくいかない方はこちら
        </IconButton>
      }
      className="p-10"
    >
      <div className="space-y-8 p-4">
        <section>
          <h3 className="text-xl font-semibold mb-4 text-primary flex items-center">
            最適な画像の特徴：
          </h3>
          <ul className="grid gap-3 text-sm">
            <li className="bg-secondary p-4 rounded-lg">
              <span className="font-medium text-primary">・単純な背景</span>
              <span className="font-semibold text-red-500">（最重要）</span>
            </li>
            <li className="bg-secondary p-4 rounded-lg">
              <span className="font-medium text-primary">・被写体と背景が対比の色</span>
              <br />
              <span className="text-muted-foreground pl-2">(同系色でなければOK)</span>
            </li>
            <li className="bg-secondary p-4 rounded-lg">
              <span className="font-medium text-primary">・コントラストが高い</span>
              <br />
              <span className="text-muted-foreground pl-2">(被写体がはっきりと見えている)</span>
            </li>
            <li className="bg-secondary p-4 rounded-lg">
              <span className="font-medium text-primary">・被写体が中心にある</span>
            </li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-4 text-primary flex items-center">
            他のツールの活用：
          </h3>
          <ul className="space-y-3 text-sm list-disc list-inside pl-4">
            <li className="text-primary">
              iPhoneの標準の切り抜き機能
              <span className="text-muted-foreground font-medium ml-2">(おすすめ)</span>
            </li>
            <li className="text-primary">そのほかブラウザで「背景除去」と検索</li>
          </ul>
        </section>
      </div>
    </BaseDialog>
  );
};

export default RemoveBgHintDialog;
