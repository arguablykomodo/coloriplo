import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";
import { confetti, type ConfettiOptions } from "@tsparticles/confetti";

Coloris.init();
Coloris({
  el: "input[type=color]",
  theme: "polaroid",
  wrap: false,
  themeMode: "auto",
  alpha: false,
});

for (const el of Array.from(document.querySelectorAll("input[type=color]"))) {
  el.addEventListener("click", (e) => e.preventDefault());
}

type PinnedTypes = "none" | "corners" | "border";
interface ControlElements extends HTMLFormControlsCollection {
  width: HTMLInputElement;
  height: HTMLInputElement;
  colorA: HTMLInputElement;
  colorB: HTMLInputElement;
  colorC: HTMLInputElement;
  colorD: HTMLInputElement;
  pinned: HTMLSelectElement;
}

const grid = document.getElementById("grid")!;
const controls = document.getElementById("controls") as HTMLDetailsElement;
const form = document.forms[0] as HTMLFormElement;
const randomizeBtn = document.getElementById("randomize") as HTMLButtonElement;
const win = document.getElementById("win") as HTMLHeadingElement;
const installBtn = document.getElementById("install") as HTMLButtonElement;

window.addEventListener("beforeinstallprompt", (promptEvent) => {
  promptEvent.preventDefault();
  installBtn.hidden = false;
  installBtn.addEventListener("click", (btnEvent) => {
    btnEvent.preventDefault();
    promptEvent.prompt();
  });
});

randomizeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  randomize();
});

function randomize() {
  const elements = form.elements as ControlElements;
  const h = Math.random() * 360;
  const s = () => (Math.random() * 0.5 + 0.5);
  const l = () => (Math.random() * 0.2 + 0.5);
  elements.colorA.value = hslToHex(h - rand(10, 40), s(), l());
  elements.colorB.value = hslToHex(h + rand(10, 40), s(), l());
  elements.colorC.value = hslToHex(h - rand(50, 90), s(), l());
  elements.colorD.value = hslToHex(h + rand(50, 90), s(), l());
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function hslToHex(h: number, s: number, l: number): string {
  const h2 = (h + 360) % 360;
  const f = (n: number) => {
    const k = (n + h2 / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.floor(v * 0xFF).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  setup();
  controls.open = false;
});

randomize();
setup();

function setup() {
  win.style.display = "none";
  const elements = form.elements as ControlElements;
  const width = parseInt(elements.width.value);
  const height = parseInt(elements.height.value);
  const pinned = elements.pinned.value as PinnedTypes;

  grid.innerHTML = "";
  setProp(grid, "width", width);
  setProp(grid, "height", height);
  setProp(grid, "color-a", elements.colorA.value);
  setProp(grid, "color-b", elements.colorB.value);
  setProp(grid, "color-c", elements.colorC.value);
  setProp(grid, "color-d", elements.colorD.value);

  let selected: HTMLElement | undefined;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const swatch = document.createElement("div");
      swatch.className = "swatch";
      setProp(swatch, "x", x);
      setProp(swatch, "color-x", x);
      setProp(swatch, "y", y);
      setProp(swatch, "color-y", y);
      let isPinned = false;
      switch (pinned) {
        case "none":
          break;
        case "corners":
          if (x == 0 && y == 0) isPinned = true;
          else if (x == width - 1 && y == 0) isPinned = true;
          else if (x == 0 && y == height - 1) isPinned = true;
          else if (x == width - 1 && y == height - 1) isPinned = true;
          break;
        case "border":
          if (x == 0) isPinned = true;
          else if (x == width - 1) isPinned = true;
          else if (y == 0) isPinned = true;
          else if (y == height - 1) isPinned = true;
          break;
      }
      if (isPinned) swatch.classList.add("pinned");
      swatch.addEventListener("click", () => {
        if (swatch.classList.contains("pinned")) return;
        if (selected) {
          swap(selected, swatch);
          selected.classList.remove("selected");
          selected.classList.add("moving");
          swatch.classList.add("moving");
          selected = undefined;
          if (isSolved()) {
            win.style.display = "block";
            controls.open = true;
            const common: ConfettiOptions = {
              disableForReducedMotion: true,
              zIndex: 300,
              particleCount: 100,
              spread: 70,
              colors: [
                elements.colorA.value,
                elements.colorB.value,
                elements.colorC.value,
                elements.colorD.value,
              ],
            };
            confetti({ ...common, angle: 45, origin: { x: 0, y: 0.6 } });
            confetti({ ...common, angle: 135, origin: { x: 1, y: 0.6 } });
          }
        } else {
          swatch.classList.add("selected");
          selected = swatch;
        }
      });
      swatch.addEventListener("transitionend", () => {
        swatch.classList.remove("moving");
      });
      grid.appendChild(swatch);
    }
  }

  for (let i = 0; i < grid.childElementCount - 1; i++) {
    const j = Math.floor(Math.random() * (grid.childElementCount - i) + i);
    const a = grid.children[i] as HTMLElement;
    const b = grid.children[j] as HTMLElement;
    if (a.classList.contains("pinned") || b.classList.contains("pinned")) {
      continue;
    }
    swap(a, b);
  }
}

function swap(a: HTMLElement, b: HTMLElement) {
  const x = parseFloat(getProp(a, "x"));
  const y = parseFloat(getProp(a, "y"));
  setProp(a, "x", getProp(b, "x"));
  setProp(a, "y", getProp(b, "y"));
  setProp(b, "x", x);
  setProp(b, "y", y);
}

function isSolved(): boolean {
  for (const swatch of Array.from(grid.children) as HTMLElement[]) {
    if (
      getProp(swatch, "x") !== getProp(swatch, "color-x") ||
      getProp(swatch, "y") !== getProp(swatch, "color-y")
    ) return false;
  }
  return true;
}

function setProp(el: HTMLElement, name: string, val: number | string) {
  val = typeof val === "number" ? val.toString(10) : val;
  el.style.setProperty(`--${name}`, val);
}

function getProp(el: HTMLElement, name: string): string {
  return el.style.getPropertyValue(`--${name}`);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(console.error);
}
