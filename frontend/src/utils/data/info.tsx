import { Calendar, CheckCircle2, Heart, Plus, Sparkles, UserCog, Users } from 'lucide-react';

/*------------------------------------------------------------------
WELCOME Component
------------------------------------------------------------------*/
export const TUTORIAL_STEPS = [
  {
    title: 'Virtual Closetへようこそ',
    description: 'まずは2つの簡単なステップから始めましょう',
    content: (
      <div className="space-y-8 p-6">
        {/* 利用可能な機能 */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: '1. アイテムを登録',
                icon: <Plus className="size-6 text-blue-600" />,
                description: 'お手持ちのアイテムをカメラまたはアルバムから登録できます',
              },
              {
                title: '2. コーディネートを作成',
                icon: <UserCog className="size-6 text-blue-600" />,
                description: '登録したアイテムを組み合わせて、あなただけのコーディネートを作成',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-xl">{step.icon}</div>
                  <div>
                    <h4 className="font-medium text-lg mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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
    title: '画像アップロードに枚数制限があります',

    content: (
      <div className="w-full p-10">
        {/* Free Plan */}
        <ul className="space-y-4">
          {['ファッションアイテムの登録（100枚まで）', 'コーディネート画像の保存（100枚まで）'].map(
            (feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-blue-500 shrink-0 mt-1" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ),
          )}
          <li className="text-gray-600">
            ※ 無制限プランは今後追加予定。 内容変更がある可能性があります。
          </li>
        </ul>
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
