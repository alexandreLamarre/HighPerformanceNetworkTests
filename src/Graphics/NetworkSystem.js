import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

/**
 * Initializes all the necessary THREE.js objects
 * @param canvas reference to the canvas dom element
 * @param width canvas width
 * @param height canvas height
 * @param numV number of vertices of the network to add to the scene
 * @param numE number of edges of the network to add to the scene
 */
export function createNetworkSystem(canvas, width, height, numV, numE){
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

    const nodeScene = createNodesInScene(camera, numV, numE, width, height);
    const rayCaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    //creating a highlight cursor

    const cursorGeometry = new THREE.SphereGeometry(5, 4,4);
    const cursorMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );

    const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    cursor.visible = false;

    nodeScene.scene.add(cursor);

    return {
        renderer: renderer,
        camera: camera,
        pointLight: pointLight,
        controls: controls,
        scene: nodeScene.scene,
        nodes: nodeScene.nodes,
        connections: nodeScene.connections,
        raycaster: rayCaster,
        pointer: pointer,
        cursor: cursor,
    };
}

/**
 *
 * @param camera THREE.js camera for our scene
 * @param numV number of vertices to create in the network
 * @param numE number of edges to create in the network
 * @param width width of the canvas
 * @param height height of the canvas
 * @returns {{nodes: THREE.Points, connections: THREE.Line, scene: THREE.Scene}}
 */
export function createNodesInScene(camera, numV, numE, width, height){
    const scene = new THREE.Scene();
    scene.add(camera);

    const systemGeometry = new THREE.BufferGeometry();
    const vertices = [];
    const color = new THREE.Color();
    let colors = [];
    console.time("vertices js");
    for(let i = 0; i < numV; i++){
        const x = Math.random() * width; const y = Math.random() * height;
        const z = Math.random() * Math.max(height,width);
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);

        const vx = (x / width);
        const vy = (y / height);
        const vz = (z / Math.max(height, width));

        color.setRGB(vx, vy, vz);

        colors.push(color.r, color.g, color.b);
    }
    console.timeEnd("vertices js");
    const elements = new Float32Array(vertices);


    systemGeometry.setAttribute("position", new THREE.Float32BufferAttribute(elements, 3));
    systemGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({vertexColors: true, size: 5});
    const nodes = new THREE.Points(systemGeometry, material);
    nodes.geometry.computeBoundingSphere();
    nodes.geometry.computeBoundingBox();
    scene.add(nodes);

    console.time("edges js");
    const connectionGeometry = new THREE.BufferGeometry();
    const edges = [];
    colors = []
    for(let i = 0; i < numE; i++){
        const vStart = Math.floor(Math.random()*numV);
        const vEnd = Math.floor(Math.random()*numV);
        edges.push(nodes.geometry.attributes.position.array[3 * vStart]);
        edges.push(nodes.geometry.attributes.position.array[3 * vStart + 1]);
        edges.push(nodes.geometry.attributes.position.array[3 * vStart + 2]);
        edges.push(nodes.geometry.attributes.position.array[3 * vEnd]);
        edges.push(nodes.geometry.attributes.position.array[3 * vEnd + 1]);
        edges.push(nodes.geometry.attributes.position.array[3 * vEnd + 2]);

        color.setRGB(
            nodes.geometry.attributes.color.array[3 * vStart],
            nodes.geometry.attributes.color.array[3 * vStart + 1],
            nodes.geometry.attributes.color.array[3 * vStart + 2]
            );

        colors.push(color.r, color.g, color.b);

        color.setRGB(
            nodes.geometry.attributes.color.array[3 * vStart],
            nodes.geometry.attributes.color.array[3 * vStart + 1],
            nodes.geometry.attributes.color.array[3 * vStart + 2]
        );

        colors.push(
            nodes.geometry.attributes.color.array[3 * vEnd],
            nodes.geometry.attributes.color.array[3 * vEnd + 1],
            nodes.geometry.attributes.color.array[3 * vEnd + 2]
        )
    }
    console.timeEnd("edges js");

    const elements2 = new Float32Array(edges);

    connectionGeometry.setAttribute("position", new THREE.Float32BufferAttribute(elements2, 3));
    connectionGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const material2 = new THREE.MeshBasicMaterial({vertexColors: true, transparent: true, opacity: 0.3});
    const connections = new THREE.Line(connectionGeometry, material2);
    connections.geometry.computeBoundingSphere();
    connections.geometry.computeBoundingBox();
    scene.add(connections);


    return {scene: scene, nodes: nodes, connections: connections};
}