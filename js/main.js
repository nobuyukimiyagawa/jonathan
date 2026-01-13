document.addEventListener('DOMContentLoaded', () => {
  // Splash Screen Logic
  const splashScreen = document.getElementById('splash-screen');

  if (splashScreen) {
    // Fade out splash screen after 2.5 seconds
    setTimeout(() => {
      splashScreen.classList.add('hidden');
      setTimeout(() => {
        splashScreen.style.display = 'none';
        initThreeJS();
      }, 1000);
    }, 2200);
  } else {
    initThreeJS();
  }

  // Scroll Event for Text Switching and 3D Rotation
  let scrollY = 0;
  const heroSection = document.querySelector('.hero');
  const slide1 = document.querySelector('.slide-1');
  const slide2 = document.querySelector('.slide-2');
  const heroHeight = heroSection ? heroSection.offsetHeight : 0;
  // Threshold to switch slides (e.g., at 30% of hero scroll)
  const switchThreshold = window.innerHeight * 0.4;

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    // --- Text Switching Logic ---
    if (slide1 && slide2) {
      if (scrollY > switchThreshold) {
        // Switch to Slide 2
        slide1.classList.remove('visible');
        slide1.classList.add('hidden');
        slide2.classList.remove('hidden');
        slide2.classList.add('visible');
      } else {
        // Revert to Slide 1
        slide2.classList.remove('visible');
        slide2.classList.add('hidden');
        slide1.classList.remove('hidden');
        slide1.classList.add('visible');
      }
    }

    // --- Content Fade-in Logic (for non-hero elements) ---
    document.querySelectorAll('.card').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        el.classList.add('visible');
      }
    });
  });
});

// Three.js Logic
let spherePoints;
let sphereLines;
let originalPositions; // Target positions (Sphere)
let randomPositions;   // Start positions (Scattered)
let renderer;
let scene;
let camera;

function initThreeJS() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // --- Geometry Setup ---
  // High detail Icosahedron for more particles
  const baseGeometry = new THREE.IcosahedronGeometry(3, 2);
  const count = baseGeometry.attributes.position.count;

  // Store original (target) positions
  originalPositions = Float32Array.from(baseGeometry.attributes.position.array);

  // Create random start positions
  randomPositions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    randomPositions[i * 3] = (Math.random() - 0.5) * 15; // Spread X
    randomPositions[i * 3 + 1] = (Math.random() - 0.5) * 15; // Spread Y
    randomPositions[i * 3 + 2] = (Math.random() - 0.5) * 15; // Spread Z
  }

  // Create BufferGeometry for manipulation
  const geometry = new THREE.BufferGeometry();
  // Start with Random positions
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(randomPositions), 3));

  // --- 1. Lines (Wireframe) ---
  // Convert Icosahedron to LineSegments geometry logic roughly or just use Wireframe on Mesh?
  // Mesh is easier for Wireframe, but we need to share the transformed buffer.
  // We can create a Mesh and update its geometry.position too.

  // Actually, simplest way: Just use POINTS and LINES as separate objects sharing the SAME attributes?
  // No, LineSegments expects index-based topology. IcosahedronGeometry has it.

  // Let's copy the Index from baseGeometry
  geometry.setIndex(baseGeometry.getIndex());

  // Material for Wireframe (Hidden initially)
  const lineMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    wireframe: true,
    transparent: true,
    opacity: 0 // Start invisible
  });
  sphereLines = new THREE.Mesh(geometry, lineMaterial);
  scene.add(sphereLines);

  // --- 2. Points (Particles) ---
  const pointMaterial = new THREE.PointsMaterial({
    color: 0x333333, // Darker dots
    size: 0.08,
    transparent: true,
    opacity: 0.8
  });
  spherePoints = new THREE.Points(geometry, pointMaterial);
  scene.add(spherePoints);

  // Animation Loop
  animate();

  // Resize Handler
  window.addEventListener('resize', onWindowResize);
  // Mouse Handler
  window.addEventListener('mousemove', onMouseMove);
}

function animate() {
  requestAnimationFrame(animate);

  if (!sphereLines || !spherePoints) return;

  const scrollY = window.scrollY;
  // Morph completes by 2.0 screen heights (scroll = 2 * h)
  // Hero is 3.5h, Content appears at ~3.5h.
  // This leaves 1.5h of "Formed Sphere" state before content arrives.
  const animationDuration = window.innerHeight * 2.0;
  const rawProgress = Math.min(Math.max(scrollY / animationDuration, 0), 1);

  // Ease out the progress for smoother particle arrival
  const progress = 1 - Math.pow(1 - rawProgress, 3);

  // --- Morph Logic ---
  const positions = sphereLines.geometry.attributes.position.array;

  for (let i = 0; i < positions.length; i++) {
    // Lerp: Start + (Target - Start) * progress
    positions[i] = randomPositions[i] + (originalPositions[i] - randomPositions[i]) * progress;
  }
  sphereLines.geometry.attributes.position.needsUpdate = true;

  // --- Opacity Logic ---
  // Lines: Fade in as shape forms (start ~30%, full ~80%)
  if (progress > 0.3) {
    sphereLines.material.opacity = (progress - 0.3) * 1.4; // 0.3->0, 1.0->~1.0
  } else {
    sphereLines.material.opacity = 0;
  }

  // --- Rotation Logic ---
  // Rotate slowly always
  const time = Date.now() * 0.0002;
  sphereLines.rotation.y = time;
  spherePoints.rotation.y = time;

  // Scroll rotation boost
  sphereLines.rotation.x = scrollY * 0.0005;
  spherePoints.rotation.x = scrollY * 0.0005;

  // Mouse tilt
  sphereLines.rotation.x += mouseY * 0.05;
  sphereLines.rotation.y += mouseX * 0.05;
  spherePoints.rotation.x += mouseY * 0.05;
  spherePoints.rotation.y += mouseX * 0.05;

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function onWindowResize() {
  if (camera && renderer) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Recalculate Thresholds on resize if needed, though they use window.innerHeight dynamicallly
  }
}

let mouseX = 0;
let mouseY = 0;
function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}
