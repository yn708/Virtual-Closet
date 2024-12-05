import json
import os

brands = [
    # ファストファッション
    {"brand_name": "Uniqlo", "brand_name_kana": "ユニクロ", "is_popular": True},
    {"brand_name": "GU", "brand_name_kana": "ジーユー", "is_popular": True},
    {"brand_name": "Zara", "brand_name_kana": "ザラ", "is_popular": True},
    {"brand_name": "WEGO", "brand_name_kana": "ウィゴー", "is_popular": True},
    {"brand_name": "H&M", "brand_name_kana": "エイチアンドエム", "is_popular": True},
    {"brand_name": "GAP", "brand_name_kana": "ギャップ", "is_popular": False},
    {"brand_name": "無印良品", "brand_name_kana": "ムジルシリョウヒン", "is_popular": False},
    # カジュアルブランド
    {"brand_name": "BEAMS", "brand_name_kana": "ビームス", "is_popular": True},
    {"brand_name": "FREAK'S STORE", "brand_name_kana": "フリークスストア", "is_popular": True},
    {"brand_name": "BEAUTY & YOUTH", "brand_name_kana": "ビューティアンドユース", "is_popular": True},
    {
        "brand_name": "H BEAUTY & YOUTH UNITED ARROWS",
        "brand_name_kana": "エイチビューティアンドユースユナイテッドアローズ",
        "is_popular": True,
    },
    {"brand_name": "MONKEY TIME", "brand_name_kana": "モンキータイム", "is_popular": True},
    {"brand_name": "ADAM ET ROPE'", "brand_name_kana": "アダムエロペ", "is_popular": True},
    {"brand_name": "UNITED ARROWS", "brand_name_kana": "ユナイテッドアローズ", "is_popular": True},
    {"brand_name": "URBAN RESEARCH", "brand_name_kana": "アーバンリサーチ", "is_popular": True},
    {"brand_name": "JOURNAL STANDARD", "brand_name_kana": "ジャーナルスタンダード", "is_popular": True},
    {"brand_name": "nano・universe", "brand_name_kana": "ナノユニバース", "is_popular": True},
    {"brand_name": "LOWRYS FARM", "brand_name_kana": "ローリーズファーム", "is_popular": True},
    {"brand_name": "GLOBAL WORK", "brand_name_kana": "グローバルワーク", "is_popular": True},
    {"brand_name": "STUDIOUS", "brand_name_kana": "ステュディオス", "is_popular": True},
    {"brand_name": "UNITED TOKYO", "brand_name_kana": "ユナイテッドトウキョウ", "is_popular": True},
    {"brand_name": "HARE", "brand_name_kana": "ハレ", "is_popular": True},
    {"brand_name": "SENSE OF PLACE", "brand_name_kana": "センスオブプレイス", "is_popular": True},
    {"brand_name": "niko and...", "brand_name_kana": "ニコアンド", "is_popular": True},
    {"brand_name": "TOMMY HILFIGER", "brand_name_kana": "トミーヒルフィガー", "is_popular": True},
    {"brand_name": "Calvin Klein", "brand_name_kana": "カルバンクライン", "is_popular": True},
    {"brand_name": "DIESEL", "brand_name_kana": "ディーゼル", "is_popular": True},
    {"brand_name": "A.P.C", "brand_name_kana": "アーペーセー", "is_popular": True},
    {"brand_name": "EMMA CLOTHES", "brand_name_kana": "エマクローズ", "is_popular": False},
    {"brand_name": "CITEN", "brand_name_kana": "シテン", "is_popular": False},
    {"brand_name": "RAGEBLUE", "brand_name_kana": "レイジブルー", "is_popular": False},
    {"brand_name": "COLONY 2139", "brand_name_kana": "コロニートゥーワンスリーナイン", "is_popular": False},
    {"brand_name": "SHIPS", "brand_name_kana": "シップス", "is_popular": False},
    {"brand_name": "EDIFICE", "brand_name_kana": "エディフィス", "is_popular": False},
    {"brand_name": "CIAOPANIC", "brand_name_kana": "チャオパニック", "is_popular": False},
    {"brand_name": "AVIREX", "brand_name_kana": "アヴィレックス", "is_popular": False},
    # ストリートブランド
    {"brand_name": "Supreme", "brand_name_kana": "シュプリーム", "is_popular": True},
    {"brand_name": "STUSSY", "brand_name_kana": "ステューシー", "is_popular": True},
    {"brand_name": "thisisneverthat", "brand_name_kana": "ディスイズネバーザット", "is_popular": True},
    {"brand_name": "OFF-WHITE", "brand_name_kana": "オフホワイト", "is_popular": True},
    {"brand_name": "KITH", "brand_name_kana": "キス", "is_popular": True},
    {"brand_name": "Carhartt", "brand_name_kana": "カーハート", "is_popular": True},
    # スポーツブランド
    {"brand_name": "New Balance", "brand_name_kana": "ニューバランス", "is_popular": True},
    {"brand_name": "Nike", "brand_name_kana": "ナイキ", "is_popular": True},
    {"brand_name": "Adidas", "brand_name_kana": "アディダス", "is_popular": True},
    {"brand_name": "CONVERSE", "brand_name_kana": "コンバース", "is_popular": True},
    {"brand_name": "VANS", "brand_name_kana": "バンズ", "is_popular": True},
    {"brand_name": "Champion", "brand_name_kana": "チャンピオン", "is_popular": True},
    {"brand_name": "LACOSTE", "brand_name_kana": "ラコステ", "is_popular": True},
    {"brand_name": "Puma", "brand_name_kana": "プーマ", "is_popular": False},
    {"brand_name": "REEBOK", "brand_name_kana": "リーボック", "is_popular": False},
    {"brand_name": "FILA", "brand_name_kana": "フィラ", "is_popular": False},
    {"brand_name": "ASICS", "brand_name_kana": "アシックス", "is_popular": False},
    # アウトドアブランド
    {"brand_name": "THE NORTH FACE", "brand_name_kana": "ザノースフェイス", "is_popular": True},
    {"brand_name": "Patagonia", "brand_name_kana": "パタゴニア", "is_popular": True},
    {"brand_name": "Columbia", "brand_name_kana": "コロンビア", "is_popular": False},
    {"brand_name": "TATRAS", "brand_name_kana": "タトラス", "is_popular": False},
    # ハイブランド（高級ブランド）
    {"brand_name": "GUCCI", "brand_name_kana": "グッチ", "is_popular": False},
    {"brand_name": "PRADA", "brand_name_kana": "プラダ", "is_popular": False},
    {"brand_name": "LOUIS VUITTON", "brand_name_kana": "ルイヴィトン", "is_popular": False},
    {"brand_name": "DIOR", "brand_name_kana": "ディオール", "is_popular": False},
    {"brand_name": "BURBERRY", "brand_name_kana": "バーバリー", "is_popular": False},
    {"brand_name": "FENDI", "brand_name_kana": "フェンディ", "is_popular": False},
    {"brand_name": "BALENCIAGA", "brand_name_kana": "バレンシアガ", "is_popular": False},
    {"brand_name": "CELINE", "brand_name_kana": "セリーヌ", "is_popular": False},
    {"brand_name": "Saint Laurent", "brand_name_kana": "サンローラン", "is_popular": False},
    {"brand_name": "MAISON MARGIELA", "brand_name_kana": "メゾンマルジェラ", "is_popular": False},
    {"brand_name": "MARNI", "brand_name_kana": "マルニ", "is_popular": False},
    {"brand_name": "JIL SANDER", "brand_name_kana": "ジルサンダー", "is_popular": False},
    {"brand_name": "COACH", "brand_name_kana": "コーチ", "is_popular": False},
    {"brand_name": "HERMES", "brand_name_kana": "エルメス", "is_popular": False},
    {"brand_name": "CHANEL", "brand_name_kana": "シャネル", "is_popular": False},
    {"brand_name": "BOTTEGA VENETA", "brand_name_kana": "ボッテガヴェネタ", "is_popular": False},
    {"brand_name": "LOEWE", "brand_name_kana": "ロエベ", "is_popular": False},
    {"brand_name": "GIVENCHY", "brand_name_kana": "ジバンシィ", "is_popular": False},
    {"brand_name": "VERSACE", "brand_name_kana": "ヴェルサーチ", "is_popular": False},
    {"brand_name": "MONCLER", "brand_name_kana": "モンクレール", "is_popular": False},
    # サングラス
    {"brand_name": "Ray-Ban", "brand_name_kana": "レイバン", "is_popular": True},
    {"brand_name": "A.D.S.R", "brand_name_kana": "エーディーエスアール", "is_popular": False},
    # その他
    {"brand_name": "FRED PERRY", "brand_name_kana": "フレッドペリー", "is_popular": True},
    {"brand_name": "Dr. Martens", "brand_name_kana": "ドクターマーチン", "is_popular": True},
    {"brand_name": "COMME des GARCONS", "brand_name_kana": "コムデギャルソン", "is_popular": False},
    {"brand_name": "YOHJI YAMAMOTO", "brand_name_kana": "ヨウジヤマモト", "is_popular": False},
    {"brand_name": "ISSEY MIYAKE", "brand_name_kana": "イッセイミヤケ", "is_popular": False},
    {"brand_name": "KENZO", "brand_name_kana": "ケンゾー", "is_popular": False},
    {"brand_name": "UNDERCOVER", "brand_name_kana": "アンダーカバー", "is_popular": False},
    {"brand_name": "WETTEMPT", "brand_name_kana": "ウィテンプト", "is_popular": False},
    {"brand_name": "SINSS", "brand_name_kana": "シンス", "is_popular": False},
    {"brand_name": "YOEL", "brand_name_kana": "ヨエル", "is_popular": False},
    {"brand_name": "soerte", "brand_name_kana": "ソエルテ", "is_popular": False},
    {"brand_name": "ONCILY", "brand_name_kana": "オンシェリー", "is_popular": False},
    {"brand_name": "RUUBON", "brand_name_kana": "ルーボン", "is_popular": False},
    {"brand_name": "Snap club", "brand_name_kana": "スナップクラブ", "is_popular": False},
    {"brand_name": "Perushu", "brand_name_kana": "ペルーシュ", "is_popular": False},
    {"brand_name": "WYM LIDNM", "brand_name_kana": "ウィム バイ リドム", "is_popular": False},
    {"brand_name": "MAISON SPECIAL", "brand_name_kana": "メゾンスペシャル", "is_popular": False},
    {"brand_name": "BROKEN BASE", "brand_name_kana": "ブロークンベース", "is_popular": False},
    {"brand_name": "O", "brand_name_kana": "オー", "is_popular": False},
    {"brand_name": "MASONPRINCE", "brand_name_kana": "メイソンプリンス", "is_popular": False},
    {"brand_name": "kutir", "brand_name_kana": "クティール", "is_popular": False},
    {"brand_name": "LMC", "brand_name_kana": "", "is_popular": False},
    {"brand_name": "WHO's WHO gallery", "brand_name_kana": "フーズフーギャラリー", "is_popular": False},
    {"brand_name": "Jieda", "brand_name_kana": "ジエダ", "is_popular": False},
    {"brand_name": "NEONSIGN", "brand_name_kana": "ネオンサイン", "is_popular": False},
]

# リストの初期化
fixtures = []
# ブランドデータのループ処理とfixturesの生成:
for i, brand in enumerate(brands, start=1):
    fixture = {"model": "fashion_items.brand", "pk": i, "fields": brand}
    fixtures.append(fixture)

# ファイルの保存先パスを指定
output_path = "apps/fashion_items/fixtures/initial_brand_data.json"

# fixturesデータのJSONファイルへの保存
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)

print("Fixtures file generated successfully!")
