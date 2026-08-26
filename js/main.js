/* ============ 作品数据 ============
   文件名与「作品集」文件夹内实际文件一致。
   type: "image" | "video"
   如需添加/删除作品，直接修改对应数组即可。 */

const WORKS = [
  {
    category: "c4d",
    label: "C4D",
    items: [
      { type: "image", src: "c4d/朱宏宇.jpg", title: "作品 01" },
      { type: "image", src: "c4d/朱宏宇4.jpg", title: "作品 02" },
      { type: "video", src: "c4d/zhu.mp4", title: "作品 03" },
      { type: "video", src: "c4d/朱宏宇.mp4", title: "作品 04" },
      { type: "video", src: "c4d/朱宏宇3.mp4", title: "作品 05" },
      { type: "video", src: "c4d/朱宏宇5.mp4", title: "作品 06" },
      { type: "image", src: "c4d/7.jpg", title: "作品 07" },
      { type: "image", src: "c4d/朱宏宇2.jpg", title: "作品 08" },
      { type: "image", src: "c4d/朱宏宇3.jpg", title: "作品 09" },
      { type: "video", src: "c4d/朱宏宇2.mp4", title: "作品 10" }
    ]
  },
  {
    category: "zbrush",
    label: "ZBrush",
    items: [
      { type: "image", src: "zbrush/6.jpg", title: "作品 01" },
      { type: "image", src: "zbrush/朱宏宇.jpg", title: "作品 02" },
      { type: "image", src: "zbrush/朱宏宇1.jpg", title: "作品 03" },
      { type: "image", src: "zbrush/朱宏宇2.jpg", title: "作品 04" },
      { type: "image", src: "zbrush/朱宏宇3.jpg", title: "作品 05" },
      { type: "image", src: "zbrush/朱宏宇4.jpg", title: "作品 06" },
      { type: "image", src: "zbrush/朱宏宇5.jpg", title: "作品 07" },
      { type: "image", src: "zbrush/朱宏宇7.jpg", title: "作品 08" }
    ]
  },
  {
    category: "3dsmax",
    label: "3ds Max",
    items: [
      { type: "image", src: "3ds max/1.jpg", title: "作品 01" },
      { type: "image", src: "3ds max/朱宏宇2.jpg", title: "作品 02" },
      { type: "image", src: "3ds max/朱宏宇3.jpg", title: "作品 03" },
      { type: "image", src: "3ds max/朱宏宇4.jpg", title: "作品 04" },
      { type: "image", src: "3ds max/朱宏宇5.jpg", title: "作品 05" },
      { type: "image", src: "3ds max/朱宏宇6.jpg", title: "作品 06" }
    ]
  },
  {
    category: "maya",
    label: "Maya",
    items: [
      { type: "image", src: "maya/2.jpg", title: "作品 01" },
      { type: "image", src: "maya/ZBrush Document.jpg", title: "作品 02" },
      { type: "image", src: "maya/朱 宏宇.jpg", title: "作品 03" },
      { type: "image", src: "maya/朱宏宇5.jpg", title: "作品 04" }
    ]
  }
];

/* ============ 扁平化列表（用于灯箱左右切换） ============ */
const allItems = [];
let itemIndex = 0;

function encodeSrc(p) {
  return encodeURI(p);
}

/* ============ 渲染作品网格 ============ */
function renderWorks() {
  WORKS.forEach((section) => {
    const grid = document.querySelector(`.grid[data-category="${section.category}"]`);
    if (!grid) return;

    section.items.forEach((item, i) => {
      const idx = allItems.length;
      allItems.push({ ...item, category: section.category, label: section.label });

      const card = document.createElement("figure");
      card.className = "card";
      card.dataset.index = idx;
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${section.label} · ${item.title}`);

      const media = document.createElement("div");
      media.className = "media";

      if (item.type === "video") {
        const v = document.createElement("video");
        v.src = encodeSrc(item.src);
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.preload = "metadata";
        media.appendChild(v);

        const badge = document.createElement("span");
        badge.className = "play-badge";
        card.appendChild(badge);
      } else {
        const img = document.createElement("img");
        img.src = encodeSrc(item.src);
        img.alt = `${section.label} ${item.title}`;
        img.loading = "lazy";
        media.appendChild(img);
      }

      const cap = document.createElement("figcaption");
      cap.innerHTML =
        `<span class="title">${item.title}</span>` +
        `<span class="cat">${section.label}</span>`;

      card.appendChild(media);
      card.appendChild(cap);
      grid.appendChild(card);
    });
  });
}

/* ============ 视频悬停播放（仅支持 hover 的设备） ============ */
function handleVideoHover() {
  if (!window.matchMedia("(hover: hover)").matches) return;
  document.addEventListener("mouseover", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const v = card.querySelector("video");
    if (v) v.play().catch(() => {});
  });
  document.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const v = card.querySelector("video");
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  });
}

/* ============ 灯箱 ============ */
const lightbox = document.getElementById("lightbox");
const lbStage = document.getElementById("lb-stage");
const lbCaption = document.getElementById("lb-caption");

function openLightbox(index) {
  itemIndex = index;
  renderLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lbStage.innerHTML = "";
}

function renderLightbox() {
  const item = allItems[itemIndex];
  if (!item) return;
  lbStage.innerHTML = "";

  if (item.type === "video") {
    const v = document.createElement("video");
    v.src = encodeSrc(item.src);
    v.controls = true;
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    lbStage.appendChild(v);
  } else {
    const img = document.createElement("img");
    img.src = encodeSrc(item.src);
    img.alt = `${item.label} ${item.title}`;
    lbStage.appendChild(img);
  }
  lbCaption.textContent = `${item.label} · ${item.title}`;
}

function stepLightbox(dir) {
  itemIndex = (itemIndex + dir + allItems.length) % allItems.length;
  renderLightbox();
}

function bindLightbox() {
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openLightbox(Number(card.dataset.index));
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") stepLightbox(-1);
    else if (e.key === "ArrowRight") stepLightbox(1);
  });
  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lb-next").addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

/* ============ 滚动出现动画 ============ */
function bindReveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* ============ 灯箱滑动切换（移动端） ============ */
function bindLightboxSwipe() {
  let startX = 0;
  let startY = 0;
  let isVideo = false;
  lightbox.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
    isVideo = !!e.target.closest("video");
  }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (isVideo) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      stepLightbox(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}

/* ============ 移动端菜单 ============ */
function bindNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============ 初始化 ============ */
document.addEventListener("DOMContentLoaded", () => {
  renderWorks();
  bindLightbox();
  bindLightboxSwipe();
  handleVideoHover();
  bindReveal();
  bindNav();
});
