import { lazyLoad } from './loadscreen.js'

import * as dat from 'dat.gui';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';


/* * * * * * * * * * * * * * * * * * * * */
/* * * * * * * Dat.GUI stuff * * * * * * */
/* * * * * * * * * * * * * * * * * * * * */


const guiKeys = {
  transform: {
    transformObjects: true,
    clearTransform: () => transformControls.detach(),
  },
  texture: {
    textureColor: '#000',
    dblClickPaint: true
  },
  display: {
    backgroundHDRI : false,
    wireframe: false,
    autoRotate: false,
    resetCamera: () => {
      orbitControls.target = new THREE.Vector3(0, 0, 0)

      orbitControls.minPolarAngle = Math.PI / 8
      orbitControls.maxPolarAngle = 1.5

      orbitControls.minDistance = 5
      orbitControls.maxDistance = 20

      camera.position.set(8, 12, 8)
    },
    backgroundColor : '#63aed2',
    highlightSelected: true,
    toggleFullScreen: () => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
      } else if(document.exitFullscreen){
        document.exitFullscreen();
      }
    }
  },
  hemi: {
    intensity: 1,
    skyColor: '#6a6a6a',
    groundColor: '#000'
  },
  ambient: {
    intensity: 1,
    color: '#6a6a6a'
  },
  point: {
    intensity: 1.5,
    color: '#6a6a6a',
    distance: 7
  },
  direct: {
    intensity: 1,
    color: '#fff',
    castShadows: true,
    shadowBias: -.003,
    shadowMapSizeWidth: 512,
    shadowMapSizeHeight: 512
  }
}


const gui = new dat.GUI()

const gui_objTransform = gui.addFolder('Transform Objects')
gui_objTransform.open()

const gui_paint = gui.addFolder('Texture Paint')
gui_paint.open()

const gui_camera = gui.addFolder('Camera')
gui_camera.open()

const gui_display = gui.addFolder('Display')

const gui_lights = gui.addFolder('Lights')

const gui_hemiLight = gui_lights.addFolder('Hemisphere Light')

const gui_ambientLight = gui_lights.addFolder('Ambient Light')

const gui_pointLight1 = gui_lights.addFolder('PointLight 1')

const gui_DirectLight1 = gui_lights.addFolder('DirectLight 1')


/* Transform Objects */
{

  const ctrl1 = gui_objTransform.add(guiKeys.transform, 'transformObjects')
  ctrl1.onChange(boolean => transformControls.detach())

  //

  gui_objTransform.add(guiKeys.transform, 'clearTransform')

}


/* Texture Paint */
{

  gui_paint.addColor(guiKeys.texture, 'textureColor')

  //

  gui_paint.add(guiKeys.texture, 'dblClickPaint')

}


/* Camera */
{

  gui_camera.add(guiKeys.display, 'resetCamera')

  //

  const ctrl1 = gui_camera.add(guiKeys.display, 'autoRotate')
  ctrl1.onChange(boolean => {
    if(boolean){
      orbitControls.autoRotate = true
      orbitControls.autoRotateSpeed = 6
    }else{
      orbitControls.autoRotate = false
    }
  })

  //

  const ctrl2 = gui_camera.add(guiKeys.display, 'highlightSelected')
  ctrl2.onChange(boolean => {
    if(!boolean){
      allModels.forEach(e => {
        e.material.transparent = false
        e.material.opacity = 1

        e.material.emissive
          ? e.material.emissive = {r: 0, g: 0, b: 0}
          : null
      })
    }
  })

}


/* Display */
{

  const ctrl1 = gui_display.add(guiKeys.display, 'backgroundHDRI')
  ctrl1.onChange(boolean => boolean ? renderer.autoClearColor = false : renderer.autoClearColor = true)

  //

  const ctrl2 = gui_display.addColor(guiKeys.display, 'backgroundColor')
  ctrl2.onChange(color => renderer.setClearColor(color, 1))

  //

  const ctrl3 = gui_display.add(guiKeys.display, 'wireframe')
  ctrl3.onChange(boolean => {
    if(boolean){
      scene.traverse(child => {
        if(child instanceof THREE.Mesh){
          child.material.wireframe = true
        }
      })
    }else{
      scene.traverse(child => {
        if(child instanceof THREE.Mesh){
          child.material.wireframe = false
        }
      })
    }
  })

  //

  gui_display.add(guiKeys.display, 'toggleFullScreen')

}


