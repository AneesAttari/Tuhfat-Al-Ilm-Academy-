import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { COURSES } from '../../data/courses';
import { LearningDestination, TimeOfDay } from './types';
import {
  createUniverseMaterials,
  createCentralPlaza,
  createDestinationPavilion,
  createCypressTree,
  createPalmTree,
  createPathwayMesh,
  UniverseMaterials
} from './geometryBuilders';

interface LearningUniverseStageProps {
  timeOfDay: TimeOfDay;
  selectedDestinationId: string | null;
  onSelectDestination: (dest: LearningDestination | null) => void;
  onSceneReady?: () => void;
  onError?: (err: string) => void;
  qualityLevel?: 'high' | 'balanced' | 'low';
}

const DESTINATION_CONFIGS = [
  { slug: 'quran-reading', arabic: 'القراءة والناظرة', color: '#064E3B', tagline: 'Alphabet recognition, Qaida & fluid Quran reading' },
  { slug: 'hifz-ul-quran', arabic: 'حفظ القرآن الكريم', color: '#047857', tagline: 'Structured memorization with daily revision & Sabaq' },
  { slug: 'tajweed', arabic: 'تجويد وقراءة', color: '#0D9488', tagline: 'Makharij, Sifaat & classical melodious recitation' },
  { slug: 'quran-translation', arabic: 'ترجمة القرآن وتفسيره', color: '#0284C7', tagline: 'Word-for-word vocabulary & contextual understanding' },
  { slug: 'islamic-studies', arabic: 'الدراسات الإسلامية', color: '#0F766E', tagline: 'Aqeedah, Fiqh, Seerah & prophetic wisdom' },
  { slug: 'basic-islamic-knowledge', arabic: 'أساسيات المعرفة الإسلامية', color: '#059669', tagline: 'Step-by-step Salah (Namaz), Wudu & obligations' },
  { slug: 'islah-character-development', arabic: 'إصلاح النفس والأخلاق', color: '#D97706', tagline: 'Islamic Adab, patience, humility & family values' },
  { slug: 'dua-and-sunnah', arabic: 'الأدعية والسنن اليومية', color: '#B45309', tagline: 'Daily protection Adhkar & prophetic habits' },
  { slug: 'childrens-islamic-education', arabic: 'تعليم الأطفال الإسلامي', color: '#10B981', tagline: 'Joyful, patient 1-on-1 learning for young hearts' }
];

// Pre-allocated math helpers to ensure ZERO Garbage Collection in render loop
const _vec3 = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _camPos = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

