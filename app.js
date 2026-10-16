const screens = {
  start: document.querySelector("#start-screen"),
  story: document.querySelector("#story-screen"),
  guide: document.querySelector("#guide-screen"),
  identity: document.querySelector("#identity-screen"),
  persona: document.querySelector("#persona-screen"),
  difficulty: document.querySelector("#difficulty-screen"),
  game: document.querySelector("#game-screen")
};

const storyChapters = [
  {
    heading: "大胤风云",
    text: "话说那大胤朝，自太祖立国以来，已历二百余载。如今朝纲不振，权臣当道，天子令不出京畿。朝堂式微，一时侠道大昌、群雄并起。\n\n武林之中，门派林立，恩怨纠缠。虽无一人灭城的仙家手段，却不乏绝顶高手，能以一敌百。江湖厮杀，多是小股交锋，讲究招式精妙、内力浑厚。"
  },
  {
    heading: "武林盟与魔教",
    text: "这江湖上，正邪不两立，势同水火。修邪道者聚为魔教，为与之对抗，正道门派结成联盟，由昆山掌门叶无咎统领，人谓“武林盟”。\n\n叶无咎豪气干云，嫉恶如仇，手中一柄“断云刀”曾连败七大门派掌门。只是盟中诸派表面同气连枝，暗里各怀心思。若非叶无咎威名镇着，早已四分五裂。\n\n与武林盟相比，魔教则组织严密，手段狠辣。教主之下，设左右二护法。右护法韩栎，年不及三旬，却已是江湖上令人闻风丧胆的人物。此人用兵如鬼、行事如魅，兼且心思狠毒，手中一柄“燕返剑”下，不知折了多少正道好手的性命。"
  },
  {
    heading: "孤鸿神剑",
    text: "说到韩栋，便不得不提他的师父——鹤音。鹤音，凤还山主，人称“孤鸿神剑”，正是当今武林的第一。此人身世如谜，剑法通神，曾于泰山之巅一剑破十二连环坞总舵主的“天罗地网”，自此名震天下。\n\n只是此人孤高矜冷，不近人情。有人赞他清高，有人斥他冷漠——他人言语，他从不着心。"
  },
  {
    heading: "师门旧事",
    text: "而你，便是鹤音座下最小的弟子。\n\n你自幼拜入凤还，年岁尚小，武功未深。师父对你虽不假辞色，你心里却知道他待你实在是好。\n\n这样一算，韩栎是你的师兄，然而你们却不算亲近。此人少年时便阴鸷，后来叛出师门转投魔教，似也并非不可预料。\n\n韩栎这样的弟子，真可谓有玷师门。传闻日前其人于青蒲镇设宴，以镇中百姓为胁邀孤鸿剑赴会。孤鸿神剑此去，定要清理门户——谁人不这般信誓旦旦？"
  },
  {
    heading: "正阳殿盟会",
    text: "今日盟会，正是为一件大事——孤鸿剑为魔教所俘。消息传开，江湖震动。武林盟连夜召集各派掌门，于昆山正阳殿会盟，明里说是商讨营救之事，可你心里清楚，这场盟会恐怕更像是清算。\n\n师父被俘，元凶是你师兄。你若不站出来说话，还有谁能为师父辩白？正阳殿近在眼前，你深吸一口气，迈步向前。"
  }
];

const helpText = {
  identity: {
    title: "昵称编辑说明",
    body: "这是姓名填写系统，四项都需要填写。姓氏与名字组成你的本名；昵称是亲近的人对你的称呼；名号则是你在江湖上所用的代称。"
  },
  persona: {
    title: "人设自定义说明",
    body: "身份“孤鸿剑弟子”为固定设定，不需要填写。你可以在人设描述中补充性格、爱好、行事习惯、说话方式等信息。"
  },
  difficulty: {
    title: "难度自定义说明",
    body: "简单：提示更多，失败惩罚较轻。\n\n普通：规则标准，兼顾探索与挑战。\n\n困难：提示较少，资源管理更严格。"
  }
};

