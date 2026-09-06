import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { 
  X, 
  Compass, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Video, 
  Gauge, 
  Navigation, 
  Wind, 
  ShieldAlert, 
  Activity,
  Layers,
  Plane
} from "lucide-react";
import { Flight } from "../types";
import { playCockpitSound } from "../utils";

interface Cockpit3DModalProps {
  flight: Flight | null;
  onClose: () => void;
  onFocusOnMap?: (flight: Flight) => void;
}

type CameraViewMode = "cockpit" | "chase" | "wing" | "top";

export const Cockpit3DModal: React.FC<Cockpit3DModalProps> = ({ flight, onClose, onFocusOnMap }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<CameraViewMode>("cockpit");
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pitchDeg, setPitchDeg] = useState(0);
  const [rollDeg, setRollDeg] = useState(0);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const aircraftGroupRef = useRef<THREE.Group | null>(null);
  const rotorRef = useRef<THREE.Mesh | null>(null);
  const cloudGroupRef = useRef<THREE.Group | null>(null);
  const groundGridRef = useRef<THREE.GridHelper | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const isMouseDownRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const orbitAnglesRef = useRef({ theta: 0, phi: 0.2, radius: 45 });

  if (!flight) return null;

  const isMilitary = flight.category === "military" || flight.aircraft_type === "F35" || flight.aircraft_type === "F22" || flight.aircraft_type === "EF2000" || flight.aircraft_type === "B2";
  const isHelicopter = flight.category === "helicopter" || flight.aircraft_type === "H145" || flight.aircraft_type === "EC135" || flight.aircraft_type === "UH60" || flight.aircraft_type === "AH64";
  const isCargo = flight.category === "cargo";

  const altFt = flight.alt || 30000;
  const speedKnots = flight.speed_knots || Math.round(flight.speed / 1.852) || 450;
  const heading = flight.dir || 0;
  const vspeed = flight.vspeed || 0;
  const mach = flight.mach || (speedKnots / 661.47);

  // Setup Three.js 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Sky gradient background based on altitude
    const skyColor = altFt > 40000 ? 0x050a18 : altFt > 20000 ? 0x0c1e3d : 0x14284b;
    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.FogExp2(skyColor, 0.0035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.5, 3000);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x112233, 1.2);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 2.0);
    sunLight.position.set(100, 200, 150);
    scene.add(sunLight);

    // 5. Ground Grid / Oceanic Surface
    const gridHelper = new THREE.GridHelper(2000, 80, 0x00f0ff, 0x002f4d);
    gridHelper.position.y = -80;
    scene.add(gridHelper);
    groundGridRef.current = gridHelper;

    // 6. Volumetric Cloud Layer
    const cloudGroup = new THREE.Group();
    const cloudGeo = new THREE.DodecahedronGeometry(18, 1);
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      flatShading: true
    });

    for (let i = 0; i < 40; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set(
        (Math.random() - 0.5) * 1200,
        -20 + (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 1200
      );
      cloud.scale.set(1.5 + Math.random() * 2, 0.6 + Math.random() * 0.5, 1.5 + Math.random() * 2);
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);
    cloudGroupRef.current = cloudGroup;

    // 7. 3D Aircraft Construction
    const aircraft = new THREE.Group();

    if (isMilitary) {
      // Delta-Wing Stealth Fighter Mesh
      const bodyGeo = new THREE.ConeGeometry(3, 18, 6);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x242830, roughness: 0.3, metalness: 0.8 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 2;
      aircraft.add(body);

      // Wings
      const wingGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        0, 0, 4,
        -12, 0, -6,
        0, 0, -4,
        0, 0, 4,
        0, 0, -4,
        12, 0, -6
      ]);
      wingGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      wingGeo.computeVertexNormals();
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x1f232b, roughness: 0.4, metalness: 0.7, side: THREE.DoubleSide });
      const wings = new THREE.Mesh(wingGeo, wingMat);
      aircraft.add(wings);

      // Twin Tail Fins
      const tailGeo = new THREE.BoxGeometry(0.3, 4, 3);
      const tailMat = new THREE.MeshStandardMaterial({ color: 0x181c22, roughness: 0.4 });
      const leftTail = new THREE.Mesh(tailGeo, tailMat);
      leftTail.position.set(-2, 2, -6);
      leftTail.rotation.z = -0.25;
      const rightTail = new THREE.Mesh(tailGeo, tailMat);
      rightTail.position.set(2, 2, -6);
      rightTail.rotation.z = 0.25;
      aircraft.add(leftTail);
      aircraft.add(rightTail);

      // Afterburner Engine Glow
      const burnerGeo = new THREE.CylinderGeometry(0.8, 1.1, 2, 16);
      const burnerMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const burner = new THREE.Mesh(burnerGeo, burnerMat);
      burner.rotation.x = Math.PI / 2;
      burner.position.set(0, 0, -9.5);
      aircraft.add(burner);

    } else if (isHelicopter) {
      // Helicopter Fuselage & Rotor
      const fuseGeo = new THREE.SphereGeometry(3.5, 16, 12);
      fuseGeo.scale(1, 1.1, 2.2);
      const fuseMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3, metalness: 0.6 });
      const fuse = new THREE.Mesh(fuseGeo, fuseMat);
      aircraft.add(fuse);

      // Tail Boom
      const boomGeo = new THREE.CylinderGeometry(0.5, 0.9, 12, 8);
      const boomMat = new THREE.MeshStandardMaterial({ color: 0x047857 });
      const boom = new THREE.Mesh(boomGeo, boomMat);
      boom.rotation.x = Math.PI / 2;
      boom.position.set(0, 0.8, -9);
      aircraft.add(boom);

      // Main Rotor Blades
      const bladeGeo = new THREE.BoxGeometry(24, 0.1, 0.8);
      const bladeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
      const rotor = new THREE.Mesh(bladeGeo, bladeMat);
      rotor.position.set(0, 4.2, 0);
      aircraft.add(rotor);
      rotorRef.current = rotor;

      // Skids
      const skidGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 6);
      const skidMat = new THREE.MeshStandardMaterial({ color: 0x374151 });
      const leftSkid = new THREE.Mesh(skidGeo, skidMat);
      leftSkid.rotation.x = Math.PI / 2;
      leftSkid.position.set(-2.2, -3.2, 0);
      const rightSkid = new THREE.Mesh(skidGeo, skidMat);
      rightSkid.rotation.x = Math.PI / 2;
      rightSkid.position.set(2.2, -3.2, 0);
      aircraft.add(leftSkid);
      aircraft.add(rightSkid);

    } else {
      // Commercial Airliner / Heavy Cargo Fuselage
      const fuseGeo = new THREE.CylinderGeometry(2.4, 2.4, 28, 20);
      const fuseMat = new THREE.MeshStandardMaterial({ 
        color: isCargo ? 0x4b5563 : 0xf1f5f9, 
        roughness: 0.2, 
        metalness: 0.3 
      });
      const fuse = new THREE.Mesh(fuseGeo, fuseMat);
      fuse.rotation.x = Math.PI / 2;
      aircraft.add(fuse);

      // Nose Cone
      const noseGeo = new THREE.ConeGeometry(2.4, 5, 20);
      const noseMat = new THREE.MeshStandardMaterial({ color: isCargo ? 0x374151 : 0xe2e8f0 });
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.rotation.x = -Math.PI / 2;
      nose.position.set(0, 0, 16.5);
      aircraft.add(nose);

      // Main Swept Wings
      const wingGeo = new THREE.BoxGeometry(38, 0.4, 6);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3 });
      const wings = new THREE.Mesh(wingGeo, wingMat);
      wings.position.set(0, -0.4, 1);
      wings.rotation.z = 0.05;
      aircraft.add(wings);

      // Turbofan Jet Engines
      const engineGeo = new THREE.CylinderGeometry(1.2, 1.2, 5, 16);
      const engineMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
      const leftEngine = new THREE.Mesh(engineGeo, engineMat);
      leftEngine.rotation.x = Math.PI / 2;
      leftEngine.position.set(-7, -2.2, 2);
      const rightEngine = new THREE.Mesh(engineGeo, engineMat);
      rightEngine.rotation.x = Math.PI / 2;
      rightEngine.position.set(7, -2.2, 2);
      aircraft.add(leftEngine);
      aircraft.add(rightEngine);

      // Tail Fin (Vertical Stabilizer)
      const tailFinGeo = new THREE.BoxGeometry(0.3, 7, 5);
      const tailFinMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
      const tailFin = new THREE.Mesh(tailFinGeo, tailFinMat);
      tailFin.position.set(0, 5, -12);
      tailFin.rotation.x = -0.3;
      aircraft.add(tailFin);
    }

    scene.add(aircraft);
    aircraftGroupRef.current = aircraft;

    // Cockpit Window Frame Overlay (Three.js 3D Canopy HUD Geometry)
    const canopyGeo = new THREE.RingGeometry(1.5, 1.8, 4);
    const canopyMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 1.2, 11);
    aircraft.add(canopy);

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Spin helicopter rotor
      if (rotorRef.current) {
        rotorRef.current.rotation.y += delta * 25;
      }

      // Move clouds backwards to simulate forward aircraft airspeed
      if (cloudGroupRef.current) {
        const speedScale = (speedKnots / 400) * 80 * delta;
        cloudGroupRef.current.position.z -= speedScale;
        if (cloudGroupRef.current.position.z < -400) {
          cloudGroupRef.current.position.z = 400;
        }
      }

      // Ground grid motion
      if (groundGridRef.current) {
        groundGridRef.current.position.z = (groundGridRef.current.position.z - (speedKnots / 400) * 100 * delta) % 40;
      }

      // Dynamic Pitch & Roll calculation based on vertical speed and turning
      const targetPitch = vspeed > 200 ? 5.5 : vspeed < -200 ? -4.2 : (Math.sin(elapsed * 0.5) * 0.6);
      const targetRoll = Math.sin(elapsed * 0.3) * 2.2;
      setPitchDeg(targetPitch);
      setRollDeg(targetRoll);

      if (aircraftGroupRef.current) {
        aircraftGroupRef.current.rotation.x = THREE.MathUtils.degToRad(targetPitch);
        aircraftGroupRef.current.rotation.z = THREE.MathUtils.degToRad(-targetRoll);
        aircraftGroupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.4;
      }

      // Camera Positioning depending on selected ViewMode
      if (cameraRef.current && aircraftGroupRef.current) {
        const acPos = aircraftGroupRef.current.position;

        if (viewMode === "cockpit") {
          // Inside pilot cockpit looking out the front window
          cameraRef.current.position.set(0, acPos.y + 1.2, 10.5);
          cameraRef.current.lookAt(0, acPos.y + 1.2 + Math.tan(THREE.MathUtils.degToRad(targetPitch)), 80);
        } else if (viewMode === "chase") {
          // 3D Orbital Chase Cam
          const { theta, phi, radius } = orbitAnglesRef.current;
          const x = acPos.x + radius * Math.sin(theta) * Math.cos(phi);
          const y = acPos.y + radius * Math.sin(phi) + 8;
          const z = acPos.z - radius * Math.cos(theta) * Math.cos(phi);
          cameraRef.current.position.set(x, y, z);
          cameraRef.current.lookAt(acPos.x, acPos.y + 1, acPos.z);
        } else if (viewMode === "wing") {
          // Left Wing Mount Camera
          cameraRef.current.position.set(acPos.x - 18, acPos.y + 2, acPos.z + 2);
          cameraRef.current.lookAt(acPos.x, acPos.y, acPos.z + 15);
        } else if (viewMode === "top") {
          // Overhead Satellite View
          cameraRef.current.position.set(acPos.x, acPos.y + 65, acPos.z);
          cameraRef.current.lookAt(acPos.x, acPos.y, acPos.z + 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Audio SFX on entry
    playCockpitSound(isHelicopter ? "engine_rotor" : "engine_jet", isMuted);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      renderer.dispose();
    };
  }, [viewMode, flight.hex, isMilitary, isHelicopter, isCargo, speedKnots, vspeed, altFt]);

  // Mouse Orbit Controls for Chase Camera
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || viewMode !== "chase") return;
    const deltaX = e.clientX - mousePosRef.current.x;
    const deltaY = e.clientY - mousePosRef.current.y;
    mousePosRef.current = { x: e.clientX, y: e.clientY };

    orbitAnglesRef.current.theta -= deltaX * 0.008;
    orbitAnglesRef.current.phi = Math.max(0.05, Math.min(Math.PI / 2.2, orbitAnglesRef.current.phi + deltaY * 0.008));
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (viewMode !== "chase") return;
    orbitAnglesRef.current.radius = Math.max(15, Math.min(120, orbitAnglesRef.current.radius + e.deltaY * 0.05));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className={`relative w-full h-full ${isFullscreen ? '' : 'max-w-7xl max-h-[92vh] m-4 rounded-2xl border border-cyan-500/30'} bg-slate-950 overflow-hidden flex flex-col shadow-2xl shadow-cyan-950/50`}>
        
        {/* Top Cockpit Telemetry Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isMilitary ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : isHelicopter ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}`}>
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white tracking-wider">{flight.flight_iata || flight.flight_number || flight.hex}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  isMilitary ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' :
                  isHelicopter ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' :
                  isCargo ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' :
                  'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {flight.category || "commercial"}
                </span>
                <span className="text-xs text-slate-400 font-mono">[{flight.aircraft_model || flight.aircraft_type || "AIRCRAFT"}]</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{flight.dep_iata || "DEP"} &rarr; {flight.arr_iata || "ARR"}</span>
                <span>&bull;</span>
                <span className="text-cyan-400 font-mono">HDG {heading.toString().padStart(3, '0')}&deg;</span>
                <span>&bull;</span>
                <span className="text-amber-400 font-mono">SQK {flight.squawk || "1200"}</span>
              </div>
            </div>
          </div>

          {/* Camera View Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode("cockpit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "cockpit" 
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              COCKPIT POV
            </button>
            <button
              onClick={() => setViewMode("chase")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "chase" 
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              3D CHASE CAM
            </button>
            <button
              onClick={() => setViewMode("wing")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "wing" 
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              WING CAM
            </button>
            <button
              onClick={() => setViewMode("top")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "top" 
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-black" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              TOP VIEW
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                playCockpitSound("chime", false);
              }}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title={isMuted ? "Unmute Cockpit Audio" : "Mute Cockpit Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 border border-rose-500/30 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D WebGL Canvas Viewport */}
        <div 
          ref={mountRef} 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
        >
          {/* Glass Cockpit HUD Overlay (Electronic Primary Flight Display) */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            
            {/* Top Autopilot FMA Flight Mode Annunciator */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-950/70 border border-cyan-500/40 backdrop-blur-md shadow-lg shadow-cyan-950/50">
                <span className="text-[11px] font-mono font-bold text-emerald-400 animate-pulse">CMD 1</span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] font-mono font-bold text-cyan-300">LNAV</span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] font-mono font-bold text-cyan-300">VNAV PATH</span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] font-mono font-bold text-emerald-300">ALT CRZ FL{Math.round(altFt / 100)}</span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] font-mono font-bold text-amber-300">A/T ARM</span>
              </div>
            </div>

            {/* Center Artificial Horizon & Pitch Ladder HUD */}
            <div className="relative flex items-center justify-between my-auto w-full max-w-4xl mx-auto px-4">
              
              {/* Left Rolling Airspeed Tape */}
              <div className="flex flex-col items-center bg-slate-950/80 border border-cyan-500/50 rounded-xl p-3 w-28 backdrop-blur-md shadow-xl">
                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">AIRSPEED</span>
                <div className="text-2xl font-black font-mono text-white tracking-tight my-1">
                  {speedKnots} <span className="text-xs font-normal text-cyan-300">KT</span>
                </div>
                <div className="text-[11px] font-mono text-amber-400 font-bold">
                  M {mach.toFixed(2)}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-cyan-400 h-full transition-all" 
                    style={{ width: `${Math.min(100, (speedKnots / 600) * 100)}%` }} 
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">{flight.speed} KM/H GS</span>
              </div>

              {/* Center Electronic Artificial Horizon (Pitch/Roll Ladder) */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Roll Angle Arc */}
                <div 
                  className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 flex items-center justify-center transition-transform duration-75"
                  style={{ transform: `rotate(${-rollDeg}deg)` }}
                >
                  <div className="w-full h-0.5 bg-cyan-400/80 shadow-[0_0_8px_cyan]" />
                  <div className="absolute top-2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-6 border-b-amber-400" />
                  {/* Pitch Ladder Lines */}
                  <div className="absolute flex flex-col items-center gap-4 text-[10px] font-mono text-cyan-300 font-bold">
                    <span className="opacity-80">+10 &mdash;&mdash; +10</span>
                    <span className="opacity-60">+05 &mdash;&mdash; +05</span>
                    <span className="text-amber-400 font-black">--- 00 ---</span>
                    <span className="opacity-60">-05 &mdash;&mdash; -05</span>
                    <span className="opacity-80">-10 &mdash;&mdash; -10</span>
                  </div>
                </div>

                {/* Fixed Aircraft Boresight Reference */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="w-8 h-1 bg-amber-400 rounded-sm shadow-[0_0_8px_orange]" />
                  <div className="w-3 h-3 rounded-full border-2 border-amber-400 bg-amber-400/40 mx-1 shadow-[0_0_8px_orange]" />
                  <div className="w-8 h-1 bg-amber-400 rounded-sm shadow-[0_0_8px_orange]" />
                </div>
              </div>

              {/* Right Rolling Altitude Tape */}
              <div className="flex flex-col items-center bg-slate-950/80 border border-cyan-500/50 rounded-xl p-3 w-28 backdrop-blur-md shadow-xl">
                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">ALTITUDE</span>
                <div className="text-2xl font-black font-mono text-white tracking-tight my-1">
                  {altFt.toLocaleString()} <span className="text-xs font-normal text-cyan-300">FT</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  FL{Math.round(altFt / 100)}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full transition-all" 
                    style={{ width: `${Math.min(100, (altFt / 45000) * 100)}%` }} 
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  V/S {vspeed > 0 ? `+${vspeed}` : vspeed} FPM
                </span>
              </div>
            </div>

            {/* Bottom Heading Rose & Navigation Bar */}
            <div className="flex items-center justify-between w-full max-w-5xl mx-auto px-4 bg-slate-950/80 border border-slate-800 rounded-xl p-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">HEADING</span>
                  <span className="text-lg font-mono font-black text-cyan-300">{heading.toString().padStart(3, '0')}&deg; MAG</span>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">DISTANCE REMAINING</span>
                  <span className="text-lg font-mono font-black text-white">{flight.distance_remaining_km?.toLocaleString() || 1200} KM</span>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">EST. TIME EN ROUTE</span>
                  <span className="text-lg font-mono font-black text-amber-300">{flight.eta_minutes || 65} MIN</span>
                </div>
              </div>

              {/* Category-Specific Tactical Data */}
              {isMilitary && (
                <div className="flex items-center gap-3 bg-rose-950/40 border border-rose-500/40 px-3 py-1 rounded-lg">
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                  <div className="text-xs font-mono text-rose-300 font-bold">
                    G-FORCE: <span className="text-white font-black">{flight.g_force || 1.2}G</span> &bull; MACH {mach.toFixed(2)} &bull; RADAR LOCK
                  </div>
                </div>
              )}

              {isHelicopter && (
                <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/40 px-3 py-1 rounded-lg">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <div className="text-xs font-mono text-emerald-300 font-bold">
                    ROTOR RPM: <span className="text-white font-black">{flight.rotor_rpm || 410}</span> &bull; HOVER CEILING: 18,000 FT
                  </div>
                </div>
              )}

              {onFocusOnMap && (
                <button
                  onClick={() => onFocusOnMap(flight)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all pointer-events-auto shadow-md shadow-cyan-500/30"
                >
                  <Navigation className="w-4 h-4" />
                  TRACK ON RADAR MAP
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
