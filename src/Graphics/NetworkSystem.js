import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

/**
 * Initializes all the necessary THREE.js objects
 * @param canvas reference to the canvas dom element
 * @param width canvas width
 * @param height canvas height
 * @param numV number of vertices of the network to add to the scene
 */
export function createNetworkSystem(canvas, width, height, numV){
    const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true});
    renderer.setSize(width, height);
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1);
    camera.aspect = width/height;
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(1,1,2);
    camera.add(pointLight);
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(width/2, height/2, Math.max(height/2, width/2));
    camera.position.set(width/2, height/2, 1.7 *  Math.max(height, width));
    controls.update();

    const nodeScene = createNodesInScene(camera, numV, width, height);


    return {
        renderer: renderer,
        camera: camera,
        pointLight: pointLight,
        controls: controls,
        scene: nodeScene.scene,
        nodes: nodeScene.nodes,
    };
}

/**
 *
 * @param camera THREE.js camera for our scene
 * @param numV number of vertices to create in the network
 * @param width width of the canvas
 * @param height height of the canvas
 * @returns {{nodes: THREE.Points, scene: THREE.Scene}}
 */
export function createNodesInScene(camera, numV, width, height){
    const scene = new THREE.Scene();
    scene.add(camera);

    const systemGeometry = new THREE.BufferGeometry();
    const vertices = []
    const z = Math.max(width, height);
    for(let i = 0; i < numV; i++){
        vertices.push(Math.random() * width);
        vertices.push(Math.random() * height);
        vertices.push(Math.random() * z);
    }
    console.log(vertices);
    const elements = new Float32Array(vertices);
    systemGeometry.setAttribute("position", new THREE.BufferAttribute(elements, 3));
    const material = new THREE.PointsMaterial({color: 0xffffff, size: 3});
    const nodes = new THREE.Points(systemGeometry, material);
    scene.add(nodes);

    return {scene: scene, nodes: nodes};
}