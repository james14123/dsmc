(function(name, context, definition) {
    'use strict';
    if (typeof window.define === 'function' && window.define.amd) {
        window.define(definition)
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition()
    } else if (context.exports) {
        context.exports = definition()
    } else {
        context[name] = definition()
    }
})('PCHOMEFingerprint', this, function() {
    'use strict';
    var PCHOMEFingerprint = function(options) {
        if (!(this instanceof PCHOMEFingerprint)) {
            return new PCHOMEFingerprint(options)
        }
        var defaultOptions = {
            swfContainerId: 'PCHOMEFingerprint',
            swfPath: 'flash/compiled/FontList.swf',
            detectScreenOrientation: true,
            sortPluginsFor: [/palemoon/i],
            userDefinedFonts: []
        };
        this.options = this.extend(options, defaultOptions);
        this.nativeForEach = Array.prototype.forEach;
        this.nativeMap = Array.prototype.map
    };
    PCHOMEFingerprint.prototype = {
        extend: function(source, target) {
            if (source == null) {
                return target
            }
            for (var k in source) {
                if (source[k] != null && target[k] !== source[k]) {
                    target[k] = source[k]
                }
            }
            return target
        },
        getWebglFp: function() {
            var gl;
            var fa2s = function(fa) {
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                return '[' + fa[0] + ', ' + fa[1] + ']'
            };
            var maxAnisotropy = function(gl) {
                var ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
                if (ext) {
                    var anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                    if (anisotropy === 0) {
                        anisotropy = 2
                    }
                    return anisotropy
                } else {
                    return null
                }
            };
            gl = this.getWebglCanvas();
            if (!gl) {
                return null
            }
            var result = [];
            var vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
            var fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
            var vertexPosBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
            var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            vertexPosBuffer.itemSize = 3;
            vertexPosBuffer.numItems = 3;
            var program = gl.createProgram();
            var vshader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vshader, vShaderTemplate);
            gl.compileShader(vshader);
            var fshader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fshader, fShaderTemplate);
            gl.compileShader(fshader);
            gl.attachShader(program, vshader);
            gl.attachShader(program, fshader);
            gl.linkProgram(program);
            gl.useProgram(program);
            program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
            program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
            gl.enableVertexAttribArray(program.vertexPosArray);
            gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
            gl.uniform2f(program.offsetUniform, 1, 1);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
            try {
                result.push(gl.canvas.toDataURL())
            } catch (e) {}
            result.push('extensions:' + (gl.getSupportedExtensions() || []).join(';'));
            result.push('webgl aliased line width range:' + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
            result.push('webgl aliased point size range:' + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
            result.push('webgl alpha bits:' + gl.getParameter(gl.ALPHA_BITS));
            result.push('webgl antialiasing:' + (gl.getContextAttributes().antialias ? 'yes' : 'no'));
            result.push('webgl blue bits:' + gl.getParameter(gl.BLUE_BITS));
            result.push('webgl depth bits:' + gl.getParameter(gl.DEPTH_BITS));
            result.push('webgl green bits:' + gl.getParameter(gl.GREEN_BITS));
            result.push('webgl max anisotropy:' + maxAnisotropy(gl));
            result.push('webgl max combined texture image units:' + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
            result.push('webgl max cube map texture size:' + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
            result.push('webgl max fragment uniform vectors:' + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
            result.push('webgl max render buffer size:' + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
            result.push('webgl max texture image units:' + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
            result.push('webgl max texture size:' + gl.getParameter(gl.MAX_TEXTURE_SIZE));
            result.push('webgl max varying vectors:' + gl.getParameter(gl.MAX_VARYING_VECTORS));
            result.push('webgl max vertex attribs:' + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
            result.push('webgl max vertex texture image units:' + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
            result.push('webgl max vertex uniform vectors:' + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
            result.push('webgl max viewport dims:' + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
            result.push('webgl red bits:' + gl.getParameter(gl.RED_BITS));
            result.push('webgl renderer:' + gl.getParameter(gl.RENDERER));
            result.push('webgl shading language version:' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
            result.push('webgl stencil bits:' + gl.getParameter(gl.STENCIL_BITS));
            result.push('webgl vendor:' + gl.getParameter(gl.VENDOR));
            result.push('webgl version:' + gl.getParameter(gl.VERSION));
            try {
                var extensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (extensionDebugRendererInfo) {
                    result.push('webgl unmasked vendor:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL));
                    result.push('webgl unmasked renderer:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL))
                }
            } catch (e) {}
            if (!gl.getShaderPrecisionFormat) {
                return result.join('~')
            }
            result.push('webgl vertex shader high float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision);
            result.push('webgl vertex shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMin);
            result.push('webgl vertex shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMax);
            result.push('webgl vertex shader medium float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision);
            result.push('webgl vertex shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMin);
            result.push('webgl vertex shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMax);
            result.push('webgl vertex shader low float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).precision);
            result.push('webgl vertex shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMin);
            result.push('webgl vertex shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMax);
            result.push('webgl fragment shader high float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision);
            result.push('webgl fragment shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMin);
            result.push('webgl fragment shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMax);
            result.push('webgl fragment shader medium float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision);
            result.push('webgl fragment shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMin);
            result.push('webgl fragment shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMax);
            result.push('webgl fragment shader low float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).precision);
            result.push('webgl fragment shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMin);
            result.push('webgl fragment shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMax);
            result.push('webgl vertex shader high int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).precision);
            result.push('webgl vertex shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMin);
            result.push('webgl vertex shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMax);
            result.push('webgl vertex shader medium int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).precision);
            result.push('webgl vertex shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMin);
            result.push('webgl vertex shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMax);
            result.push('webgl vertex shader low int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).precision);
            result.push('webgl vertex shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMin);
            result.push('webgl vertex shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMax);
            result.push('webgl fragment shader high int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).precision);
            result.push('webgl fragment shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMin);
            result.push('webgl fragment shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMax);
            result.push('webgl fragment shader medium int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).precision);
            result.push('webgl fragment shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMin);
            result.push('webgl fragment shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMax);
            result.push('webgl fragment shader low int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).precision);
            result.push('webgl fragment shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMin);
            result.push('webgl fragment shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMax);
            return result.join('~')
        },
        getWebglCanvas: function() {
            var canvas = document.createElement('canvas');
            var gl = null;
            try {
                gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            } catch (e) {}
            if (!gl) {
                gl = null
            }
            return gl
        },
        getCanvasFp: function() {
            var result = [];
            var canvas = document.createElement('canvas');
            canvas.width = 2000;
            canvas.height = 200;
            canvas.style.display = 'inline';
            var ctx = canvas.getContext('2d');
            ctx.rect(0, 0, 10, 10);
            ctx.rect(2, 2, 6, 6);
            result.push('canvas winding:' + ((ctx.isPointInPath(5, 5, 'evenodd') === false) ? 'yes' : 'no'));
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            if (this.options.dontUseFakeFontInCanvas) {
                ctx.font = '11pt Arial'
            } else {
                ctx.font = '11pt no-real-font-123'
            }
            ctx.fillText('Cwm fjordbank glyphs vext quiz, ??', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
            ctx.font = '18pt Arial';
            ctx.fillText('Cwm fjordbank glyphs vext quiz, ??', 4, 45);
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgb(255,0,255)';
            ctx.beginPath();
            ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgb(0,255,255)';
            ctx.beginPath();
            ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgb(255,255,0)';
            ctx.beginPath();
            ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgb(255,0,255)';
            ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
            ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
            ctx.fill('evenodd');
            if (canvas.toDataURL) {
                result.push('canvas fp:' + canvas.toDataURL())
            }
            return result.join('~')
        },
        x64Add: function(m, n) {
            m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
            n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
            var o = [0, 0, 0, 0];
            o[3] += m[3] + n[3];
            o[2] += o[3] >>> 16;
            o[3] &= 0xffff;
            o[2] += m[2] + n[2];
            o[1] += o[2] >>> 16;
            o[2] &= 0xffff;
            o[1] += m[1] + n[1];
            o[0] += o[1] >>> 16;
            o[1] &= 0xffff;
            o[0] += m[0] + n[0];
            o[0] &= 0xffff;
            return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
        },
        x64Multiply: function(m, n) {
            m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
            n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
            var o = [0, 0, 0, 0];
            o[3] += m[3] * n[3];
            o[2] += o[3] >>> 16;
            o[3] &= 0xffff;
            o[2] += m[2] * n[3];
            o[1] += o[2] >>> 16;
            o[2] &= 0xffff;
            o[2] += m[3] * n[2];
            o[1] += o[2] >>> 16;
            o[2] &= 0xffff;
            o[1] += m[1] * n[3];
            o[0] += o[1] >>> 16;
            o[1] &= 0xffff;
            o[1] += m[2] * n[2];
            o[0] += o[1] >>> 16;
            o[1] &= 0xffff;
            o[1] += m[3] * n[1];
            o[0] += o[1] >>> 16;
            o[1] &= 0xffff;
            o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
            o[0] &= 0xffff;
            return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]]
        },
        x64Rotl: function(m, n) {
            n %= 64;
            if (n === 32) {
                return [m[1], m[0]]
            } else if (n < 32) {
                return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))]
            } else {
                n -= 32;
                return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))]
            }
        },
        x64LeftShift: function(m, n) {
            n %= 64;
            if (n === 0) {
                return m
            } else if (n < 32) {
                return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n]
            } else {
                return [m[1] << (n - 32), 0]
            }
        },
        x64Xor: function(m, n) {
            return [m[0] ^ n[0], m[1] ^ n[1]]
        },
        x64Fmix: function(h) {
            h = this.x64Xor(h, [0, h[0] >>> 1]);
            h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
            h = this.x64Xor(h, [0, h[0] >>> 1]);
            h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
            h = this.x64Xor(h, [0, h[0] >>> 1]);
            return h
        },
        x64hash128: function(key, seed) {
            key = key || '';
            seed = seed || 0;
            var remainder = key.length % 16;
            var bytes = key.length - remainder;
            var h1 = [0, seed];
            var h2 = [0, seed];
            var k1 = [0, 0];
            var k2 = [0, 0];
            var c1 = [0x87c37b91, 0x114253d5];
            var c2 = [0x4cf5ad43, 0x2745937f];
            for (var i = 0; i < bytes; i = i + 16) {
                k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
                k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
                k1 = this.x64Multiply(k1, c1);
                k1 = this.x64Rotl(k1, 31);
                k1 = this.x64Multiply(k1, c2);
                h1 = this.x64Xor(h1, k1);
                h1 = this.x64Rotl(h1, 27);
                h1 = this.x64Add(h1, h2);
                h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
                k2 = this.x64Multiply(k2, c2);
                k2 = this.x64Rotl(k2, 33);
                k2 = this.x64Multiply(k2, c1);
                h2 = this.x64Xor(h2, k2);
                h2 = this.x64Rotl(h2, 31);
                h2 = this.x64Add(h2, h1);
                h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5])
            };
            k1 = [0, 0];
            k2 = [0, 0];
            switch (remainder) {
                case 15:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
                case 14:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
                case 13:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
                case 12:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
                case 11:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
                case 10:
                    k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
                case 9:
                    k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
                    k2 = this.x64Multiply(k2, c2);
                    k2 = this.x64Rotl(k2, 33);
                    k2 = this.x64Multiply(k2, c1);
                    h2 = this.x64Xor(h2, k2);
                case 8:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
                case 7:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
                case 6:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
                case 5:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
                case 4:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
                case 3:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
                case 2:
                    k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
                case 1:
                    k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
                    k1 = this.x64Multiply(k1, c1);
                    k1 = this.x64Rotl(k1, 31);
                    k1 = this.x64Multiply(k1, c2);
                    h1 = this.x64Xor(h1, k1)
            };
            h1 = this.x64Xor(h1, [0, key.length]);
            h2 = this.x64Xor(h2, [0, key.length]);
            h1 = this.x64Add(h1, h2);
            h2 = this.x64Add(h2, h1);
            h1 = this.x64Fmix(h1);
            h2 = this.x64Fmix(h2);
            h1 = this.x64Add(h1, h2);
            h2 = this.x64Add(h2, h1);
            return (('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8))
        }
    };
    return PCHOMEFingerprint
});
var res = document.URL;
var docurl = encodeURIComponent(res);
var keywordValue = "";
var pageValue = "";
var pid = "";
var ptype = "";
var seway = "";
var padssl = "";
if (typeof pad_pchad != 'object') {
    pad_pchad = []
}
if (typeof pad_precise != 'undefined') {
    seway = pad_precise
} else {
    seway = false
} if (typeof pad_ssl != 'undefined') {
    padssl = pad_ssl
} else {
    padssl = true
} if (typeof pad_positionId != 'undefined') {
    pid = pad_positionId.substring(0, 16);
    ptype = pad_positionId.substring(16, 17);
    pad_pchad.push(pid);
    if (ptype == "") {
        ptype = "C"
    }
}
if (ptype == "S") {
    if (typeof pad_keyword != 'undefined') {
        keywordValue = pad_keyword
    }
    if (typeof pad_page != 'undefined') {
        pageValue = pad_page
    }
    if (keywordValue.length == 0) {
        if (res.indexOf("nicolee.pchome.com.tw") > 1) {
            var testurl = res;
            var kis = testurl.indexOf("q=");
            if (kis > 1) {
                var pis = testurl.indexOf("page=");
                var tis = testurl.indexOf("precise=");
                keywordValue = testurl.substring(kis + 2, pis - 1);
                if (pis < 1) {
                    pageValue = 1
                } else {
                    pageValue = testurl.substring(pis + 5, tis - 1)
                }
            }
        }
        if (res.indexOf("search.pchome.com.tw") > 1) {
            var testurl = res;
            var kis = testurl.indexOf("q=");
            if (kis > 1) {
                var pis = testurl.indexOf("ch=");
                keywordValue = testurl.substring(kis + 2, pis - 1)
            }
        }
        if (res.indexOf("search.ruten.com.tw") > 1) {
            var testurl = res;
            var kis = testurl.indexOf("k=");
            if (kis > 1) {
                var tis = testurl.indexOf("t=");
                var pis = testurl.indexOf("p=");
                keywordValue = testurl.substring(kis + 2, tis - 1);
                if (pis < 1) {
                    pageValue = 1
                } else {
                    pageValue = testurl.substring(pis + 2, testurl.length)
                }
            }
        }
    }
} else {
    keywordValue = "";
    pageValue = "";
    seway = ""
}
var keys = [];
var getCanvasFp = PCHOMEFingerprint().getCanvasFp();
var getWebglFp = PCHOMEFingerprint().getWebglFp();
var windowScreenColorDepth = window.screen.colorDepth;
var devicePixelRatio = window.devicePixelRatio;
var userAgent = navigator.userAgent;
var language = navigator.language;
var deviceMemory = navigator.deviceMemory || -1;
var resolution = (window.screen.height > window.screen.width) ? [window.screen.height, window.screen.width] : [window.screen.width, window.screen.height];
var cpu;
if (navigator.cpuClass) {
    cpu = navigator.cpuClass
} else {
    cpu = 'unknown'
}
keys.push(getCanvasFp);
keys.push(getWebglFp);
keys.push(windowScreenColorDepth);
keys.push(devicePixelRatio);
keys.push(userAgent);
keys.push(language);
keys.push(resolution);
keys.push(cpu);
var fig = PCHOMEFingerprint().x64hash128(keys.join('~~~'), 32);
var adurl = "";
if (padssl == "false") {
    adurl += "http://kdcl.pchome.com.tw/adshow2.html?pfbxCustomerInfoId=" + pad_customerId
} else {
    adurl += "https://kdcl.pchome.com.tw/adshow2.html?pfbxCustomerInfoId=" + pad_customerId
}
adurl += "&positionId=" + pid;
adurl += "&padWidth=" + pad_width;
adurl += "&padHeight=" + pad_height;
adurl += "&keyword=" + keywordValue;
adurl += "&page=" + pageValue;
adurl += "&precise=" + seway;
adurl += "&fig=" + fig;
adurl += "&t=" + Math.floor(Math.random() * 1000 + 1);
if (docurl.indexOf("kdcl") > 1 || docurl.indexOf("kwstg") > 1) {
    adurl += "&docurl="
} else {
    adurl += "&docurl=" + docurl
}
var showadscript = "<script type=text/javascript src=" + adurl + "></script>";
if (pad_pchad.length <= 10) {
    if (ptype == "S") {
        document.write(showadscript)
    } else {
        var head = document.getElementsByTagName("head");
        document.write('<iframe class="akb_iframe" scrolling="no" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" id="pchome8044_ad_frame1" width="' + pad_width + '" height="' + pad_height + '" allowtransparency="true" allowfullscreen="true" src="javascript:\'' + showadscript + '\'"></iframe>')
    }
} else {
    alert("頞��𤾸誨��𠹺�𢠃�琜�峕�憭𡁜蘨�質票10���誨���!")
}
window.onresize = function(event) {
    try {
        var iframeArrayData = document.getElementsByTagName("iframe");
        var iframeArray = [];
        for (var i = 0; i < iframeArrayData.length; i++) {
            if (iframeArrayData[i].id == "pchome8044_ad_frame1") {
                iframeArray.push(iframeArrayData[i])
            }
        }
        for (var i = 0; i < iframeArray.length; i++) {
            var iframe = iframeArray[i].contentDocument.body.children[0];
            var iframeWin = iframe.contentWindow;
            var iframeOriginal = iframeArray[i];
            var scrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
            var viewHeight = window.innerHeight;
            var iframeOffSetTop = iframeOriginal.offsetTop;
            var iframeBottom = iframeOriginal.getBoundingClientRect().bottom;
            var iframeTop = iframeOriginal.getBoundingClientRect().top;
            var iframeOriginalHeight = iframeOriginal.height.replace(';px', '');
            var iframeHalf = iframeOriginalHeight / 2;
            var controllerHeight = (viewHeight + iframeHalf) - iframeOriginalHeight;
            adInfo = '{"adInfo":{"scrollTop":' + scrollTop + ',"viewHeight":' + viewHeight + ',"iframeOffSetTop":' + iframeOffSetTop + ',"iframeBottom":' + iframeBottom + ',"iframeTop":' + iframeTop + ',"iframeHalf":' + iframeHalf + ',"controllerHeight":' + controllerHeight + ',"visibilitychange":' + false + '}}';
            iframeWin.postMessage(adInfo, "*")
        }
    } catch (err) {}
};
window.document.addEventListener('scroll', function() {
    try {
        var iframeArrayData = document.getElementsByTagName("iframe");
        var iframeArray = [];
        for (var i = 0; i < iframeArrayData.length; i++) {
            if (iframeArrayData[i].id == "pchome8044_ad_frame1") {
                iframeArray.push(iframeArrayData[i])
            }
        }
        for (var i = 0; i < iframeArray.length; i++) {
            var iframe = iframeArray[i].contentDocument.body.children[0];
            var iframeWin = iframe.contentWindow;
            var iframeOriginal = iframeArray[i];
            var scrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
            var viewHeight = window.innerHeight;
            var iframeOffSetTop = iframeOriginal.offsetTop;
            var iframeBottom = iframeOriginal.getBoundingClientRect().bottom;
            var iframeTop = iframeOriginal.getBoundingClientRect().top;
            var iframeOriginalHeight = iframeOriginal.height.replace(';px', '');
            var iframeHalf = iframeOriginalHeight / 2;
            var controllerHeight = (viewHeight + iframeHalf) - iframeOriginalHeight;
            adInfo = '{"adInfo":{"scrollTop":' + scrollTop + ',"viewHeight":' + viewHeight + ',"iframeOffSetTop":' + iframeOffSetTop + ',"iframeBottom":' + iframeBottom + ',"iframeTop":' + iframeTop + ',"iframeHalf":' + iframeHalf + ',"controllerHeight":' + controllerHeight + ',"visibilitychange":' + false + '}}';
            iframeWin.postMessage(adInfo, "*")
        }
    } catch (err) {}
}, false);
window.document.addEventListener('visibilitychange', function() {
    var iframeArrayData = document.getElementsByTagName("iframe");
    var iframeArray = [];
    for (var i = 0; i < iframeArrayData.length; i++) {
        if (iframeArrayData[i].id == "pchome8044_ad_frame1") {
            iframeArray.push(iframeArrayData[i])
        }
    }
    for (var i = 0; i < iframeArray.length; i++) {
        var iframe = iframeArray[i].contentDocument.body.children[0];
        var iframeWin = iframe.contentWindow;
        var iframeOriginal = iframeArray[i];
        var scrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
        var viewHeight = window.innerHeight;
        var iframeOffSetTop = iframeOriginal.offsetTop;
        var iframeBottom = iframeOriginal.getBoundingClientRect().bottom;
        var iframeTop = iframeOriginal.getBoundingClientRect().top;
        var iframeOriginalHeight = iframeOriginal.height.replace(';px', '');
        var iframeHalf = iframeOriginalHeight / 2;
        var controllerHeight = (viewHeight + iframeHalf) - iframeOriginalHeight;
        var visibilitychange = false;
        if (document.hidden) {
            visibilitychange = true;
        }
        adInfo = '{"adInfo":{"scrollTop":' + scrollTop + ',"viewHeight":' + viewHeight + ',"iframeOffSetTop":' + iframeOffSetTop + ',"iframeBottom":' + iframeBottom + ',"iframeTop":' + iframeTop + ',"iframeHalf":' + iframeHalf + ',"controllerHeight":' + controllerHeight + ',"visibilitychange":' + visibilitychange + '},"adBackup":{"iframeIndex":' + i + ',"ALEX":"pcadshow","httpType":' + padssl + '}}';
        iframeWin.postMessage(adInfo, "*")
    }
}, false);

(function() {
	try {
        var iframeArrayData = document.getElementsByTagName("iframe");
        var iframeArray = [];
        for (var i = 0; i < iframeArrayData.length; i++) {
            if (iframeArrayData[i].id == "pchome8044_ad_frame1") {
                iframeArray.push(iframeArrayData[i])
            }
        }
        for (var i = 0; i < iframeArray.length; i++) {
            var iframe = iframeArray[i].contentDocument.body.children[0];
            var iframeWin = iframe.contentWindow;
            var iframeOriginal = iframeArray[i];
            var scrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
            var viewHeight = window.innerHeight;
            var iframeOffSetTop = iframeOriginal.offsetTop;
            var iframeBottom = iframeOriginal.getBoundingClientRect().bottom;
            var iframeTop = iframeOriginal.getBoundingClientRect().top;
            var iframeOriginalHeight = iframeOriginal.height.replace(';px', '');
            var iframeHalf = iframeOriginalHeight / 2;
            var controllerHeight = (viewHeight + iframeHalf) - iframeOriginalHeight;
            adInfo = '{"adInfo":{"scrollTop":' + scrollTop + ',"viewHeight":' + viewHeight + ',"iframeOffSetTop":' + iframeOffSetTop + ',"iframeBottom":' + iframeBottom + ',"iframeTop":' + iframeTop + ',"iframeHalf":' + iframeHalf + ',"controllerHeight":' + controllerHeight + ',"visibilitychange":' + false + '}}';
            iframeWin.postMessage(adInfo, "*")
        }
    } catch (err) {}
})()
window.addEventListener("message", getMessage0, false);


function getMessage0(event) {
    try {
        if (event.data.adBackup != undefined && event.data.adBackup.iframeIndex != null && event.data.adBackup.ALEX == 'pcadshow') {
            var htmlContent = event.data.adBackup.htmlContent;
            if (htmlContent != null) {
                var pcadshowList = document.getElementsByClassName("akb_iframe");
                if (htmlContent == 'blank') {
                    var iframeObj = pcadshowList[event.data.adBackup.iframeIndex];
                    iframeObj.height = 0;
                    iframeObj.width = 0
                }
                if (htmlContent != 'blank' && htmlContent != undefined) {
                    var iframeObj = pcadshowList[event.data.adBackup.iframeIndex];
                    iframeObj.height = 0;
                    iframeObj.width = 0;
                    var appendDom = iframeObj.parentElement;
                    if (iframeObj.nextElementSibling == null || iframeObj.nextElementSibling.className != 'ad_backup_pchome') {
                        var script = document.createElement('div');
                        var appendDiv = document.createElement('div');
                        appendDiv.className = 'ad_backup_pchome';
                        script.innerHTML = htmlContent;
                        var elements = script.getElementsByTagName("*");
                        for (var j = 0; j < elements.length; j++) {
                            var tagName = elements[j].tagName;
                            var attributes = elements[j].attributes;
                            var text = elements[j].innerHTML;
                            var content = document.createElement(tagName);
                            for (var k = 0; k < attributes.length; k++) {
                                var attrib = attributes[k];
                                var name = attrib.name;
                                var name = attrib.value;
                                content.setAttribute(attrib.name, attrib.value)
                            }
                            content.text = text;
                            appendDiv.appendChild(content, appendDiv.firstChild)
                        }
                        if (iframeObj.nextElementSibling == null) {
                            appendDom.appendChild(appendDiv, iframeObj.parentElement)
                        } else {
                            appendDom.insertBefore(appendDiv, iframeObj.nextElementSibling)
                        }
                    }
                }
            }
        }
    } catch (err) {}
}
try {
    var iframeArrayData = document.getElementsByTagName("iframe");
    var iframeArray = [];
    for (var i = 0; i < iframeArrayData.length; i++) {
        if (iframeArrayData[i].id == "pchome8044_ad_frame1") {
            iframeArray.push(iframeArrayData[i])
        }
    }
    var pcadshowList = document.getElementsByClassName("asynpchomead");
    for (var i = 0; i < iframeArray.length; i++) {
        iframeArray[i].onload = function() {
            if (this.parentElement.className == 'asynpchomead') {
                for (var k = 0; k < iframeArray.length; k++) {
                    if (this == iframeArray[k]) {
                        var iframe = this.contentDocument.body.children[0];
                        var iframeWin = iframe.contentWindow;
                        var iframeOriginal = this;
                        var adInfo = null;
                        var scrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
                        var viewHeight = window.innerHeight;
                        var iframeOffSetTop = iframeOriginal.offsetTop;
                        var iframeBottom = iframeOriginal.getBoundingClientRect().bottom;
                        var iframeTop = iframeOriginal.getBoundingClientRect().top;
                        var iframeOriginalHeight = iframeOriginal.height.replace(';px', '');
                        var iframeHalf = iframeOriginalHeight / 2;
                        var controllerHeight = (viewHeight + iframeHalf) - iframeOriginalHeight;
                        var adInfo = '{"adInfo":{"scrollTop":' + scrollTop + ',"viewHeight":' + viewHeight + ',"iframeOffSetTop":' + iframeOffSetTop + ',"iframeBottom":' + iframeBottom + ',"iframeTop":' + iframeTop + ',"iframeHalf":' + iframeHalf + ',"controllerHeight":' + controllerHeight + ',"visibilitychange":' + false + '},"adBackup":{"iframeIndex":' + k + ',"ALEX":"pcadshow","httpType":' + padssl + '}}';
                        iframeWin.postMessage(adInfo, "*")
                    }
                }
            } else {
                for (var k = 0; k < iframeArray.length; k++) {
                    if (this == iframeArray[k]) {
                        var iframe = this.contentDocument.body.children[0];
                        var iframeWin = iframe.contentWindow;
                        var iframeOriginal = this;
                        var adInfo = null;
                        var scrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
                        var viewHeight = window.innerHeight;
                        var iframeOffSetTop = iframeOriginal.offsetTop;
                        var iframeBottom = iframeOriginal.getBoundingClientRect().bottom;
                        var iframeTop = iframeOriginal.getBoundingClientRect().top;
                        var iframeOriginalHeight = iframeOriginal.height.replace(';px', '');
                        var iframeHalf = iframeOriginalHeight / 2;
                        var controllerHeight = (viewHeight + iframeHalf) - iframeOriginalHeight;
                        var adInfo = '{"adInfo":{"scrollTop":' + scrollTop + ',"viewHeight":' + viewHeight + ',"iframeOffSetTop":' + iframeOffSetTop + ',"iframeBottom":' + iframeBottom + ',"iframeTop":' + iframeTop + ',"iframeHalf":' + iframeHalf + ',"controllerHeight":' + controllerHeight + ',"visibilitychange":' + false + '},"adBackup":{"iframeIndex":' + k + ',"ALEX":"pcadshow","httpType":' + padssl + '}}';
                        iframeWin.postMessage(adInfo, "*")
                    }
                }
            }
        }
    }
} catch (err) {}


try {
	for (var k = 0; k < iframeArray.length; k++) {
        if (this == iframeArray[k]) {
            var iframe = this.contentDocument.body.children[0];
            var iframeWin = iframe.contentWindow;
            var iframeOriginal = this;
            var adInfo = null;
            var scrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
            var viewHeight = window.innerHeight;
            var iframeOffSetTop = iframeOriginal.offsetTop;
            var iframeBottom = iframeOriginal.getBoundingClientRect().bottom;
            var iframeTop = iframeOriginal.getBoundingClientRect().top;
            var iframeOriginalHeight = iframeOriginal.height.replace(';px', '');
            var iframeHalf = iframeOriginalHeight / 2;
            var controllerHeight = (viewHeight + iframeHalf) - iframeOriginalHeight;
            var adInfo = '{"adInfo":{"scrollTop":' + 999999999999 + ',"viewHeight":' + viewHeight + ',"iframeOffSetTop":' + iframeOffSetTop + ',"iframeBottom":' + iframeBottom + ',"iframeTop":' + iframeTop + ',"iframeHalf":' + iframeHalf + ',"controllerHeight":' + controllerHeight + ',"visibilitychange":' + false + '},"adBackup":{"iframeIndex":' + k + ',"ALEX8888888":"pcadshow","httpType":' + padssl + '}}';
            iframeWin.postMessage(adInfo, "*")
        }
    }
} catch (err) {}
//window.onload=function(){
////	var x = document.getElementsByTagName("div")[0];
////	console.log(x);
////
////	var y = document.getElementsByClassName("sitemaji_banner_fixed");
////	console.log(y);
//	var a = document.getElementsByTagName("iframe");
////	console.log(a);
//	
//	
////	var z = document.getElementsByTagName("iframe")[0];
////	console.log(z);
////	console.log(z.parentElement.parentElement.parentElement.parentElement);
////	console.log(z.parentElement.parentElement.parentElement.parentElement.parentElement);
//	var a = document.getElementsByTagName("div")[0];
//	console.log(a);
//}

//document.getElementsByTagName("iframe")[0]parentElement.parentElement.parentElement.parentElement.addEventListener("resize", function(){
//	console.log('----')
//});

