import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 500, 10000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

camera.position.z = 100;

const backgroundUniverseGeometry = new THREE.BufferGeometry();
const vertices = [];

for (let i=0;i<10000;i++){
    vertices.push(THREE.MathUtils.randFloatSpread(2000));
    vertices.push(THREE.MathUtils.randFloatSpread(2000));
    vertices.push(THREE.MathUtils.randFloatSpread(2000));
}
backgroundUniverseGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const particles = new THREE.Points(backgroundUniverseGeometry, new THREE.PointsMaterial({color:0x888888}));

scene.add(particles);

window.addEventListener('resize', onWindowResize,false);

const animate = function () {
	requestAnimationFrame( animate );
    render();
	renderer.render( scene, camera );
}

const render = function () {
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

animate();