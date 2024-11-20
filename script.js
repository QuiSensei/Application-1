// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// Import Stats.js
import Stats from "https://cdn.skypack.dev/stats.js";
// Used for creating complex animations and transitions
import { gsap } from "https://cdn.skypack.dev/gsap@3.12.5";
// Lightweight GUI for web development
import * as dat from "https://cdn.skypack.dev/lil-gui@0.16.0";

// GUI position and color parameters
const parameters = {
  scaleX: 1, // Default scale value for X axis
  scaleY: 1, // Default scale value for Y axis
  scaleZ: 1, // Default scale value for Z axis
  color: 0x4242f5,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};

const transparencyControl = {
  transparent: false, // Toggle transparency
  opacity: 1.0, // Default opacity value
  face: "Front", // Default face (options: "Front", "Back", "Double"),
};

// GUI text parameters
const shapes = {
  shape: "Cube", // Default shape is "Cube"
};

const spinControl = {
  isSpinning: false, // Toggle spinning
  spinSpeed: 0.01, // Default spin speed
};

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => console.log("loading started");
loadingManager.onLoad = () => console.log("loading finished");
loadingManager.onProgress = () => console.log("loading progressing");
loadingManager.onError = () => console.log("loading error");

const textureLoader = new THREE.TextureLoader(loadingManager);
const space = textureLoader.load("./Textures/texture.jpg");
space.generateMipmaps = false;
space.minFilter = THREE.NearestFilter;
space.magFilter = THREE.NearestFilter;

const earth = textureLoader.load("./Textures/texture2.jpg")

const ambientOcclusion = textureLoader.load(
  "./Metal_Mesh/Metal_Mesh_002_ambientOcclusion.jpg"
);
ambientOcclusion.generateMipmaps = false;
ambientOcclusion.minFilter = THREE.NearestFilter;
ambientOcclusion.magFilter = THREE.NearestFilter;

const baseColor = textureLoader.load(
  "./Metal_Mesh/Metal_Mesh_002_basecolor.jpg"
);
baseColor.generateMipmaps = false;
baseColor.minFilter = THREE.NearestFilter;
baseColor.magFilter = THREE.NearestFilter;

const height = textureLoader.load(
  "./Metal_Mesh/Metal_Mesh_002_height.png"
);
height.generateMipmaps = false;
height.minFilter = THREE.NearestFilter;
height.magFilter = THREE.NearestFilter;

const metallic = textureLoader.load(
  "./Metal_Mesh/Metal_Mesh_002_metallic.jpg"
);
metallic.generateMipmaps = false;
metallic.minFilter = THREE.NearestFilter;
metallic.magFilter = THREE.NearestFilter;

const normal = textureLoader.load(
  "./Metal_Mesh/Metal_Mesh_002_normal.jpg"
);
normal.generateMipmaps = false;
normal.minFilter = THREE.NearestFilter;
normal.magFilter = THREE.NearestFilter;

const opacity = textureLoader.load(
  "./Metal_Mesh/Metal_Mesh_002_opacity.jpg"
);
opacity.generateMipmaps = false;
opacity.minFilter = THREE.NearestFilter;
opacity.magFilter = THREE.NearestFilter;

const roughness = textureLoader.load(
  "./Metal_Mesh/Metal_Mesh_002_roughness.jpg"
);
roughness.generateMipmaps = false;
roughness.minFilter = THREE.NearestFilter;
roughness.magFilter = THREE.NearestFilter;

// Texture Options
const textureOptions = {
  Space: space,
  Earth: earth,
  Ambient_Occlusion: ambientOcclusion,
  Base_Color: baseColor,
  Height: height,
  Metallic: metallic,
  Normal: normal,
  Opacity: opacity,
  Roughness: roughness,
};

let canvas;

let scene, camera, renderer;

let currentTextureKey;

let geometry, material, mesh;

let sizes, controls;

let stats;

init();
animate();
GUIs();

function init() {
  // Canvas
  canvas = document.querySelector("canvas.webgl");

  // Scene
  scene = new THREE.Scene();

  // Scene backgroundColor
  scene.background = new THREE.Color(0xf68002);

  currentTextureKey = "Space";

  // Object
  geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

  // Material
  material = new THREE.MeshBasicMaterial({
    // color: parameters.color,
    map: space,
  });

  // Mesh
  mesh = new THREE.Mesh(geometry, material);

  // Add to scene
  scene.add(mesh);

  // Sizes
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Window resize
  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Window fullscreen
  window.addEventListener("dblclick", () => {
    const fullscreenElement =
      document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
      // Request fullscreen
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  });

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);
  camera.lookAt(mesh.position);
  scene.add(camera);

  // Control camera
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Render
  renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Initialize Stats.js
  stats = new Stats();
  document.body.appendChild(stats.dom); // Append the stats panel to the DOM
}

