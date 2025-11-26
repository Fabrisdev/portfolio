import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

const fpsCounter = document.querySelector("#fps-counter");
const { _frames, _prevTime, renderer, scene, camera, plane } = await setup();
let frames = _frames;
let prevTime = _prevTime;
type Callback = (_plane: THREE.Group<THREE.Object3DEventMap>) => void;
let renderCallback: Callback | null = null;

export function renderLoop(
	callback: (_plane: THREE.Group<THREE.Object3DEventMap>) => void,
) {
	renderCallback = callback;
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (renderCallback !== null) {
		renderCallback(plane);
	}
	updateFpsCounter();
}

animate();

function loadPlane(): Promise<THREE.Group<THREE.Object3DEventMap>> {
	let plane = null;
	const loader = new GLTFLoader();
	return new Promise((resolve, _) => {
		loader.load("/paper_plane.glb", (model) => {
			plane = model.scene;
			resolve(plane);
		});
	});
}

function updateFpsCounter() {
	const time = performance.now();
	frames++;
	if (time >= prevTime + 1000) {
		const fps = Math.round((frames * 1000) / (time - prevTime));
		if (fpsCounter !== null) {
			fpsCounter.textContent = `${fps} FPS`;
		}

		frames = 0;
		prevTime = time;
	}
}

async function setup() {
	const container = document.querySelector("#paper-plane");
	if (container === null)
		throw new Error("Paper plane container not found. Unable to render plane");
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
		0.1,
		100,
	);
	camera.position.set(0, 1, 5);
	const renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	const light = new THREE.DirectionalLight();
	light.position.set(5, 5, 5);
	scene.add(light);
	const plane = await loadPlane();
	plane.scale.set(0.01, 0.01, 0.01);
	scene.add(plane);

	const frames = 0,
		prevTime = performance.now();
	return {
		_frames: frames,
		_prevTime: prevTime,
		renderer,
		scene,
		camera,
		plane,
	};
}
