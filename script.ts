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
const controls = document.getElementById("controls") as HTMLFormElement;
const randomize = document.getElementById("randomize") as HTMLButtonElement;

randomize.addEventListener("click", (e) => {
  e.preventDefault();
  const elements = controls.elements as ControlElements;
  const h = Math.random() * 360;
  const s = () => (Math.random() * 0.5 + 0.5) * 100 + "%";
  const l = () => (Math.random() * 0.2 + 0.5) * 100 + "%";
  elements.colorA.value = `hsl(${h - rand(10, 40)}deg ${s()} ${l()})`;
  elements.colorB.value = `hsl(${h + rand(10, 40)}deg ${s()} ${l()})`;
  elements.colorC.value = `hsl(${h - rand(50, 90)}deg ${s()} ${l()})`;
  elements.colorD.value = `hsl(${h + rand(50, 90)}deg ${s()} ${l()})`;
});

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

controls.addEventListener("submit", (e) => {
  e.preventDefault();
  const elements = controls.elements as ControlElements;
  setup(
    parseInt(elements.width.value),
    parseInt(elements.height.value),
    elements.colorA.value,
    elements.colorB.value,
    elements.colorC.value,
    elements.colorD.value,
    elements.pinned.value as PinnedTypes,
  );
});

function setup(
  width: number,
  height: number,
  colorA: string,
  colorB: string,
  colorC: string,
  colorD: string,
  pinned: PinnedTypes,
) {
  grid.innerHTML = "";
  setProp(grid, "width", width);
  setProp(grid, "height", height);
  setProp(grid, "color-a", colorA);
  setProp(grid, "color-b", colorB);
  setProp(grid, "color-c", colorC);
  setProp(grid, "color-d", colorD);

  let selected: HTMLElement | undefined;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const swatch = document.createElement("div");
      swatch.className = "swatch";
      setProp(swatch, "x", x / (width - 1));
      setProp(swatch, "color-x", x / (width - 1));
      setProp(swatch, "y", y / (height - 1));
      setProp(swatch, "color-y", y / (height - 1));
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
            const win = document.createElement("h1");
            win.textContent = "WIN!!!";
            document.body.appendChild(win);
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
