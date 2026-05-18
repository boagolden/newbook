const ActivityData = {
  heroStats: [
    { value: "06", label: "精选案例模块" },
    { value: "3s", label: "首屏强记忆点" },
    { value: "Neo", label: "糖果光感视觉" },
  ],
  cards: [
    {
      key: "draw",
      title: "快乐集卡",
      subtitle: "618 Campaign",
      description: "盲盒抽卡、签到加速、大奖触发，强化活动节奏和按钮冲动感。",
      cta: "立即抽卡",
      state: { tries: 3, luck: 68, chip: "等待抽卡" },
      type: "draw",
    },
    {
      key: "merge",
      title: "五福和 TA 的朋友们",
      subtitle: "Festival Series",
      description: "漂浮卡面、角色插画和高亮按钮，适合春节、周年庆和品牌联动玩法。",
      cta: "合成稀有卡",
      state: { progress: "2/5", assist: 12, chip: "待合成" },
      type: "merge",
    },
    {
      key: "claim",
      title: "月色欢钥 · 城市集章",
      subtitle: "Moonlight Event",
      description: "结合地域切换、景点卡册和积分兑换，适用于文旅、会员体系和联名任务。",
      cta: "1 积分领取",
      state: { city: "4 城", score: 1260, chip: "待领取" },
      type: "claim",
    },
    {
      key: "spring",
      title: "春场玩节",
      subtitle: "Travel Festival",
      description: "用自然渐变和呼吸感光晕降低营销压迫感，适合季节性专题。",
      cta: "立即抽卡",
      state: { days: 5, leaf: 9, chip: "待解锁" },
      type: "spring",
    },
    {
      key: "theme",
      title: "更多主题 数造相待",
      subtitle: "Daily Task",
      description: "主角插画加卡牌飞散，让任务系统更有情绪价值和收藏驱动力。",
      cta: "开启主题集卡",
      state: { theme: 8, heat: 89, chip: "未开启" },
      type: "theme",
    },
    {
      key: "task",
      title: "集卡瓜分千万",
      subtitle: "Petal Lucky Draw",
      description: "适合低学习成本但高传播效率的活动页，强调任务与奖池的即时反馈。",
      cta: "做任务得次数",
      state: { task: 2, pool: 91, chip: "待完成" },
      type: "task",
    },
  ],
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ActivityData;
}

if (typeof window !== "undefined") {
  window.ActivityData = ActivityData;
}
