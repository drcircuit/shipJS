/**
 * Created by Espen on 2/13/2016.
 */

(function () {
    var width = window.innerWidth;

    var height = window.innerHeight;

    var escapeBoundary = 20;
    var squaredBoundary = escapeBoundary * escapeBoundary;
    var ymax = 0.5;
    var ymin = -1.5;
    var xmax = 1.5;
    var xmin = -2.5;

    var canvas = document.getElementById('fractal');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    var scanline = context.createImageData(width, 1);

    function goMandelGo(x, y, maxit) {
        var i = 0;
        var znorm = 0;
        var cr = x;
        var ci = y;
        var zr = 0.0;
        var zi = 0.0;

        //z = z ^ 2 + c
        //x*x2 + (x*y2 + y*x2) + y*y2 * -1
        //x + x2 y + y22

        while (i < maxit && znorm <= squaredBoundary) {
            // quicker way :)
            var zr2 = zr * zr - zi * zi + cr;
            zi = 2 * Math.abs(zr * zi) + ci;
            znorm = zr * zr + zi * zi;
            zr = zr2;
            i++;
        }

        return {
            n: i,
            r: zr,
            i: zi,
            z: znorm
        };
    }

    function getColor(n, di, zr, zi) {
        if (n === di) {
            return {
                r: 255,
                g: 255,
                b: 255,
                a: 255
            };
        }
        var hue = di + 1 - Math.log(Math.log(Math.sqrt(zr * zr + zi * zi))/ Math.log(2));
        return hsv2rgb( 360 * Math.log(hue)/n, 1,10*hue/n);
    }

    function hsv2rgb(h, s, v) {
        if (v > 1.0) {
            v = 1.0;
        }
        var hp = h / 60.0;
        var c = v * s;
        var x = c * (1 - Math.abs((hp % 2) - 1));
        var rgb = [0, 0, 0];

        if (0 <= hp && hp < 1) {
            rgb = [c, x, 0];
        }
        if (1 <= hp && hp < 2) {
            rgb = [x, c, 0];
        }
        if (2 <= hp && hp < 3) {
            rgb = [0, c, x];
        }
        if (3 <= hp && hp < 4) {
            rgb = [0, x, c];
        }
        if (4 <= hp && hp < 5) {
            rgb = [x, 0, c];
        }
        if (5 <= hp && hp < 6) {
            rgb = [c, 0, x];
        }

        var m = v - c;
        rgb[0] += m;
        rgb[1] += m;
        rgb[2] += m;

        rgb[0] *= 255;
        rgb[1] *= 255;
        rgb[2] *= 255;
        return {
            r: rgb[0] > 255 ? 255:rgb[0],
            g: rgb[1]> 255 ? 255:rgb[1],
            b: rgb[2]> 255 ? 255:rgb[2],
            a: 255
        };
    }

    function getX(xp) {
        // mapping x to the complex plane;
        return xmin + (xmax - xmin) * parseFloat(xp) / (width);
    }

    function getY(yp) {
        // mapping y to the complex plane;
        return ymin + (ymax - ymin) * parseFloat(yp) / (height);
    }

    function drawPixel(xp, color) {
        var offset = xp << 2;
        scanline.data[offset] = color.r;
        scanline.data[offset + 1] = color.b;
        scanline.data[offset + 2] = color.b;
        scanline.data[offset + 3] = color.a;
    }

    function drawScanline(y) {
        context.putImageData(scanline, 0, y);
    }

    function drawFractal() {
        var yp = 0;
        while (yp < height) {
            var xp = 0;
            var y = getY(yp);
            while (xp < width) {
                var x = getX(xp);
                var result = goMandelGo(x, y, 350);
                var color = getColor(350, result.n, result.r, result.i);
                drawPixel(xp, color);
                xp++;
            }
            drawScanline(yp);
            yp++;
        }

    }

    drawFractal();
}());