let chapterIndex = 0;
let selectedDifficulty = "普通";
let player = { surname: "", givenName: "", nickname: "", title: "", persona: "", difficulty: "普通" };
let chatHistory = [];

function showScreen(name) {
  Object.entries(screens).forEach(([key, element]) => {
    element.hidden = key !== name;
  });
  document.querySelector("#menu-panel").hidden = true;
  document.querySelector("#shortcut-panel").hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2200);
}

function updateSaveIndicator(text) {
  document.querySelector("#save-indicator").textContent = text;
}

function renderChapter() {
  const chapter = storyChapters[chapterIndex];
  document.querySelector("#story-heading").textContent = chapter.heading;
  const container = document.querySelector("#story-copy");
  container.replaceChildren();
  chapter.text.split("\n\n").forEach(part => {
    const p = document.createElement("p");
    p.textContent = part;
    container.append(p);
  });
  document.querySelector("#story-progress").textContent =
    `${String(chapterIndex + 1).padStart(2, "0")} / ${String(storyChapters.length).padStart(2, "0")}`;
  document.querySelector("#story-next").textContent =
    chapterIndex === storyChapters.length - 1 ? "继续创建角色" : "继续";
}

function startNewGame() {
  chapterIndex = 0;
  renderChapter();
  showScreen("story");
}

document.querySelectorAll("[data-start]").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.start;
    if (action === "new") {
      startNewGame();
    } else if (action === "continue") {
      loadGame();
    } else if (action === "quick") {
      openModal("快捷通道", "快捷通道可在进入游戏后使用。目前请先创建角色，之后即可从主界面快速查看状态、任务与背包。");
    } else {
      openModal("江湖志", "江湖志记录你在武林中的经历。开始新游戏后，剧情记录会随你的选择逐步累积。");
    }
  });
});

document.querySelector("#story-next").addEventListener("click", () => {
  if (chapterIndex < storyChapters.length - 1) {
    chapterIndex += 1;
    renderChapter();
  } else {
    document.querySelector("#guide-copy").textContent =
      "“这位少侠，可是来赴盟会的？近日江湖纷扰，各派同道齐聚正阳殿。凡入殿者需先行登记名姓来历，还请少侠随我来。”";
    showScreen("guide");
  }
});
document.querySelector("#story-back").addEventListener("click", () => {
  if (chapterIndex > 0) {
    chapterIndex -= 1;
    renderChapter();
  } else {
    showScreen("start");
  }
});
document.querySelector("#guide-next").addEventListener("click", () => showScreen("identity"));

document.querySelector("#identity-form").addEventListener("submit", event => {
  event.preventDefault();
  player.surname = document.querySelector("#surname").value.trim();
  player.givenName = document.querySelector("#given-name").value.trim();
  player.nickname = document.querySelector("#nickname").value.trim();
  player.title = document.querySelector("#title-name").value.trim();
  if (![player.surname, player.givenName, player.nickname, player.title].every(Boolean)) {
    showToast("请填写完整的姓名信息。");
    return;
  }
  showScreen("persona");
});

document.querySelector("#persona-next").addEventListener("click", () => {
  player.persona = document.querySelector("#persona").value.trim();
  showScreen("difficulty");
});

document.querySelectorAll("[data-difficulty]").forEach(button => {
  button.addEventListener("click", () => {
    selectedDifficulty = button.dataset.difficulty;
    document.querySelectorAll("[data-difficulty]").forEach(item => {
      item.classList.toggle("selected", item === button);
    });
  });
});

document.querySelector("#difficulty-next").addEventListener("click", () => {
  player.difficulty = selectedDifficulty;
  beginGame();
});

