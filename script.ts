const grid = document.getElementById("grid")!;

setProp(grid, "color-a", "red");
setProp(grid, "color-b", "blue");
setProp(grid, "len", 10);

let selected: HTMLElement | undefined;

const len = 10;
for (let x = 0; x < len; x++) {
  const swatch = document.createElement("div");
  swatch.className = "swatch";
  setProp(swatch, "x", x / (len - 1));
  setProp(swatch, "color-x", x / (len - 1));
  swatch.addEventListener("click", () => {
    if (selected) {
      const x = parseFloat(getProp(swatch, "x"));
      setProp(swatch, "x", getProp(selected, "x"));
      setProp(selected, "x", x);
      selected.classList.remove("selected");
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
  grid.appendChild(swatch);
}

for (let i = 0; i < grid.childElementCount - 1; i++) {
  const j = Math.floor(Math.random() * (grid.childElementCount - i) + i);
  const a = grid.children[i] as HTMLElement;
  const b = grid.children[j] as HTMLElement;
  const tmp = getProp(a, "x");
  setProp(a, "x", getProp(b, "x"));
  setProp(b, "x", tmp);
}

function isSolved(): boolean {
  for (const swatch of Array.from(grid.children) as HTMLElement[]) {
    if (getProp(swatch, "x") !== getProp(swatch, "color-x")) {
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
