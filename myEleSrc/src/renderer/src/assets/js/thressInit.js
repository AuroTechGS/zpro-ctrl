import * as THREE from 'three';  // 导入 three.js
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let resizeTimeout;
let controls = null;

// 1. 创建场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,  // 视野角度
    window.innerWidth / window.innerHeight,  // 宽高比
    0.1,  // 近裁剪面
    1000  // 远裁剪面
);
scene.background = new THREE.Color(0x606266);    // RGB 颜色格式


const renderer = new THREE.WebGLRenderer();

export const initScene = (dom) => {
    camera.position.set(-12, 12, 12);
    scene.add(camera);

    // const box = new THREE.BoxGeometry(2, 2, 2);
    // const matrial = new THREE.MeshBasicMaterial({ color: 0x313131 });
    // let cube = new THREE.Mesh(box, matrial);
    // cube.position.y = 1;
    // scene.add(cube);

    renderer.setSize(window.innerWidth, window.innerHeight);
    dom.appendChild(renderer.domElement);  // 将渲染器的 Canvas 元素添加到 DOM
    controls = new OrbitControls(camera, renderer.domElement);
    requestAnimationFrame(render);
    const axests = new THREE.AxesHelper(10);
    scene.add(axests)

    // 创建网格线（GridHelper）
    const gridHelper = new THREE.GridHelper(2000, 500);  // 参数 10 表示网格的大小，第二个 10 表示网格线的数量
    gridHelper.position.y = -20;
    scene.add(gridHelper);
    window.addEventListener('resize', onWindowResize, false);
}


let lastTime = 0;
const fps = 20; // 目标帧率（例如 30 FPS）
const interval = 1000 / fps; // 每一帧之间的时间间隔

function render(time) {
  if (time - lastTime > interval) {
    lastTime = time;
    // controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(render);
}

const onWindowResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // 更新相机的宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();  // 更新相机投影矩阵
    // 更新渲染器的大小
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 200); // 延迟 100ms 处理 resize 事件
}


export const addCailPly = (points) => {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];

  points.forEach(p => {
    positions.push(p.x, p.y, p.z);
    colors.push(p.r / 255, p.g / 255, p.b / 255);
  });

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
  const pointCloud = new THREE.Points(geometry, material);
  pointCloud.rotation.x = Math.PI / 2 + Math.PI - Math.PI / 18;
  scene.add(pointCloud);
}