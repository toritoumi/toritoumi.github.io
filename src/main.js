import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 150, 5000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

camera.position.z = 0;


const backgroundUniverseGeometry = new THREE.BufferGeometry();
const vertices = [];

for (let i=0;i<10000;i++){
    vertices.push(THREE.MathUtils.randFloatSpread(2000));
    vertices.push(THREE.MathUtils.randFloatSpread(2000));
    vertices.push(THREE.MathUtils.randFloatSpread(2000));
}

backgroundUniverseGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const particles = new THREE.Points(backgroundUniverseGeometry, new THREE.PointsMaterial({color:0xffffff}));

scene.add(particles);


class myCube extends THREE.Mesh{
    constructor(){
        super()
        this.geometry = new THREE.BoxGeometry(130,130,130);
        const loader = new THREE.TextureLoader();
        const textures = [
            './textures/texture1.jpg',
            './textures/texture2.jpg',
            './textures/texture3.jpg'
        ];
        const materials = [];
        for (let i=0;i<3;i++){
            for (let k=0;k<2;k++){
                materials.push(new THREE.MeshBasicMaterial({map:loader.load(textures[i%3])}));
            }
        }
        this.material = materials;
        this.cubeActive = false;
        const rotationSpeed = 0.008;
        this.rotationSpeed = rotationSpeed;
        this.position.z=-500;
    }
    render(){
        this.rotation.x += this.rotationSpeed;
        this.rotation.y += this.rotationSpeed;
    }
    onPointerOver(e){
        this.scale.set(1.3,1.3,1.3);
        this.rotationSpeed = Math.random() * (0.05 - 0.02) + 0.02;
    }
    onPointerOut(e){
        this.scale.set(1,1,1);
        this.rotationSpeed = 0.008;
    }
    onClick(e){
        window.location.href='https://github.com/toritoumi'
    }
}

const cube = new myCube();
scene.add(cube)


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let intersects = []
let hovered = {};

window.addEventListener('pointermove', (e) => {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
    intersects = raycaster.intersectObjects(scene.children, true)

    // If a previously hovered item is not among the hits we must call onPointerOut
    Object.keys(hovered).forEach((key) => {
        const hit = intersects.find((hit) => hit.object.uuid === key)
        if (hit === undefined) {
            const hoveredItem = hovered[key]
        if (hoveredItem.object.onPointerOver) hoveredItem.object.onPointerOut(hoveredItem)
            delete hovered[key]
        }
    })

    intersects.forEach((hit) => {
      // If a hit has not been flagged as hovered we must call onPointerOver
    if (!hovered[hit.object.uuid]) {
        hovered[hit.object.uuid] = hit
        if (hit.object.onPointerOver) hit.object.onPointerOver(hit)
    }
      // Call onPointerMove
    if (hit.object.onPointerMove) hit.object.onPointerMove(hit)
    })
})



window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}, false);

var controls = new DragControls([cube], camera, renderer.domElement);

const draggingObject = [];

controls.addEventListener('drag', (event)=>{
    if (draggingObject.length != 0) {
        var exists = false;
        draggingObject.forEach((uuid)=>{
            if (event.object.uuid == uuid) exists = true;
        })
        if (exists == false) draggingObject.push(event.object.uuid);
    } else {
        draggingObject.push(event.object.uuid)
    }
    //console.log(draggingObject)
})

controls.addEventListener('dragend', (e)=>{
    setTimeout(
        ()=>{
            draggingObject.pop(0)
        },500
    )
})


window.addEventListener('click', (e) => {
    //console.log(e)
    //console.log(draggingObject)
    intersects.forEach((hit) => {
        var exists = false;
        draggingObject.forEach((uuid)=>{
            if (hit.object.uuid == uuid) exists = true;
        })
        if (exists == false){
            // Call onClick
            if (hit.object.onClick) hit.object.onClick(hit)
        }
    })
})

window.addEventListener('keydown',(event)=>{
    //console.log(event)
    if (event.key == 'Enter' & event.shiftKey == true) {
        const newcube = new myCube()
        newcube.position.set(Math.random()*800 -400,Math.random()*500-250,-500)
        scene.add(newcube)
        const objects=controls.getObjects()
        objects.push(newcube)
        controls = new DragControls(objects,camera,renderer.domElement)
    }
    if (event.code == 'KeyD' & event.shiftKey == true){
        scene.remove(scene.children[1])
    }
})



const animate = function () {
    render();
	renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

const render = function () {
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;

    scene.traverse((obj) => {
        if (obj.render) obj.render()
    })

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects(scene.children);
    //console.log(intersects);
    const hovered = [];
    if (intersects){
        intersects.forEach((elem) => {if (elem.object.isMesh) hovered.push(elem);});
    }
}

animate();