function beginGame() {
  chatHistory = [];
  const fullName = `${player.surname}${player.givenName}`;
  document.querySelector("#player-heading").textContent = `${player.nickname}（${fullName}）`;
  document.querySelector("#player-subtitle").textContent = `${player.title} · 孤鸿剑弟子 · ${player.difficulty}`;
  const log = document.querySelector("#conversation-log");
  log.replaceChildren();
  addMessage("旁白", "山雨欲来，昆山之巅云雾翻涌。正阳殿外，各派弟子三三两两聚在廊下。一个青衣侍者向你走来，拱手道：“这位少侠，可是来赴盟会的？”", "ai");
  updateSaveIndicator("游戏进行中");
  saveGame(false);
  showScreen("game");
}

function addMessage(role, text, kind = "ai") {
  const article = document.createElement("article");
  article.className = `message ${kind === "player" ? "player-message" : "ai-message"}`;
  const tag = document.createElement("span");
  tag.className = "message-tag";
  tag.textContent = role;
  const p = document.createElement("p");
  p.textContent = text;
  article.append(tag, p);
  document.querySelector("#conversation-log").append(article);
  document.querySelector("#conversation-log").scrollTop =
    document.querySelector("#conversation-log").scrollHeight;
  chatHistory.push({ role, text, kind, time: new Date().toISOString() });
}

function mockResponse(action) {
  const normalized = action.trim();
  if (/查看周围|看看周围|观察/.test(normalized)) {
    return "你环顾四周：廊下有几名各派弟子低声交谈，石阶上留着新鲜的泥痕。青衣侍者仍在等候，正阳殿的大门半开着。";
  }
  if (/查看状态|状态/.test(normalized)) {
    return `姓名：${player.surname}${player.givenName}\n昵称：${player.nickname}\n名号：${player.title}\n身份：孤鸿剑弟子\n难度：${player.difficulty}`;
  }
  if (/查看任务|任务/.test(normalized)) {
    return "当前主线：进入正阳殿参加武林盟会。\n待办：向青衣侍者登记身份，了解师父被俘一事的最新消息。";
  }
  if (/查看背包|背包/.test(normalized)) {
    return "背包暂为空。你尚未获得额外道具。";
  }
  if (/休息/.test(normalized)) {
    return "你在廊下稍作休息，凝神调息片刻，心绪渐渐平稳。";
  }
  return `你决定“${normalized}”。青衣侍者听完你的话，神色微动，侧身为你让开一条路：“既然少侠心意已决，请随我入殿。里面诸位同道，正等着一个说法。”\n\n（当前为交互原型模拟回复；接入 AI 接口后，这里将由模型根据剧情与人设生成内容。）`;
}

async function sendAction(text) {
  const action = text.trim();
  if (!action) return;
  addMessage(player.nickname || "你", action, "player");
  document.querySelector("#chat-input").value = "";
  // 当前先运行本地模拟逻辑，避免未配置后端时无法体验原型。
  await new Promise(resolve => setTimeout(resolve, 250));
  addMessage("旁白", mockResponse(action), "ai");
  saveGame(false);
}

document.querySelector("#chat-form").addEventListener("submit", event => {
  event.preventDefault();
  sendAction(document.querySelector("#chat-input").value);
});
document.querySelector("#chat-input").addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    document.querySelector("#chat-form").requestSubmit();
  }
});
document.querySelectorAll("[data-action]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector("#shortcut-panel").hidden = true;
    sendAction(button.dataset.action);
  });
});

document.querySelector("#open-shortcuts").addEventListener("click", () => {
  document.querySelector("#shortcut-panel").hidden = false;
  document.querySelector("#menu-panel").hidden = true;
});
document.querySelector("#close-shortcuts").addEventListener("click", () => {
  document.querySelector("#shortcut-panel").hidden = true;
});
document.querySelector("#menu-toggle").addEventListener("click", () => {
  document.querySelector("#menu-panel").hidden = !document.querySelector("#menu-panel").hidden;
  document.querySelector("#shortcut-panel").hidden = true;
});
document.querySelectorAll("[data-menu]").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.menu;
    document.querySelector("#menu-panel").hidden = true;
    if (action === "profile") {
      openModal("人物设定", `姓名：${player.surname}${player.givenName}\n昵称：${player.nickname}\n名号：${player.title}\n身份：孤鸿剑弟子\n人设描述：${player.persona || "暂无"}\n难度：${player.difficulty}`);
    } else if (action === "journal") {
      openModal("江湖志", chatHistory.length ? chatHistory.map(item => `${item.role}：${item.text}`).join("\n\n") : "暂无记录。");
    } else if (action === "save") {
      saveGame(true);
    } else {
      if (confirm("重新开始将清除当前本地进度，确定继续吗？")) {
        localStorage.removeItem("jianghu-prototype-save");
        showScreen("start");
        updateSaveIndicator("未开始");
      }
    }
  });
});

