const ActivityData = require("../../../shared/activity-data");

function cloneCard(card) {
  return {
    ...card.state,
    key: card.key,
    title: card.title,
    subtitle: card.subtitle,
    description: card.description,
    cta: card.cta,
    type: card.type,
  };
}

Page({
  data: {
    statusLabel: "手机活动页",
    toastVisible: false,
    toastTitle: "互动结果",
    toastBody: "模拟数据已更新",
    heroStats: ActivityData.heroStats,
    cards: ActivityData.cards.map(cloneCard),
  },

  onActionTap(e) {
    const index = Number(e.currentTarget.dataset.index);
    const cards = this.data.cards.slice();
    const card = { ...cards[index] };
    let toastTitle = card.title;
    let toastBody = "";

    if (card.type === "draw") {
      if (card.tries <= 0) {
        card.chip = "次数已用完，请明日再来";
        toastBody = "当前剩余次数为 0，无法继续抽卡。";
      } else {
        card.tries -= 1;
        card.luck += 7;
        card.chip = card.tries === 0 ? "抽到金卡，次数用完" : "抽到稀有卡，幸运值上升";
        toastBody = "你抽中 1 张稀有金卡，幸运值 +7。";
      }
    }

    if (card.type === "merge") {
      const [current, total] = card.progress.split("/").map(Number);
      if (current >= total) {
        card.chip = "当前进度已满，无需重复合成";
        toastBody = `当前福卡进度已满 ${current}/${total}。`;
      } else {
        const next = current + 1;
        card.progress = `${next}/${total}`;
        card.assist += 3;
        card.chip = next === total ? "合成完成，解锁稀有福卡" : `合成成功，进度 ${next}/${total}`;
        toastBody = `好友助力 +3，福卡进度已推进到 ${next}/${total}。`;
      }
    }

    if (card.type === "claim") {
      card.city = `${Number(String(card.city).replace(/\D/g, "")) + 1} 城`;
      card.score += 188;
      card.chip = "领取成功，点亮新城市";
      toastBody = "新增 1 座点亮城市，积分 +188。";
    }

    if (card.type === "spring") {
      card.days += 1;
      card.leaf += 2;
      card.chip = "签到成功，掉落 2 枚春日碎片";
      toastBody = "已完成今日签到，获得 2 枚活动碎片。";
    }

    if (card.type === "theme") {
      card.theme += 1;
      card.heat += 5;
      card.chip = "新主题上线，热度持续攀升";
      toastBody = "已开启新主题卡池，页面热度 +5。";
    }

    if (card.type === "task") {
      card.task += 1;
      card.pool += 2;
      card.chip = "完成任务，获得 1 次抽奖机会";
      toastBody = "任务完成，抽奖次数 +1，奖池热度继续提升。";
    }

    cards[index] = card;
    this.setData({
      cards,
      toastVisible: true,
      toastTitle,
      toastBody,
    });

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.setData({ toastVisible: false });
    }, 1800);
  },

  onUnload() {
    clearTimeout(this.toastTimer);
  },
});