export const LearningUniverseStage: React.FC<LearningUniverseStageProps> = ({
  timeOfDay,
  selectedDestinationId,
  onSelectDestination,
  onSceneReady,
  onError,
  qualityLevel = 'high'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredDestId, setHoveredDestId] = useState<string | null>(null);

  // References to keep mutable state out of React re-render cycles
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Lighting references for day/evening transitions
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const lanternLightsRef = useRef<THREE.PointLight[]>([]);

  // Destinations lookup and 3D hitboxes
  const destinationsRef = useRef<LearningDestination[]>([]);
  const hitboxesRef = useRef<{ mesh: THREE.Mesh; dest: LearningDestination }[]>([]);
  const beaconRingsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const fountainParticlesRef = useRef<THREE.Points | null>(null);
  const ambientMotesRef = useRef<THREE.Points | null>(null);

  // Camera interpolation state
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 22, 38));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const isTransitioningCam = useRef<boolean>(false);

  // Build Learning Destinations array from real course data
  useEffect(() => {
    const list: LearningDestination[] = [];
    const total = DESTINATION_CONFIGS.length;
    const radius = 22; // radial distance from central courtyard

    DESTINATION_CONFIGS.forEach((cfg, idx) => {
      const course = COURSES.find((c) => c.slug === cfg.slug || c.id === cfg.slug);
      const angle = (idx * Math.PI * 2) / total - Math.PI / 2; // start from top (North)

      list.push({
        id: cfg.slug,
        courseId: course ? course.id : cfg.slug,
        courseSlug: cfg.slug,
        title: course ? course.name : cfg.slug,
        arabicTitle: cfg.arabic,
        category: course ? course.category : 'Academy Program',
        tagline: course ? course.shortDesc : cfg.tagline,
        iconName: course ? course.iconName : 'BookOpen',
        angle,
        distance: radius,
        accentColor: cfg.color,
        courseData: course
      });
    });

    destinationsRef.current = list;
  }, []);

  // Update target camera position when selection changes
  useEffect(() => {
    if (!selectedDestinationId) {
      // Overview perspective: high angle showing entire courtyard and surrounding pavilions
      targetCamPos.current.set(0, 22, 38);
      targetLookAt.current.set(0, 2.5, 0);
      isTransitioningCam.current = true;
      return;
    }

    const dest = destinationsRef.current.find((d) => d.id === selectedDestinationId);
    if (dest) {
      const destX = Math.cos(dest.angle) * dest.distance;
      const destZ = Math.sin(dest.angle) * dest.distance;

      // Position camera slightly back and above the destination, angled toward it
      const offsetDist = 7.5;
      const camX = destX + Math.cos(dest.angle) * offsetDist;
      const camZ = destZ + Math.sin(dest.angle) * offsetDist;
      const camY = 5.2;

      targetCamPos.current.set(camX, camY, camZ);
      targetLookAt.current.set(destX, 2.8, destZ);
      isTransitioningCam.current = true;
    }
  }, [selectedDestinationId]);

  // Handle Day / Evening lighting transitions
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current) return;
    const isEvening = timeOfDay === 'evening';

    // Target colors and intensities
    const sunColor = isEvening ? 0x93C5FD : 0xFFF7ED;
    const sunIntensity = isEvening ? 0.35 : 1.35;
    const hemiSky = isEvening ? 0x1E293B : 0xDBEAFE;
    const hemiGround = isEvening ? 0x064E3B : 0x2D5A43;
    const hemiIntensity = isEvening ? 0.35 : 0.85;
    const bgColor = isEvening ? 0x090F1E : 0xF3EFE6;
    const fogColor = isEvening ? 0x0C1427 : 0xF5EFEB;
    const fogDensity = isEvening ? 0.016 : 0.009;

    if (keyLightRef.current) {
      keyLightRef.current.color.setHex(sunColor);
      keyLightRef.current.intensity = sunIntensity;
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.color.setHex(hemiSky);
      hemiLightRef.current.groundColor.setHex(hemiGround);
      hemiLightRef.current.intensity = hemiIntensity;
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = isEvening ? 0.2 : 0.55;
    }

    sceneRef.current.background = new THREE.Color(bgColor);
    sceneRef.current.fog = new THREE.FogExp2(fogColor, fogDensity);

    // Turn pavilion lanterns on or off
    lanternLightsRef.current.forEach((light) => {
      light.intensity = isEvening ? 2.2 : 0.0;
    });
  }, [timeOfDay]);

  // Main Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      if (onError) onError('WebGL is not supported on this browser or hardware.');
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const isEvening = timeOfDay === 'evening';
    scene.background = new THREE.Color(isEvening ? 0x090F1E : 0xF3EFE6);
    scene.fog = new THREE.FogExp2(isEvening ? 0x0C1427 : 0xF5EFEB, isEvening ? 0.016 : 0.009);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.5, 300);
    camera.position.set(0, 22, 38);
    camera.lookAt(0, 2.5, 0);
    cameraRef.current = camera;

    // 3. Renderer with ACES Filmic Tone Mapping and SRGB Color Space
    const isMobile = window.innerWidth < 768;
    const maxPixelRatio = isMobile || qualityLevel === 'low' ? 1.25 : Math.min(window.devicePixelRatio, 2.0);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: qualityLevel !== 'low'
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(maxPixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Shadows configuration
    if (qualityLevel !== 'low') {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    container.appendChild(renderer.domElement);

    // 4. Procedural Studio Reflection Map via RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback cleanly if PMREM fails in constrained sandbox
    }

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 2.5, 0);
    controls.minDistance = 7;
    controls.maxDistance = 60;
    controls.minPolarAngle = Math.PI / 12;
    controls.maxPolarAngle = Math.PI / 2.08; // Clamp so camera never dips beneath ground
    controls.enablePan = true;

    // 6. Balanced Lighting Rig
    // Warm Key Light (Directional with orthographic shadow bounds)
    const keyLight = new THREE.DirectionalLight(0xFFF7ED, 1.35);
    keyLight.position.set(24, 38, 20);
    if (qualityLevel !== 'low') {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = isMobile ? 1024 : 2048;
      keyLight.shadow.mapSize.height = isMobile ? 1024 : 2048;
      keyLight.shadow.camera.near = 10;
      keyLight.shadow.camera.far = 85;
      const d = 32;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0004;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0xDBEAFE, 0x2D5A43, 0.85);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Soft Rim Light from behind
    const rimLight = new THREE.DirectionalLight(0xFEF3C7, 0.55);
    rimLight.position.set(-20, 25, -25);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // 7. Materials and Procedural Architecture
    const materials = createUniverseMaterials();

    // Ground Terrain (Rich Mediterranean / Islamic Garden Turf)
    const groundGeo = new THREE.CircleGeometry(65, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMesh = new THREE.Mesh(groundGeo, materials.groundGrass);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Subtle Outer Garden Stone Enclosure Balustrade (Perimeter Wall)
    const wallGeo = new THREE.TorusGeometry(48, 0.45, 8, 48);
    wallGeo.rotateX(Math.PI / 2);
    wallGeo.translate(0, 0.4, 0);
    const wallMesh = new THREE.Mesh(wallGeo, materials.creamStone);
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);

    // 8. Central Plaza and Tiered Fountain
    const { group: plazaGroup, waterMesh } = createCentralPlaza(materials);
    scene.add(plazaGroup);
    waterMeshRef.current = waterMesh;

    // 9. Procedural Destination Pavilions and Radiating Pathways
    const hitboxes: { mesh: THREE.Mesh; dest: LearningDestination }[] = [];
    const lanternLights: THREE.PointLight[] = [];
    const beaconMap = new Map<string, THREE.Mesh>();

    const centerVec = new THREE.Vector3(0, 0, 0);

    destinationsRef.current.forEach((dest) => {
      const { group: pavGroup, hitBox, beaconRing, lanternLight } = createDestinationPavilion(
        materials,
        dest.accentColor,
        dest.title
      );

      const px = Math.cos(dest.angle) * dest.distance;
      const pz = Math.sin(dest.angle) * dest.distance;
      pavGroup.position.set(px, 0, pz);

      // Rotate pavilion to face the central fountain gracefully
      pavGroup.rotation.y = -dest.angle + Math.PI / 2;
      scene.add(pavGroup);

      // Pathway connecting center plaza to this pavilion
      const destPos = new THREE.Vector3(px, 0, pz);
      const path = createPathwayMesh(materials, centerVec, destPos, 2.5);
      scene.add(path);

      hitboxes.push({ mesh: hitBox, dest });
      lanternLights.push(lanternLight);
      beaconMap.set(dest.id, beaconRing);
    });

    hitboxesRef.current = hitboxes;
    lanternLightsRef.current = lanternLights;
    beaconRingsRef.current = beaconMap;

    // 10. Landscaping: Cypress Trees and Date Palms along Garden Walkways
    const treeGroup = new THREE.Group();
    // Plant trees along mid-radii between pavilions
    const numTrees = 18;
    for (let i = 0; i < numTrees; i++) {
      const ang = (i * Math.PI * 2) / numTrees + 0.15;
      const r = 16 + (i % 2 === 0 ? 0 : 12);
      const tx = Math.cos(ang) * r;
      const tz = Math.sin(ang) * r;

      if (i % 3 === 0) {
        const palm = createPalmTree(materials, 6.5 + (i % 2) * 1.5);
        palm.position.set(tx, 0, tz);
        treeGroup.add(palm);
      } else {
        const cypress = createCypressTree(materials, 0.85 + (i % 4) * 0.15);
        cypress.position.set(tx, 0, tz);
        cypress.rotation.y = Math.random() * Math.PI * 2;
        treeGroup.add(cypress);
      }
    }
    scene.add(treeGroup);

    // 11. Subtle Fountain Water Droplet Particles
    const fountainCount = isMobile ? 60 : 120;
    const fountainGeo = new THREE.BufferGeometry();
    const fountainPos = new Float32Array(fountainCount * 3);
    const fountainVels: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < fountainCount; i++) {
      fountainPos[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      fountainPos[i * 3 + 1] = 4.2 + Math.random() * 0.2;
      fountainPos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      const spreadAng = Math.random() * Math.PI * 2;
      const spreadSpeed = 0.4 + Math.random() * 0.8;
      fountainVels.push({
        x: Math.cos(spreadAng) * spreadSpeed,
        y: 2.2 + Math.random() * 1.6,
        z: Math.sin(spreadAng) * spreadSpeed
      });
    }
    fountainGeo.setAttribute('position', new THREE.BufferAttribute(fountainPos, 3));
    const fountainMat = new THREE.PointsMaterial({
      color: 0x99F6E4,
      size: 0.2,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const fountainParticles = new THREE.Points(fountainGeo, fountainMat);
    scene.add(fountainParticles);
    fountainParticlesRef.current = fountainParticles;

    // 12. Ambient Light Motes / Evening Fireflies
    const moteCount = isMobile ? 50 : 120;
    const moteGeo = new THREE.BufferGeometry();
    const motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePos[i * 3 + 0] = (Math.random() - 0.5) * 60;
      motePos[i * 3 + 1] = 1.0 + Math.random() * 9.0;
      motePos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0xFDE68A,
      size: 0.35,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const ambientMotes = new THREE.Points(moteGeo, moteMat);
    scene.add(ambientMotes);
    ambientMotesRef.current = ambientMotes;

    // Pre-warm shaders so navigation doesn't stutter
    renderer.compile(scene, camera);

    if (onSceneReady) onSceneReady();

    // 13. Main Animation Loop (Using THREE.Clock with delta damping)
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Smooth Camera Transitions with exponential damping
      if (isTransitioningCam.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 3.2, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 3.2, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 3.2, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLookAt.current.x, 3.8, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLookAt.current.y, 3.8, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLookAt.current.z, 3.8, delta);

        // Stop transition when close enough
        if (
          camera.position.distanceTo(targetCamPos.current) < 0.15 &&
          controls.target.distanceTo(targetLookAt.current) < 0.15
        ) {
          isTransitioningCam.current = false;
        }
      }

      controls.update();

      // Animate Fountain Spray
      if (fountainParticlesRef.current) {
        const positions = fountainParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < fountainCount; i++) {
          const idx = i * 3;
          fountainVels[i].y -= 4.2 * delta; // gravity
          positions[idx + 0] += fountainVels[i].x * delta;
          positions[idx + 1] += fountainVels[i].y * delta;
          positions[idx + 2] += fountainVels[i].z * delta;

          // Recycle when hitting the water pool
          if (positions[idx + 1] < 1.05) {
            positions[idx + 0] = (Math.random() - 0.5) * 0.2;
            positions[idx + 1] = 4.2;
            positions[idx + 2] = (Math.random() - 0.5) * 0.2;

            const spreadAng = Math.random() * Math.PI * 2;
            const spreadSpeed = 0.5 + Math.random() * 0.9;
            fountainVels[i].x = Math.cos(spreadAng) * spreadSpeed;
            fountainVels[i].y = 2.4 + Math.random() * 1.5;
            fountainVels[i].z = Math.sin(spreadAng) * spreadSpeed;
          }
        }
        fountainParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Animate Central Pool Water Shimmer
      if (waterMeshRef.current) {
        waterMeshRef.current.rotation.z = elapsed * 0.04;
      }

      // Gentle Ambient Motes Drift
      if (ambientMotesRef.current) {
        ambientMotesRef.current.rotation.y = elapsed * 0.02;
      }

      // Pulse beacon rings for hovered/selected destinations
      beaconRingsRef.current.forEach((ring, destId) => {
        const isHovered = destId === hoveredDestId;
        const isSelected = destId === selectedDestinationId;
        const mat = ring.material as THREE.MeshBasicMaterial;

        if (isSelected) {
          mat.opacity = 0.75 + Math.sin(elapsed * 4.0) * 0.2;
          mat.color.setHex(0xE2BA49);
          ring.scale.setScalar(1.05 + Math.sin(elapsed * 3.0) * 0.03);
        } else if (isHovered) {
          mat.opacity = 0.65;
          mat.color.setHex(0x10B981);
          ring.scale.setScalar(1.02);
        } else {
          mat.opacity = 0.25;
          mat.color.setHex(0xD9B44A);
          ring.scale.setScalar(1.0);
        }
      });

      renderer.render(scene, camera);
    };

    animFrameId.current = requestAnimationFrame(animate);

    // 14. Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 15. Raycasting for Mouse Hover and Clicks
    let pointerMoveTimer: number | null = null;
    const handlePointerMove = (e: MouseEvent) => {
      if (pointerMoveTimer) return;
      pointerMoveTimer = window.setTimeout(() => {
        pointerMoveTimer = null;
        if (!container || !camera) return;
        const rect = container.getBoundingClientRect();
        _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        _raycaster.setFromCamera(_mouse, camera);
        const hitMeshes = hitboxesRef.current.map((h) => h.mesh);
        const intersects = _raycaster.intersectObjects(hitMeshes, false);

        if (intersects.length > 0) {
          const hit = hitboxesRef.current.find((h) => h.mesh === intersects[0].object);
          if (hit) {
            setHoveredDestId(hit.dest.id);
            container.style.cursor = 'pointer';
            return;
          }
        }
        setHoveredDestId(null);
        container.style.cursor = 'default';
      }, 35);
    };

    const handleClick = (e: MouseEvent) => {
      if (!container || !camera) return;
      const rect = container.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const hitMeshes = hitboxesRef.current.map((h) => h.mesh);
      const intersects = _raycaster.intersectObjects(hitMeshes, false);

      if (intersects.length > 0) {
        const hit = hitboxesRef.current.find((h) => h.mesh === intersects[0].object);
        if (hit) {
          onSelectDestination(hit.dest);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // 16. WebGL Context Loss Safety
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };

    const handleContextRestored = () => {
      handleResize();
    };

    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    // 17. Cleanup on Unmount
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      controls.dispose();

      // Deep disposal of scene geometries and materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [qualityLevel, onSceneReady, onError, onSelectDestination]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#FAF9F5]">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Destination Hover Tooltip (Appears when hovering a pavilion) */}
      {hoveredDestId && !selectedDestinationId && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-20 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 text-white shadow-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E2BA49]" />
            <div className="text-left">
              <p className="text-xs font-bold leading-tight">
                {destinationsRef.current.find((d) => d.id === hoveredDestId)?.title}
              </p>
              <p className="text-[11px] text-emerald-300 font-arabic">
                {destinationsRef.current.find((d) => d.id === hoveredDestId)?.arabicTitle}
              </p>
            </div>
            <span className="text-[10px] text-slate-300 pl-2 border-l border-white/20">Click to enter</span>
          </div>
        </div>
      )}
    </div>
  );
};