function GUIs() {
  // Instantiate Dat.GUI:
  const gui = new dat.GUI();
  gui.close(); //Close the folder of control folder

  // Object position Y and X
  const positionFolder = gui.addFolder("Position");
  positionFolder
    .add(mesh.position, "y")
    .min(-3)
    .max(3)
    .step(0.01)
    .name("Vertical");
  positionFolder
    .add(mesh.position, "x")
    .min(-3)
    .max(3)
    .step(0.01)
    .name("Horizontal");
  positionFolder.close(); // Close the folder of positionFolder

  // Object scale X, Y, and Z
  const scaleFolder = gui.addFolder("Scale");
  scaleFolder
    .add(parameters, "scaleX")
    .min(0.1)
    .max(3)
    .step(0.01)
    .name("Scale X")
    .onChange((value) => {
      mesh.scale.set(value, mesh.scale.y, mesh.scale.z);
    });
  scaleFolder
    .add(parameters, "scaleY")
    .min(0.1)
    .max(3)
    .step(0.01)
    .name("Scale Y")
    .onChange((value) => {
      mesh.scale.set(mesh.scale.x, value, mesh.scale.z);
    });
  scaleFolder
    .add(parameters, "scaleZ")
    .min(0.1)
    .max(10)
    .step(0.05)
    .name("Scale Z")
    .onChange((value) => {
      mesh.scale.set(mesh.scale.x, mesh.scale.y, value);
    });
  scaleFolder.close(); // Close the folder of scaleFolder

  const transparencyFolder = gui.addFolder("Transparency & Face View");
  transparencyFolder
    .add(transparencyControl, "transparent")
    .name("Enable Transparency")
    .onChange((value) => {
      material.transparent = value;
      material.needsUpdate = true;
    });
  transparencyFolder
    .add(transparencyControl, "opacity")
    .min(0.1)
    .max(1.0)
    .step(0.1)
    .name("Opacity")
    .onChange((value) => {
      material.opacity = value;
    });
  transparencyFolder
    .add(transparencyControl, "face", ["Front", "Back", "Double"])
    .name("Select Face")
    .onChange((value) => {
      switch (value) {
        case "Front":
          material.side = THREE.FrontSide;
          break;
        case "Back":
          material.side = THREE.BackSide;
          break;
        case "Double":
          material.side = THREE.DoubleSide;
          break;
      }
      material.needsUpdate = true; // Update material
    });
  transparencyFolder.close();

  // Objects Shape, Texture, Visibility, Color
  const shapesVisibilityColor = gui.addFolder(
    "Shape, Texture, Visibility, Color"
  );
  // Object selector for shape
  shapesVisibilityColor
    .add(shapes, "shape", ["Cube", "Sphere", "Torus"])
    .name("Select Shape")
    .onChange((value) => {
      changeShape(value);
    });
  // Object texture
  shapesVisibilityColor
    .add({ texture: currentTextureKey }, "texture", Object.keys(textureOptions))
    .name("Select Texture")
    .onChange((textureKey) => changeTexture(textureKey));
  // Object visibility
  shapesVisibilityColor.add(mesh, "visible");
  // Object wire frame
  shapesVisibilityColor.add(material, "wireframe");
  // Object color picker
  shapesVisibilityColor.addColor(parameters, "color").onChange(() => {
    material.color.set(parameters.color);
  });
  // Spin the object
  shapesVisibilityColor.add(parameters, "spin").name("Spin");
  shapesVisibilityColor.close(); // Close the folder of shapesVisibilityColor

  const spinFolder = gui.addFolder("Animation");
  spinFolder.add(spinControl, "isSpinning").name("Enable Spin");
  spinFolder
    .add(spinControl, "spinSpeed")
    .min(0.01)
    .max(0.1)
    .step(0.01)
    .name("Spin Speed");
  spinFolder.close();

  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "h":
        // Toggle control visibility with 'h'
        gui._hidden ? gui.show() : gui.hide();
        break;

      case "w":
        // Toggle wireframe visibility with 'w'
        material.wireframe = !material.wireframe;
        break;

      case "v":
        // Toggle visibility with 'v'
        mesh.visible = !mesh.visible;
        break;

      case "1":
        changeShape("Cube");
        break;

      case "2":
        changeShape("Sphere");
        break;

      case "3":
        changeShape("Torus");
        break;
    }
  });

  function changeShape(shape) {
    // Dispose of the old geometry
    mesh.geometry.dispose();

    // Update geometry based on the selected shape
    if (shape === "Cube") {
      mesh.geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    } else if (shape === "Sphere") {
      mesh.geometry = new THREE.SphereGeometry(1, 32, 32);
    } else if (shape === "Torus") {
      mesh.geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    }
  }

  function changeTexture(textureKey) {
    currentTextureKey = textureKey;
    material.map = textureOptions[textureKey];
    material.needsUpdate = true;
  }
}

function animate() {
  const clock = new THREE.Clock();

  // This is your main animation loop
  const elapsedTime = clock.getElapsedTime();

  // Apply spinning if enabled
  if (spinControl.isSpinning) {
    mesh.rotation.y += spinControl.spinSpeed; // Rotate along the Y-axis
  }

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);

  // Update stats in the animation loop
  stats.update(); // This updates the stats panel with the latest FPS and other metrics

  // Request the next frame to keep the animation going
  window.requestAnimationFrame(animate);
}