/* Hemisphere Light */
{

  const ctrl1 = gui_hemiLight.add(guiKeys.hemi, 'intensity', 0, 5, .1)
  ctrl1.onChange(number => hemiLight.intensity = number)

  //

  const ctrl2 = gui_hemiLight.addColor(guiKeys.hemi, 'skyColor', )
  ctrl2.onChange(color => hemiLight.color.set(color))

  //

  const ctrl3 = gui_hemiLight.addColor(guiKeys.hemi, 'groundColor', )
  ctrl3.onChange(color => hemiLight.groundColor.set(color))

}


/* Ambient Light*/
{

  const ctrl1 = gui_ambientLight.add(guiKeys.ambient, 'intensity', 0, 5, .1)
  ctrl1.onChange(number => ambientLight.intensity = number)

  //

  const ctrl2 = gui_ambientLight.addColor(guiKeys.ambient, 'color')
  ctrl2.onChange(color => ambientLight.color.set(color))

}


/* Point Light */
{

  const ctrl1 = gui_pointLight1.add(guiKeys.point, 'intensity', 0, 10, .1)
  ctrl1.onChange(number => pointLight1.intensity = number)

  //

  const ctrl2 = gui_pointLight1.addColor(guiKeys.point, 'color')
  ctrl2.onChange(color => pointLight1.color.set(color))

  //

  const ctrl3 = gui_pointLight1.add(guiKeys.point, 'distance', 0, 50, 1)
  ctrl3.onChange(number => pointLight1.distance = number)

}


/* Directional Light */
{

  const ctrl1 = gui_DirectLight1.add(guiKeys.direct, 'intensity', 0, 10, .1)
  ctrl1.onChange(number => directLight1.intensity = number)

  //

  const ctrl2 = gui_DirectLight1.addColor(guiKeys.direct, 'color')
  ctrl2.onChange(color => directLight1.color.set(color))

  //

  const ctrl3 = gui_DirectLight1.add(guiKeys.direct, 'castShadows')
  ctrl3.onChange(boolean => boolean ? directLight1.castShadow = true : directLight1.castShadow = false)

  //

  const ctrl4 = gui_DirectLight1.add(guiKeys.direct, 'shadowBias', -1, 1, .0001)
  ctrl4.onChange(number => directLight1.shadow.bias = number)

  //

  const ctrl5 = gui_DirectLight1.add(guiKeys.direct, 'shadowMapSizeWidth', [ 512, 1024, 2048, 4096 ])
  ctrl5.onChange(number => {
    directLight1.shadow.mapSize.width = parseInt(number)
    directLight1.shadow.map.dispose();
    directLight1.shadow.map = null;
  })

  //

  const ctrl6 = gui_DirectLight1.add(guiKeys.direct, 'shadowMapSizeHeight', [ 512, 1024, 2048, 4096 ])
  ctrl6.onChange(number => {
    directLight1.shadow.mapSize.height = parseInt(number)
    directLight1.shadow.map.dispose();
    directLight1.shadow.map = null;
  })

}


/* * * * * * * * * * * * * * * * * * * * */
/* * * * * * * THREE.js stuff * * * * * * /
/* * * * * * * * * * * * * * * * * * * * */


/* Commonly used variables */
let scene,
  renderer,
  loader,
  camera,
  orbitControls,
  ambientLight,
  hemiLight,
  pointLight1,
  directLight1,
  textureLoader

// hdri scene
let bgScene,
  bgMesh

//loader
let models
const allModels = []

//dblclick
let raycasterPaint,
  mousePaint,
  dblClicked = false

//zoom
let raycasterZoom,
  mouseZoom,
  rightClicked = false

//highlight
let raycasterHighlight,
  mouseHighlight


/* Create camera */
const createCam = (fov = 75, near = 0.1, far = 50) =>
  new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, near, far)



/* Scene */
scene = new THREE.Scene()


/* HDRI Scene */
bgScene = new THREE.Scene()

{
  textureLoader = new THREE.TextureLoader()

  const texture = textureLoader.load('./assets/kloofendal_48d_partly_cloudy_2k.jpg',)

  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter

  const shader = THREE.ShaderLib.equirect

	const material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide,
  });
	material.uniforms.tEquirect.value = texture

  const plane = new THREE.BoxBufferGeometry(40, 40, 40)

  bgMesh = new THREE.Mesh(plane, material)

  bgScene.add(bgMesh)
}