function saveGame(showNotice = true) {
  const data = { player, selectedDifficulty, chapterIndex, chatHistory, savedAt: new Date().toISOString() };
  try {
    localStorage.setItem("jianghu-prototype-save", JSON.stringify(data));
    updateSaveIndicator("已保存至本机");
    if (showNotice) showToast("进度已保存到当前浏览器。");
  } catch (error) {
    updateSaveIndicator("保存失败");
    if (showNotice) showToast("保存失败，请检查浏览器存储设置。");
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem("jianghu-prototype-save");
    if (!raw) {
      showToast("暂时没有可继续的本地存档。");
      return;
    }
    const data = JSON.parse(raw);
    player = data.player || player;
    selectedDifficulty = data.selectedDifficulty || player.difficulty || "普通";
    chatHistory = data.chatHistory || [];
    document.querySelector("#surname").value = player.surname || "";
    document.querySelector("#given-name").value = player.givenName || "";
    document.querySelector("#nickname").value = player.nickname || "";
    document.querySelector("#title-name").value = player.title || "";
    document.querySelector("#persona").value = player.persona || "";
    document.querySelectorAll("[data-difficulty]").forEach(item => {
      item.classList.toggle("selected", item.dataset.difficulty === selectedDifficulty);
    });
    const log = document.querySelector("#conversation-log");
    log.replaceChildren();
    const savedHistory = [...chatHistory];
    if (savedHistory.length) {
      savedHistory.forEach(item => {
        const article = document.createElement("article");
        article.className = `message ${item.kind === "player" ? "player-message" : "ai-message"}`;
        const tag = document.createElement("span");
        tag.className = "message-tag";
        tag.textContent = item.role;
        const p = document.createElement("p");
        p.textContent = item.text;
        article.append(tag, p);
        log.append(article);
      });
      chatHistory = savedHistory;
    } else {
      addMessage("旁白", "你重新回到正阳殿外。青衣侍者仍在廊下等候。", "ai");
    }
    document.querySelector("#player-heading").textContent = `${player.nickname}（${player.surname}${player.givenName}）`;
    document.querySelector("#player-subtitle").textContent = `${player.title} · 孤鸿剑弟子 · ${player.difficulty}`;
    updateSaveIndicator("已读取存档");
    showScreen("game");
    showToast("已读取本地存档。");
  } catch (error) {
    showToast("存档读取失败，可能是存档内容损坏。");
  }
}

function openModal(title, body) {
  document.querySelector("#modal-title").textContent = title;
  const content = document.querySelector("#modal-content");
  content.replaceChildren();
  body.split("\n").forEach(line => {
    const p = document.createElement("p");
    p.textContent = line || " ";
    content.append(p);
  });
  document.querySelector("#modal-backdrop").hidden = false;
}
function closeModal() {
  document.querySelector("#modal-backdrop").hidden = true;
}
document.querySelectorAll("[data-help]").forEach(button => {
  button.addEventListener("click", () => {
    const help = helpText[button.dataset.help];
    openModal(help.title, help.body);
  });
});
document.querySelector("#modal-close").addEventListener("click", closeModal);
document.querySelector("#modal-confirm").addEventListener("click", closeModal);
document.querySelector("#modal-backdrop").addEventListener("click", event => {
  if (event.target.id === "modal-backdrop") closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});
