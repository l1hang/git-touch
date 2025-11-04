<template>
  <canvas ref="canvasRef" class="w-full h-full block mix-blend-screen relative"></canvas>
</template>

<script>
const vertexShaderSource = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uHue;
uniform float uXOffset;
uniform float uSpeed;
uniform float uIntensity;
uniform float uSize;

#define OCTAVE_COUNT 10

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float hash11(float p) {
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rotate2d(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float a = hash12(ip);
    float b = hash12(ip + vec2(1.0, 0.0));
    float c = hash12(ip + vec2(0.0, 1.0));
    float d = hash12(ip + vec2(1.0, 1.0));
    
    vec2 t = smoothstep(0.0, 1.0, fp);
    return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < OCTAVE_COUNT; ++i) {
        value += amplitude * noise(p);
        p *= rotate2d(0.45);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    uv = 2.0 * uv - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    uv.x += uXOffset;
    
    uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
    
    float dist = abs(uv.x);
    vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
    vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
    col = pow(col, vec3(1.0));
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export default {
  name: 'Lightning',
  props: {
    hue: { type: Number, default: 230 },
    xOffset: { type: Number, default: 0 },
    speed: { type: Number, default: 1 },
    intensity: { type: Number, default: 1 },
    size: { type: Number, default: 1 }
  },
  data() {
    return {
      animationId: 0,
      gl: null,
      program: null,
      startTime: 0,
      _resizeHandler: null,
      _renderFn: null
    };
  },
  mounted() {
    this.initWebGL();
  },
  beforeDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
  },
  methods: {
    compileShader(source, type) {
      if (!this.gl) return null;
      const shader = this.gl.createShader(type);
      if (!shader) return null;
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
        return null;
      }
      return shader;
    },
    initWebGL() {
      const canvas = this.$refs.canvasRef;
      if (!canvas) return;

      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        let width = rect.width;
        let height = rect.height;

        let parent = canvas.parentElement;
        while (parent && (!width || !height)) {
          if (parent.offsetWidth && parent.offsetHeight) {
            width = parent.offsetWidth;
            height = parent.offsetHeight;
            break;
          }
          parent = parent.parentElement;
        }

        if (!width || !height) {
          width = window.innerWidth;
          height = window.innerHeight;
        }

        width = Math.max(width, 300);
        height = Math.max(height, 300);

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
      };

      resizeCanvas();
      this._resizeHandler = resizeCanvas;
      window.addEventListener('resize', this._resizeHandler);

      this.gl = canvas.getContext('webgl');
      if (!this.gl) {
        console.error('WebGL not supported');
        return;
      }

      const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
      const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);
      if (!vertexShader || !fragmentShader) return;

      this.program = this.gl.createProgram();
      if (!this.program) return;
      this.gl.attachShader(this.program, vertexShader);
      this.gl.attachShader(this.program, fragmentShader);
      this.gl.linkProgram(this.program);
      if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        console.error('Program linking error:', this.gl.getProgramInfoLog(this.program));
        return;
      }
      this.gl.useProgram(this.program);

      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
      const vertexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

      const aPosition = this.gl.getAttribLocation(this.program, 'aPosition');
      this.gl.enableVertexAttribArray(aPosition);
      this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);

      this.startTime = performance.now();
      // bind render
      this._renderFn = this.render.bind(this);
      this._renderFn();
    },
    render() {
      if (!this.gl || !this.program || !this.$refs.canvasRef) return;

      const canvas = this.$refs.canvasRef;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
      }

      this.gl.viewport(0, 0, canvas.width, canvas.height);

      const iResolutionLocation = this.gl.getUniformLocation(this.program, 'iResolution');
      const iTimeLocation = this.gl.getUniformLocation(this.program, 'iTime');
      const uHueLocation = this.gl.getUniformLocation(this.program, 'uHue');
      const uXOffsetLocation = this.gl.getUniformLocation(this.program, 'uXOffset');
      const uSpeedLocation = this.gl.getUniformLocation(this.program, 'uSpeed');
      const uIntensityLocation = this.gl.getUniformLocation(this.program, 'uIntensity');
      const uSizeLocation = this.gl.getUniformLocation(this.program, 'uSize');

      this.gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      const currentTime = performance.now();
      this.gl.uniform1f(iTimeLocation, (currentTime - this.startTime) / 1000.0);
      this.gl.uniform1f(uHueLocation, this.hue);
      this.gl.uniform1f(uXOffsetLocation, this.xOffset);
      this.gl.uniform1f(uSpeedLocation, this.speed);
      this.gl.uniform1f(uIntensityLocation, this.intensity);
      this.gl.uniform1f(uSizeLocation, this.size);

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
      this.animationId = requestAnimationFrame(this._renderFn);
    }
  }
};
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  display: block !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 1 !important;
}
</style>
