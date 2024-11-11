/* ----------------------------------------------------------------
生年月日から世代を計算する関数（〇〇s）
------------------------------------------------------------------ */
export const calculateAge = (birthDate: string | null | undefined): string | null => {
  if (!birthDate) return null;
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  const age = today.getFullYear() - birthDateObj.getFullYear();
  return `${Math.floor(age / 10) * 10}'s`;
};

/* ----------------------------------------------------------------
生年月日生成
------------------------------------------------------------------ */
// 年の選択肢を生成する関数
export const generateYearOptions = (startYear: number, endYear: number) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => ({
    id: `${endYear - index}`, // 年は2桁にパディングする必要なし
    name: `${endYear - index}年`,
  }));
};

// 月の選択肢を生成する関数
export const generateMonthOptions = () => {
  return Array.from({ length: 12 }, (_, index) => {
    const month = (index + 1).toString().padStart(2, '0'); // 2桁にパディング
    return {
      id: month, // idを2桁形式で保存
      name: `${parseInt(month)}月`, // 表示用は1桁に戻す
    };
  });
};

// 日の選択肢を生成する関数（年と月に基づいて）
export const generateDayOptions = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = (index + 1).toString().padStart(2, '0'); // 2桁にパディング
    return {
      id: day, // idを2桁形式で保存
      name: `${parseInt(day)}日`, // 表示用は1桁に戻す
    };
  });
};
