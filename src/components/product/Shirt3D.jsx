'use client'

import { useEffect, useRef, memo, useCallback, Suspense } from 'react'
import { useProducts } from '../../hooks/useProducts'

function Shirt3D({
    src = '/models/t_shirt.glb',
    width = 500,
    height = 500
}) {
    // Use optimized store selectors
    const { selectedColor, modelSize } = useProducts()

    const mountRef = useRef(null)
    const sceneRef = useRef(null)
    const rendererRef = useRef(null)
    const animationRef = useRef(null)
    const modelRef = useRef(null)
    const cameraRef = useRef(null)
    const controlsRef = useRef(null)

    // Memoized color update function
    const updateModelColor = useCallback((model, color) => {
        if (!model) return

        model.traverse((child) => {
            if (child.isMesh && child.material) {
                // Reuse existing material instead of cloning
                if (!child.userData.originalMaterial) {
                    child.userData.originalMaterial = child.material
                }
                child.material.color.setStyle(color)
                child.material.needsUpdate = true
            }
        })
    }, [])

    // Memoized model size update function
    const updateModelSize = useCallback(async (model, size) => {
        if (!model) return
        const sizeScaleMap = {
            1: 1.5, 2: 1.7, 3: 1.9, 4: 2.0, 5: 2.2, 6: 2.4, 7: 2.7
        }
        const scale = sizeScaleMap[size] || 2.0
        
        const THREE = await import('three')
        
        // Apply scale
        model.scale.setScalar(scale)
        
        // Recenter after scaling
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)
    }, [])

    // Memoized fallback geometry creation
    const createFallbackShirt = useCallback((THREE, color, scale) => {
        const shirtGroup = new THREE.Group()

        // Main body
        const bodyGeometry = new THREE.BoxGeometry(2, 2.5, 0.3)
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: color,
            flatShading: false
        })
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
        body.castShadow = true
        body.receiveShadow = true
        shirtGroup.add(body)

        // Sleeves
        const sleeveGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1, 8)
        const sleeveMaterial = new THREE.MeshPhongMaterial({
            color: color,
            flatShading: false
        })

        const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial)
        leftSleeve.position.set(-1.2, 0.5, 0)
        leftSleeve.rotation.z = Math.PI / 2
        leftSleeve.castShadow = true
        leftSleeve.receiveShadow = true
        shirtGroup.add(leftSleeve)

        const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial)
        rightSleeve.position.set(1.2, 0.5, 0)
        rightSleeve.rotation.z = -Math.PI / 2
        rightSleeve.castShadow = true
        rightSleeve.receiveShadow = true
        shirtGroup.add(rightSleeve)

        shirtGroup.scale.setScalar(scale)
        shirtGroup.position.set(0, -0.5, 0)
        return shirtGroup
    }, [])

    // Initialize Three.js scene
    useEffect(() => {
        if (!mountRef.current || typeof window === 'undefined') return

        let isMounted = true
        let loadedModel = null

        const initThreeJS = async () => {
            if (!isMounted) return

            try {
                const THREE = await import('three')
                const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader')
                const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls')

                // Clear previous content
                if (mountRef.current) {
                    mountRef.current.innerHTML = ''
                }

                // === Scene setup ===
                const scene = new THREE.Scene()
                scene.background = new THREE.Color(0xf5f5f5)
                sceneRef.current = scene

                // === Camera setup ===
                const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
                camera.position.set(0, 0, 3)
                cameraRef.current = camera

                // === Renderer setup ===
                const renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                })
                renderer.setSize(width, height)
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
                renderer.shadowMap.enabled = true
                renderer.shadowMap.type = THREE.PCFSoftShadowMap
                rendererRef.current = renderer
                mountRef.current.appendChild(renderer.domElement)

                // === Controls ===
                const controls = new OrbitControls(camera, renderer.domElement)
                controls.enableDamping = true
                controls.dampingFactor = 0.05
                controls.autoRotate = true
                controls.autoRotateSpeed = 1.5
                controls.enablePan = false
                controls.minDistance = 2
                controls.maxDistance = 6
                controlsRef.current = controls

                // === Lights ===
                const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
                hemiLight.position.set(0, 20, 0)
                scene.add(hemiLight)

                const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
                dirLight.position.set(3, 10, 5)
                dirLight.castShadow = true
                dirLight.shadow.mapSize.width = 1024
                dirLight.shadow.mapSize.height = 1024
                dirLight.shadow.camera.near = 0.5
                dirLight.shadow.camera.far = 50
                scene.add(dirLight)

                // === Load model ===
                const loader = new GLTFLoader()

                // Try local model first, then external
                const tryLoadModel = (modelUrl) => {
                    return new Promise((resolve, reject) => {
                        loader.load(
                            modelUrl,
                            (gltf) => resolve(gltf),
                            undefined,
                            (error) => reject(error)
                        )
                    })
                }

                // Load model with fallback strategy
                const loadModel = async () => {
                    try {
                        let gltf

                        // First try the provided source
                        if (src.startsWith('/')) {
                            // Local model
                            gltf = await tryLoadModel(src)
                        } else {
                            // External URL - try direct load, fallback to local on CORS error
                            try {
                                gltf = await tryLoadModel(src)
                            } catch (corsError) {
                                console.warn('CORS blocked external model, trying local fallback:', corsError.message)
                                // Try local t-shirt model as fallback
                                gltf = await tryLoadModel('/models/t_shirt.glb')
                            }
                        }

                        if (!isMounted) return

                        const model = gltf.scene.clone()
                        loadedModel = model

                        // Set initial size
                        const sizeScaleMap = {
                            1: 1.5, 2: 1.7, 3: 1.9, 4: 2.0, 5: 2.2, 6: 2.4, 7: 2.7
                        }
                        model.scale.setScalar(sizeScaleMap[modelSize] || 2.0)

                        // Center the model
                        const box = new THREE.Box3().setFromObject(model)
                        const center = box.getCenter(new THREE.Vector3())
                        model.position.sub(center)

                        // Apply color and shadows
                        model.traverse((child) => {
                            if (child.isMesh && child.material) {
                                child.material = child.material.clone()
                                child.material.color.setStyle(selectedColor)
                                child.castShadow = true
                                child.receiveShadow = true
                            }
                        })

                        modelRef.current = model
                        scene.add(model)
                    } catch (error) {
                        console.error('All model loading attempts failed:', error.message)
                        if (!isMounted) return

                        // Create fallback geometry
                        const sizeScaleMap = {
                            1: 1.5, 2: 1.7, 3: 1.9, 4: 2.0, 5: 2.2, 6: 2.4, 7: 2.7
                        }
                        const fallbackModel = createFallbackShirt(THREE, selectedColor, sizeScaleMap[modelSize] || 2.0)
                        modelRef.current = fallbackModel
                        scene.add(fallbackModel)
                    }
                }

                loadModel()

                // === Animation loop ===
                const animate = () => {
                    if (!isMounted) return
                    animationRef.current = requestAnimationFrame(animate)

                    if (controlsRef.current) {
                        controlsRef.current.update()
                    }

                    if (rendererRef.current && sceneRef.current && cameraRef.current) {
                        rendererRef.current.render(sceneRef.current, cameraRef.current)
                    }
                }
                animate()

            } catch (error) {
                console.error('Error initializing Three.js:', error)
            }
        }

        initThreeJS()

        return () => {
            isMounted = false

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }

            if (rendererRef.current) {
                rendererRef.current.dispose()
            }

            if (controlsRef.current) {
                controlsRef.current.dispose()
            }

            if (mountRef.current) {
                mountRef.current.innerHTML = ''
            }
        }
    }, [src, width, height, createFallbackShirt])

    // Update color when selectedColor changes
    useEffect(() => {
        if (modelRef.current) {
            updateModelColor(modelRef.current, selectedColor)
        }
    }, [selectedColor, updateModelColor])

    // Update size when modelSize changes
    useEffect(() => {
        if (modelRef.current) {
            updateModelSize(modelRef.current, modelSize)
        }
    }, [modelSize, updateModelSize])

    return (
        <div
            ref={mountRef}
            style={{ width, height }}
            className="rounded-lg overflow-hidden bg-gray-50"
        />
    )
}

const MemoizedShirt3D = memo(Shirt3D);

export default function Shirt3DWithSuspense(props) {
  return (
    <Suspense fallback={<div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center"><span className="text-gray-500">Loading 3D model...</span></div>}>
      <MemoizedShirt3D {...props} />
    </Suspense>
  );
}