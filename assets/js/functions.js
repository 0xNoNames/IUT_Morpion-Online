function getColor() {
    var hue = (360 * Math.random()) / 360;
    var rgb = toRgb(hue);

    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

function hue2rgb(t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return 6 * t;
    if (t < 1 / 2) return 1;
    if (t < 2 / 3) return (2 / 3 - t) * 6;
    return 0;
}

function toRgb(hue) {
    return [hue2rgb(hue + 1 / 3), hue2rgb(hue), hue2rgb(hue - 1 / 3)];
}

function toHex(rgb) {
    const hex = Math.round(rgb * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function colorButton(alpha, color, index ) {
    return 'rgba(' + hexToRgb(color[index]).r + ',' + hexToRgb(color[index]).g + ',' + hexToRgb(color[index]).b + ',' + alpha + ')';
}