/* Renderer */
renderer = new THREE.WebGLRenderer({antialias: true})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setClearColor('#63aed2', 1)

renderer.gammaOutput = true
renderer.gammaFactor = 2.2

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

document.body.appendChild( renderer.domElement )


/* Perspective Camera */
camera = createCam()

camera.position.set(8, 12, 8)

scene.add(camera)


/* Orbit Controls */
orbitControls = new OrbitControls( camera, renderer.domElement )

orbitControls.target = new THREE.Vector3(0, 0, 0)

orbitControls.enableDamping = false
orbitControls.enableKeys = false
orbitControls.enablePan = false
orbitControls.mouseButtons.MIDDLE = null

orbitControls.rotateSpeed = .25
orbitControls.zoomSpeed = 1

orbitControls.minPolarAngle = Math.PI / 8
orbitControls.maxPolarAngle = 1.5

orbitControls.minDistance = 5
orbitControls.maxDistance = 20


/* Transform Controls */
const transformControls = new TransformControls( camera, renderer.domElement )

transformControls.addEventListener('change', () =>
  renderer.render(scene, camera))

transformControls.addEventListener( 'dragging-changed', e =>
  orbitControls.enabled = ! e.value)

window.addEventListener( 'keydown', ({keyCode}) => {
  switch ( keyCode ) {
  	case 87: // W
  		transformControls.setMode( "translate" )
  		break
  	case 69: // E
  		transformControls.setMode( "rotate" )
  		break
  	case 82: // R
  		transformControls.setMode( "scale" )
  		break
  	case 187:
  	case 107: // +, =, num+
  		transformControls.setSize( transformControls.size + 0.1 )
  		break
  	case 189:
  	case 109: // -, _, num-
  		transformControls.setSize( Math.max( transformControls.size - 0.1, 0.1 ) )
  		break
  	case 88: // X
  		transformControls.showX = ! transformControls.showX
  		break
  	case 89: // Y
  		transformControls.showY = ! transformControls.showY
  		break
  	case 90: // Z
  		transformControls.showZ = ! transformControls.showZ
  		break
  	case 32: // Spacebar
  		transformControls.enabled = ! transformControls.enabled
  		break
  }
})


/* Resize */
window.addEventListener('resize', () => {
  const { innerHeight, innerWidth } = window

  renderer.setSize(innerWidth, innerHeight)

  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
});


/* Load gltf/glb assets */
loader = new GLTFLoader()

