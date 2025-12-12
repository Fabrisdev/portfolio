import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

export const { renderer, scene, camera, plane, crayon } = await setup();

let renderCallback: (() => void) | null = null;

export function renderLoop(callback: () => void) {
	renderCallback = callback;
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (renderCallback !== null) {
		renderCallback();
	}
}

animate();

function loadModel(path: string): Promise<THREE.Group<THREE.Object3DEventMap>> {
	let m = null;
	const loader = new GLTFLoader();
	return new Promise((resolve, _) => {
		loader.load(path, (model) => {
			m = model.scene;
			resolve(m);
		});
	});
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
	const plane = await loadModel("/paper_plane.glb");
	scene.add(plane);
	const crayon = await loadModel("/crayon.glb");
	scene.add(crayon);

	return {
		renderer,
		scene,
		camera,
		plane,
		crayon,
	};
}
