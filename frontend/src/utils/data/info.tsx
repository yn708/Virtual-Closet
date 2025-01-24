import { Calendar, Heart, Plus, Sparkles, UserCog, Users, Wand2 } from 'lucide-react';

/*------------------------------------------------------------------
WELCOME Component
------------------------------------------------------------------*/
export const TUTORIAL_STEPS = [
  {
    title: 'Virtual Closetへようこそ',
    description: 'まずは2つの簡単なステップから始めましょう',
    content: (
      <div className="space-y-6 p-4">
        {/* 利用可能な機能 */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: '1. アイテムを登録',
                icon: <Plus className="size-6 text-blue-600" />,
                description: 'お手持ちのアイテム登録',
              },
              {
                title: '2. コーディネートを作成',
                icon: <UserCog className="size-6 text-blue-600" />,
                description: '登録したアイテムを組み合わせてコーディネートを作成（もしくは画像）',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg shrink-0">
                    {step.icon}
                  </div>
                  <h4 className="font-medium">{step.title}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 開発中の機能 */}
        <div className="mt-6">
          <h3 className="font-medium text-slate-600 dark:text-slate-400 mb-3">
            <span className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full text-sm">
              追加予定の機能
            </span>
          </h3>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white dark:bg-black rounded-lg shrink-0">
                <Wand2 className="size-5 text-slate-400" />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-slate-700 dark:text-slate-300">
                  AIコーディネート提案
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  最適なコーディネートを提案します
                </p>
              </div>
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
      <div className="p-4">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:to-blue-950 dark:from-slate-950  p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'コーディネートカレンダー',
              'スタイルブック作成',
              'お気に入り・保存機能',
              'フォロー機能',
              'アイテム・コーディネート公開機能',
              'AIコーディネート提案',
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-black/80 p-4 rounded-lg flex items-center gap-3"
              >
                <div className="size-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <p className="text-slate-700 dark:text-slate-300">{feature}</p>
              </div>
            ))}
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
