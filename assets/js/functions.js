function getColor() {
  h = (360 * Math.random()) / 360;
  s = 1;
  l = 0.5;
  let r,
    g,
    b;
  const hue2rgb = (p, q, t) => {
    if (t < 0)
      t += 1;
    if (t > 1)
      t -= 1;
    if (t < 1 / 6)
      return p + (q - p) * 6 * t;
    if (t < 1 / 2)
      return q;
    if (t < 2 / 3)
      return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ?
    l * (1 + s) :
    l + s - l * s;
  const p = 2 * l - q;
  r = hue2rgb(p, q, h + 1 / 3);
  g = hue2rgb(p, q, h);
  b = hue2rgb(p, q, h - 1 / 3);
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ?
      "0" + hex :
      hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function changeColor(array) {
  $.each(array, function (i, p) {
    if (i < array.length / 2) {
      array[i].color.value = color[0];
      array[i].color.rgb = hexToRgb(color[0]);
    } else {
      array[i].color.value = color[1];
      array[i].color.rgb = hexToRgb(color[1]);
    }
  });
}
