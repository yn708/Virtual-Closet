import { Calendar, CheckCircle2, Heart, Sparkles, Users } from 'lucide-react';

/*------------------------------------------------------------------
WELCOME Component
------------------------------------------------------------------*/
export const TUTORIAL_STEPS = [
  {
    title: 'Virtual Closetへようこそ',
    description: 'まずは2つの簡単なステップから始めましょう',
    content: (
      <div className="h-full flex items-center justify-center">
        {/* 利用可能な機能 */}
        <div className="w-full max-w-xl space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                title: 'アイテムを登録',
                description: 'お手持ちのアイテムをカメラまたはアルバムから登録できます',
              },
              {
                title: 'コーディネートを作成',
                description: '登録したアイテムを組み合わせて、あなただけのコーディネートを作成',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-base mb-1">{step.title}</h4>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'アイテム作成数には上限があります',
    description: '無料プランの制限について',
    content: (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
            <ul className="space-y-3">
              {[
                'ファッションアイテムの登録（最大:100）',
                'コーディネート画像の保存（最大:100）',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-500 shrink-0 mt-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                基本的に不便なく使用可能です。
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ※ 無制限プランは今後追加予定。内容変更がある可能性があります。
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '今後追加予定の機能',
    description: 'さらに便利な機能を準備中です',
    content: (
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  feature: 'コーディネートカレンダー',
                },
                {
                  feature: 'スタイルブック作成',
                },
                {
                  feature: 'お気に入り・保存機能',
                },
                {
                  feature: 'フォロー機能',
                },
                {
                  feature: 'アイテム・コーディネート公開機能',
                },
                {
                  feature: 'AIコーディネート提案',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/90 dark:bg-black/90 p-3 rounded-md flex items-center gap-4"
                >
                  <div className="size-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{item.feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

/*------------------------------------------------------------------
LandingPage
------------------------------------------------------------------*/
// 悩み提示
export const CONCERNS = [
  {
    id: 1,
    title: 'おしゃれに自信がない\n服選びが難しい',
  },
  {
    id: 2,
    title: '持っている服の管理が\nできていない',
  },
  {
    id: 3,
    title: '毎日のコーディネートに\n時間がかかる',
  },
  {
    id: 4,
    title: '新しいコーディネートの\nアイデアが欲しい',
  },
];

// 機能紹介
export const FEATURES = [
  {
    title: 'ファッションアイテム管理',
    description: [
      'カテゴリー、ブランド、シーズンなど詳細な情報をスマートに管理',
      '絞り込み機能によりその時に必要なアイテムを表示',
      '画像の背景を自動で除去し、アイテムを見やすく表示',
    ],
    image: [
      { src: '/images/example1.webp', alt: 'アイテム一覧画面' },
      { src: '/images/example2.webp', alt: 'アイテム詳細画面' },
    ],
  },

  {
    title: 'コーディネート作成・管理',
    description: [
      '登録アイテムを自由に組み合わせて新しいコーディネートを作成',
      'シーン別・テイスト別に管理し、状況に応じた着こなしを登録',
      '写真登録も可能ため、お気に入りのコーディネートを瞬時に登録',
    ],
    image: [
      { src: '/images/example3.webp', alt: 'コーディネート作成画面' },
      { src: '/images/example4.webp', alt: 'コーディネート作成画面' },
    ],
  },
];

// 今後追加される機能
export const UPCOMING_FEATURES = [
  {
    icon: <Sparkles className="size-5 md:size-8 text-blue-600" />,
    title: 'AIコーディネート提案',
    description: 'シーンや状況に応じたおしゃれで最適なコーディネートを提案',
  },
  {
    icon: <Users className="size-5 md:size-8 text-blue-600" />,
    title: 'SNS機能',
    description: '他のユーザーとつながり、コーディネートやアイテムを共有',
  },
  {
    icon: <Heart className="size-5 md:size-8 text-blue-600" />,
    title: 'お気に入り機能',
    description: '気になるアイテムやコーディネートを保存',
  },
  {
    icon: <Calendar className="size-5 md:size-8 text-blue-600" />,
    title: 'コーディネートカレンダー',
    description: '着用予定や履歴を簡単に管理',
  },
];
