(function () {
    'use strict';

    // Found at: https://gist.github.com/lrvick/2080648
    var hexToRgb = function (hex) {
        var r = hex >> 16;
        var g = hex >> 8 & 0xFF;
        var b = hex & 0xFF;
        
        return [r,g,b];
    };

    var rgbToHex = function(r, g, b) {
        var bin = r << 16 | g << 8 | b;
        
        return (function(h){
            return new Array(7-h.length).join('0') + h;
        })(bin.toString(16).toUpperCase());
    };

    var hue2rgb = function (p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;

        return p;
    };

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    var hslToRgb = function (h, s, l) {
        var r, g, b;

        if(s === 0){
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    // Found at: http://stackoverflow.com/a/2348659
    var rgbToHls = function (r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max === min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
    };

    Polymer ('color-picker', {
        ready: function () {
            this.hls = { h: 0, l: 0, s: 0 };
        },
        publish: {
            color: 'f0f0f0',
            showHls: true
        },
        colorChanged: function () {
            var hls = rgbToHls.apply(this, this.rgb);
            this.hls = { h: hls[0], l: hls[1], s: hls[2] };
        },
        hlsChanged: function () {
            var rgb = hslToRgb([this.hls.h, this.hls.l, this.hls.s]);
            this.color = rgbToHex.apply(this, rgb);
        },
        get hex () {
            return parseInt(this.color, 16);
        },
        get rgb () {
            return hexToRgb(this.hex);
        }
    });
})();