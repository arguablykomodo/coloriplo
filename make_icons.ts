import { Resvg } from "@resvg/resvg-js";

const icon = await Bun.file("./icon.svg").text();
for (const size of [192, 512]) {
  const resvg = new Resvg(icon, { fitTo: { mode: "width", value: size } });
  const png = resvg.render().asPng();
  await Bun.write(`_site/icon_${size}.png`, png);
}
