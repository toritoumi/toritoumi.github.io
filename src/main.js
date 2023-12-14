import * as THREE from 'three';

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


const boxGeometry = new THREE.BoxGeometry(130,130,130);
const loader = new THREE.TextureLoader();

const textures = [
    './textures/texture1.jpg',
    './textures/texture2.jpg',
    './textures/texture3.jpg'
];

const boxMaterials = [];

for (let i=0;i<3;i++){
    for (let k=0;k<2;k++){
        boxMaterials.push(new THREE.MeshBasicMaterial({map:loader.load(textures[i%3]),side:THREE.DoubleSide}));
    }
}

const box = new THREE.Mesh(boxGeometry,boxMaterials);

box.position.z = -500;

scene.add(box);


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onClickBox(){
    window.location.href = './about.html';
}


window.addEventListener('pointermove', onPointerMove);
window.addEventListener('resize', onWindowResize,false);
window.addEventListener('click', function () {
    const intersects = raycaster.intersectObjects(scene.children,true);
    if (intersects.length == 2) onClickBox();
})

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

const animate = function () {
    render();
	renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

const render = function () {
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;

    box.rotation.x += 0.008;
    box.rotation.y += 0.008;

    raycaster.setFromCamera( pointer, camera );
}


animate();