loader.load('./assets/house.gltf', gltf => {

  models = gltf.scene

  models.traverse(child => {
    if(child instanceof THREE.Mesh){
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  scene.add(models)

  scene.traverse(child =>
    child instanceof THREE.Mesh ? allModels.push(child) : null )

  console.log({
    scene,
    gltf,
    models: models.children
  })
},
xhr => {
  lazyLoad(xhr.loaded / xhr.total * 100)
  console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
},
err => console.error( 'An error happened', err ))


/* Lights */
{
  hemiLight = new THREE.HemisphereLight('#6a6a6a', "#000", 1)

  hemiLight.position.set(0, 10, 0)

  scene.add(hemiLight)
}

{
  ambientLight = new THREE.AmbientLight( '#6a6a6a' )
  scene.add( ambientLight )
}

{
  directLight1 = new THREE.DirectionalLight('#fff', 1)

  directLight1.position.set(-4, 4, -1)

  directLight1.castShadow = true
  directLight1.shadow.bias = -.003
  directLight1.shadow.mapSize.width = 512
  directLight1.shadow.mapSize.height = 512

  directLight1.shadow.camera.left = -12
  directLight1.shadow.camera.right = 12
  directLight1.shadow.camera.top = 12
  directLight1.shadow.camera.bottom = -12

  directLight1.shadow.camera.near = .1
  directLight1.shadow.camera.far = 30

  const helper = new THREE.DirectionalLightHelper(directLight1);
  scene.add(helper);

  scene.add(directLight1)
}

{
  pointLight1 = new THREE.PointLight( '#6a6a6a', 1.5)

  pointLight1.position.set( 0, 3, 0 )
  pointLight1.distance = 7

  scene.add( pointLight1 )
}


/* Paint & Transform Objects */
raycasterPaint = new THREE.Raycaster()
mousePaint = new THREE.Vector2()

window.addEventListener( 'dblclick', ({clientX, clientY}) => {
  mousePaint.x = ( clientX / window.innerWidth ) * 2 - 1
	mousePaint.y = - ( clientY / window.innerHeight ) * 2 + 1
  dblClicked = true
})

const mouseDblClick = () => {
  if(dblClicked){
    dblClicked = false

    // models're loaded
    if(models !== undefined){

      raycasterPaint.setFromCamera( mousePaint, camera )

      const intersects = raycasterPaint.intersectObjects( allModels )

      // mouse is over mesh
      if(intersects.length > 0){

        const selected = intersects[0].object

        guiKeys.texture.dblClickPaint
          ? selected.material.color.set( guiKeys.texture.textureColor )
          : null

        if(guiKeys.transform.transformObjects){
          transformControls.detach()

          transformControls.attach( selected )

          scene.add( transformControls )
        }
      }
    }
  }
}


/* Zoom onto objects*/
raycasterZoom = new THREE.Raycaster()
mouseZoom = new THREE.Vector2()

window.addEventListener( 'contextmenu', ({clientX, clientY}) => {
  mouseZoom.x = ( clientX / window.innerWidth ) * 2 - 1
	mouseZoom.y = - ( clientY / window.innerHeight ) * 2 + 1
  rightClicked = true
})

const setCamerZoom = (x, y, z) => {
  orbitControls.target = new THREE.Vector3(x, y, z)

  orbitControls.minPolarAngle = 0
  orbitControls.maxPolarAngle = Math.PI

  orbitControls.minDistance = 1
  orbitControls.maxDistance = 5
}

const zoomIn = () => {
  if (rightClicked) {
    rightClicked = false

    // models're loaded
    if(models !== undefined){

      raycasterZoom.setFromCamera( mouseZoom, camera )

      const intersects = raycasterZoom.intersectObjects( allModels )

      // mouse is over mesh
      if(intersects.length > 0){

        const selected = intersects[0].object.parent

        const { x, y, z } = selected.position

        setCamerZoom(x, y, z)
      }
    }
  }
}


/* Highlight objects on mouse move */
raycasterHighlight = new THREE.Raycaster()
mouseHighlight = new THREE.Vector2(100, 100)

window.addEventListener( 'mousemove', ({clientX, clientY}) => {
  mouseHighlight.x = ( clientX / window.innerWidth ) * 2 - 1
	mouseHighlight.y = - ( clientY / window.innerHeight ) * 2 + 1
});

const mouseMove = () => {
  // all scene models are pushed to array & gui highlightSelected is enabled
  if(allModels.length > 0  && guiKeys.display.highlightSelected){

    raycasterHighlight.setFromCamera( mouseHighlight, camera )

    const intersects = raycasterHighlight.intersectObjects( allModels, true )

    // mouse is over mesh
    if(intersects.length > 0){

      const selected = intersects[0].object

      let { r, g, b } = selected.material.color

      r /= 1.25
      g /= 1.25
      b /= 1.25

      // Clear all previous highlights
      allModels.forEach(e => {
        e.material.transparent = false
        e.material.opacity = 1

        e.material.emissive
          ? e.material.emissive = {r: 0, g: 0, b: 0}
          : null
      })

      // Set highlights
      selected.material.emissive = {r , g , b }

      selected.material.transparent = true
      selected.material.opacity = 0.9
    }else{
      // Clear all previous highlights
      allModels.forEach(e => {
        e.material.transparent = false
        e.material.opacity = 1

        e.material.emissive
          ? e.material.emissive = {r: 0, g: 0, b: 0}
          : null
      })
    }
  }
}


/* Update in Render Loop */
const update = time => {
  orbitControls.update()

  if(guiKeys.display.backgroundHDRI){
    bgMesh.position.copy(camera.position)
    renderer.render(bgScene, camera)
  }

  zoomIn()
  mouseDblClick()
  mouseMove()
}


/* Render Loop */
const onAnimationFrameHandler = time => {
  update(time)

  renderer.render(scene, camera)

  window.requestAnimationFrame(onAnimationFrameHandler)
}
window.requestAnimationFrame(onAnimationFrameHandler)
