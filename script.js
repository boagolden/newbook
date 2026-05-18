const ActivityData = window.ActivityData || {
  heroStats: [],
  cards: [],
};

const animatedBlocks = document.querySelectorAll(".hero-stats article, .phone-card");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
  }
);

animatedBlocks.forEach((block, index) => {
  block.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  observer.observe(block);
});

const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastBody = document.getElementById("toastBody");

let toastTimer = null;

function showToast(title, body) {
  toastTitle.textContent = title;
  toastBody.textContent = body;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function pulseChip(chip) {
  chip.classList.add("is-updated");
  setTimeout(() => chip.classList.remove("is-updated"), 280);
}

const scenarios = {
  draw(card) {
    const tries = card.querySelector('[data-field="tries"]');
    const luck = card.querySelector('[data-field="luck"]');
    const chip = card.querySelector("[data-chip]");
    const currentTries = Number(tries.textContent);
    if (currentTries <= 0) {
      chip.textContent = "次数已用完，请明日再来";
      return "当前剩余次数为 0，无法继续抽卡。";
    }

    const nextTries = currentTries - 1;
    const nextLuck = Number(luck.textContent) + 7;
    tries.textContent = String(nextTries);
    luck.textContent = String(nextLuck);
    chip.textContent = nextTries === 0 ? "抽到金卡，次数用完" : "抽到稀有卡，幸运值上升";
    return "你抽中 1 张稀有金卡，幸运值 +7。";
  },
  merge(card) {
    const progress = card.querySelector('[data-field="progress"]');
    const assist = card.querySelector('[data-field="assist"]');
    const chip = card.querySelector("[data-chip]");
    const [current, total] = progress.textContent.split("/").map(Number);
    if (current >= total) {
      chip.textContent = "当前进度已满，无需重复合成";
      return `当前福卡进度已满 ${current}/${total}。`;
    }

    const next = Math.min(total, current + 1);
    progress.textContent = `${next}/${total}`;
    assist.textContent = String(Number(assist.textContent) + 3);
    chip.textContent = next === total ? "合成完成，解锁稀有福卡" : `合成成功，进度 ${next}/${total}`;
    return `好友助力 +3，福卡进度已推进到 ${next}/${total}。`;
  },
  claim(card) {
    const city = card.querySelector('[data-field="city"]');
    const score = card.querySelector('[data-field="score"]');
    const chip = card.querySelector("[data-chip]");
    const currentCity = Number(city.textContent);
    const nextCity = currentCity + 1;
    city.textContent = `${nextCity} 城`;
    score.textContent = String(Number(score.textContent) + 188);
    chip.textContent = "领取成功，点亮新城市";
    return `新增 1 座点亮城市，积分 +188。`;
  },
  spring(card) {
    const days = card.querySelector('[data-field="days"]');
    const leaf = card.querySelector('[data-field="leaf"]');
    const chip = card.querySelector("[data-chip]");
    days.textContent = String(Number(days.textContent) + 1);
    leaf.textContent = String(Number(leaf.textContent) + 2);
    chip.textContent = "签到成功，掉落 2 枚春日碎片";
    return "已完成今日签到，获得 2 枚活动碎片。";
  },
  theme(card) {
    const theme = card.querySelector('[data-field="theme"]');
    const heat = card.querySelector('[data-field="heat"]');
    const chip = card.querySelector("[data-chip]");
    theme.textContent = String(Number(theme.textContent) + 1);
    heat.textContent = String(Number(heat.textContent) + 5);
    chip.textContent = "新主题上线，热度持续攀升";
    return "已开启新主题卡池，页面热度 +5。";
  },
  task(card) {
    const task = card.querySelector('[data-field="task"]');
    const pool = card.querySelector('[data-field="pool"]');
    const chip = card.querySelector("[data-chip]");
    task.textContent = String(Number(task.textContent) + 1);
    pool.textContent = String(Number(pool.textContent) + 2);
    chip.textContent = "完成任务，获得 1 次抽奖机会";
    return "任务完成，抽奖次数 +1，奖池热度继续提升。";
  },
};

document.querySelectorAll(".action-button").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".phone-card");
    const chip = card.querySelector("[data-chip]");
    const scenario = scenarios[button.dataset.scenario];
    if (!scenario) return;

    const summary = scenario(card);
    pulseChip(chip);
    showToast(button.dataset.title, summary);
  });
});
