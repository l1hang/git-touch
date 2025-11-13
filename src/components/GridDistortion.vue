<template>
    <!-- 鼠标波动背景 -->
  <div
    ref="containerRef"
    :class="[className, 'grid-distortion']"
  ></div>
</template>

<script>
import * as THREE from "three";
export default {
  name: "GridDistortion",
  props: {
    grid: { type: Number, default: 15 },
    mouse: { type: Number, default: 0.1 },
    strength: { type: Number, default: 0.15 },
    relaxation: { type: Number, default: 0.9 },
    imageSrc: { type: String, required: true },
    className: { type: String, default: "" },
  },
  data() {
    return {
      imageAspect: 1,
      camera: null,
      initialData: null,
      cleanupAnimationFn: () => {},
    };
  },
  mounted() {
    // ensure no leftover
    this.cleanupAnimationFn();
    this.setupAnimation();
  },
  beforeDestroy() {
    const container = this.$refs.containerRef;
    if (container) container.innerHTML = "";
    this.cleanupAnimationFn();
  },
  methods: {
    restartAnimation() {
      this.cleanupAnimationFn();
      if (this.$refs.containerRef) {
        this.setupAnimation();
      }
    },
    setupAnimation() {
      const container = this.$refs.containerRef;
      if (!container) return;

      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
      camera.position.z = 2;
      this.camera = camera;

      const uniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        uTexture: { value: null },
        uDataTexture: { value: null },
      };

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(this.imageSrc, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        this.imageAspect = texture.image.width / texture.image.height;
        uniforms.uTexture.value = texture;
        handleResize();
      });

      const size = this.grid;
      const data = new Float32Array(4 * size * size);
      for (let i = 0; i < size * size; i++) {
        data[i * 4] = Math.random() * 255 - 125;
        data[i * 4 + 1] = Math.random() * 255 - 125;
      }
      this.initialData = new Float32Array(data);

      const dataTexture = new THREE.DataTexture(
        data,
        size,
        size,
        THREE.RGBAFormat,
        THREE.FloatType
      );
      dataTexture.needsUpdate = true;
      uniforms.uDataTexture.value = dataTexture;

      const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
      });

      const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      const handleResize = () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const containerAspect = width / height;
        const imageAspect = this.imageAspect;

        renderer.setSize(width, height);

        const scale = Math.max(containerAspect / imageAspect, 1);
        plane.scale.set(imageAspect * scale, scale, 1);

        const frustumHeight = 1;
        const frustumWidth = frustumHeight * containerAspect;
        camera.left = -frustumWidth / 2;
        camera.right = frustumWidth / 2;
        camera.top = frustumHeight / 2;
        camera.bottom = -frustumHeight / 2;
        camera.updateProjectionMatrix();

        uniforms.resolution.value.set(width, height, 1, 1);
      };

      const mouseState = {
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        vX: 0,
        vY: 0,
      };

      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        mouseState.vX = x - mouseState.prevX;
        mouseState.vY = y - mouseState.prevY;
        Object.assign(mouseState, { x, y, prevX: x, prevY: y });
      };

      const handleMouseLeave = () => {
        dataTexture.needsUpdate = true;
        Object.assign(mouseState, {
          x: 0,
          y: 0,
          prevX: 0,
          prevY: 0,
          vX: 0,
          vY: 0,
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("resize", handleResize);
      handleResize();

      const animate = () => {
        requestAnimationFrame(animate);
        uniforms.time.value += 0.05;

        const dataArr = dataTexture.image.data;
        for (let i = 0; i < size * size; i++) {
          dataArr[i * 4] *= this.relaxation;
          dataArr[i * 4 + 1] *= this.relaxation;
        }

        const gridMouseX = size * mouseState.x;
        const gridMouseY = size * mouseState.y;
        const maxDist = size * this.mouse;

        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            const distSq =
              Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
            if (distSq < maxDist * maxDist) {
              const index = 4 * (i + size * j);
              const power = Math.min(maxDist / Math.sqrt(distSq), 10);
              dataArr[index] += this.strength * 100 * mouseState.vX * power;
              dataArr[index + 1] -= this.strength * 100 * mouseState.vY * power;
            }
          }
        }

        dataTexture.needsUpdate = true;
        renderer.render(scene, camera);
      };
      animate();

      this.cleanupAnimationFn = () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("resize", handleResize);
        try {
          renderer.dispose();
        } catch (e) {
            console.log(e);
        }
        try {
          geometry.dispose();
        } catch (e) {
            console.log(e);
        }
        try {
          material.dispose();
        } catch (e) {
            console.log(e);
        }
        try {
          dataTexture.dispose();
        } catch (e) {
            console.log(e);
        }
        if (uniforms.uTexture.value && uniforms.uTexture.value.dispose) {
          try {
            uniforms.uTexture.value.dispose();
          } catch (e) {
            console.log(e);
          }
        }
      };
    },
  },
  watch: {
    grid() {
      this.restartAnimation();
    },
    mouse() {
      this.restartAnimation();
    },
    strength() {
      this.restartAnimation();
    },
    relaxation() {
      this.restartAnimation();
    },
    imageSrc() {
      this.restartAnimation();
    },
  },
  computed: {
    vertexShader() {
      return `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
    },
    fragmentShader() {
      return `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}
`;
    },
  },
};
</script>

<style scoped>
.grid-distortion {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
