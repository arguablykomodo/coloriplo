const grid = document.getElementById("grid")!;

const width = 5;
const height = 5;

setProp(grid, "color-x1", "#f00");
setProp(grid, "color-x2", "#0f0");
setProp(grid, "color-y1", "#00f");
setProp(grid, "color-y2", "#fff");
setProp(grid, "width", width);
setProp(grid, "height", height);

let selected: HTMLElement | undefined;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const swatch = document.createElement("div");
    swatch.className = "swatch";
    setProp(swatch, "x", x / (width - 1));
    setProp(swatch, "color-x", x / (width - 1));
    setProp(swatch, "y", y / (height - 1));
    setProp(swatch, "color-y", y / (height - 1));
    swatch.addEventListener("click", () => {
      if (selected) {
        const x = parseFloat(getProp(swatch, "x"));
        const y = parseFloat(getProp(swatch, "y"));
        setProp(swatch, "x", getProp(selected, "x"));
        setProp(swatch, "y", getProp(selected, "y"));
        setProp(selected, "x", x);
        setProp(selected, "y", y);
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
  const tmp_x = getProp(a, "x");
  const tmp_y = getProp(a, "y");
  setProp(a, "x", getProp(b, "x"));
  setProp(a, "y", getProp(b, "y"));
  setProp(b, "x", tmp_x);
  setProp(b, "y", tmp_y);
}

function isSolved(): boolean {
  for (const swatch of Array.from(grid.children) as HTMLElement[]) {
    if (
      getProp(swatch, "x") !== getProp(swatch, "color-x") ||
      getProp(swatch, "y") !== getProp(swatch, "color-y")
    ) {
      return false;
    }
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
