/**
 * Created by Espen on 2/13/2016.
 */
var width = 640;
var height = 480;

var canvas = document.getElementById('fractal');


var context = canvas.getContext('2d');


var scanline = context.createImageData(width, 1);

for(var y = 0;y<height;y++){
    for(var x = 0;x<width;x++){
        var color = calculateColor(x);
        savePixel(color,x);
    }
    drawLine(y);
}

function calculateColor(x){
    var t = parseFloat(x)/width;
    var r = parseInt(Math.log(1-t)*255);
    var g = parseInt(Math.log(1-x)*255);
    var b = parseInt(0.5 * (1-t)*t*2*255);
    return [r>255?255:r,g > 255 ? 255 : g,b > 255 ? 255 : b,255];
}
function drawLine(y){
    context.putImageData(scanline, 0, y);
}

function savePixel(color,x){
    var offset = x << 2;
    scanline.data[offset] = color[0];
    scanline.data[offset+1] = color[1];
    scanline.data[offset+2] = color[2];
    scanline.data[offset+3] = color[3];
}