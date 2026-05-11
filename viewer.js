import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class RobotViewer {
    constructor() {
        this.container = document.getElementById('robot-viewer-root');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.init();
    }

    init() {
        // Renderer Setup
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Camera Position
        this.camera.position.set(0, 1.2, 4);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0x007aff, 50);
        spotLight.position.set(5, 5, 5);
        this.scene.add(spotLight);

        const pointLight = new THREE.PointLight(0xffffff, 30);
        pointLight.position.set(-5, 3, 2);
        this.scene.add(pointLight);

        // Grid Helper (Minimalist)
        const grid = new THREE.GridHelper(10, 20, 0x333333, 0x222222);
        this.scene.add(grid);

        // Robot Model (Procedural Humanoid)
        this.createRobot();

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.0;
        this.controls.enableZoom = true;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 6;

        // Hide Loading Overlay
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            }, 1000);
        }

        // Handle Resize
        window.addEventListener('resize', () => this.onResize());

        // Start Animation Loop
        this.animate();
    }

    createRobot() {
        const robotGroup = new THREE.Group();
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xcccccc, 
            shininess: 100,
            specular: 0x111111 
        });
        const jointMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const emissiveMaterial = new THREE.MeshPhongMaterial({ color: 0x007aff, emissive: 0x007aff, emissiveIntensity: 2 });

        // Torso
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.2), material);
        torso.position.y = 1.2;
        robotGroup.add(torso);

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), material);
        head.position.y = 1.6;
        robotGroup.add(head);

        // Visor (Glowing blue)
        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.1), emissiveMaterial);
        visor.position.set(0, 1.62, 0.08);
        robotGroup.add(visor);

        // Arms (Simplified)
        const armGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.5);
        const lArm = new THREE.Mesh(armGeom, material);
        lArm.position.set(-0.3, 1.25, 0);
        lArm.rotation.z = Math.PI / 12;
        robotGroup.add(lArm);

        const rArm = new THREE.Mesh(armGeom, material);
        rArm.position.set(0.3, 1.25, 0);
        rArm.rotation.z = -Math.PI / 12;
        robotGroup.add(rArm);

        // Legs
        const legGeom = new THREE.CylinderGeometry(0.05, 0.04, 0.7);
        const lLeg = new THREE.Mesh(legGeom, material);
        lLeg.position.set(-0.15, 0.5, 0);
        robotGroup.add(lLeg);

        const rLeg = new THREE.Mesh(legGeom, material);
        rLeg.position.set(0.15, 0.5, 0);
        robotGroup.add(rLeg);

        this.scene.add(robotGroup);
    }

    onResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on Load
window.addEventListener('load', () => {
    new RobotViewer();
});
