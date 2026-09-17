import * as THREE from 'three'
import { createThemeMaterials } from './PlanetScene3D'

// Local-only art direction. The original scene materials are never modified.
const PIGMENTS = {
  planet: 0xf5f2e9, white: 0xf8f6ef, pale: 0xe8e7df, mid: 0xa9afa9,
  tablePedestal: 0xc5c9c2, dark: 0x697777, ink: 0x34413f,
  red: 0xb97470, green: 0x9aafa1, blue: 0x657e95,
  blossom: 0xdcbabd, blossomLight: 0xead3d0,
  figure: 0xe8cdb4, person: 0xe9ece3, skin: 0xedd5be,
  hair: 0x3b4342, eyes: 0x303a38, smile: 0x7c6760,
  hoodieTrim: 0xe9ece3, hoodieCord: 0xd4d9ce,
  trousers: 0x7f94a5, sneakers: 0xf3f1e7, dog: 0xf0eee3,
  sole: 0x7f8984, wood: 0x9b9e91, gardenSoil: 0xb9b3a0,
  gardenGreen: 0x9aad99, tomato: 0xbe8079, zucchini: 0x879f88,
  water: 0xb1c4c8, screen: 0x708695, steam: 0xf2eee4, coffee: 0x675750,
}

const WASH_NOISE = `
  varying vec3 vInkPosition;
  varying vec3 vInkNormal;
  varying vec3 vInkObjectNormal;
  varying vec3 vInkActPosition;
  uniform sampler2D uInkBrush;
  uniform float uInkReveal;
  uniform float uInkStrength;
  float inkHash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }
  float inkNoise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(inkHash(i), inkHash(i + vec3(1,0,0)), f.x),
                   mix(inkHash(i + vec3(0,1,0)), inkHash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(inkHash(i + vec3(0,0,1)), inkHash(i + vec3(1,0,1)), f.x),
                   mix(inkHash(i + vec3(0,1,1)), inkHash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float brushPigment() {
    vec3 weight = pow(abs(normalize(vInkObjectNormal)), vec3(4.0));
    weight /= max(dot(weight, vec3(1.0)), 0.0001);
    vec3 p = vInkPosition * 1.8 + vec3(0.31, 0.57, 0.19);
    return texture2D(uInkBrush, p.yz).r * weight.x
         + texture2D(uInkBrush, p.xz).r * weight.y
         + texture2D(uInkBrush, p.xy).r * weight.z;
  }
  float inkCoverage(float progress, float brush) {
    if (progress >= 0.9999) return 1.0;
    if (progress <= 0.0) return 0.0;
    float sweep = (vInkActPosition.y * 0.75 + vInkActPosition.x * 0.25 + 0.7) / 3.4;
    float bristles = (brush - 0.5) * 0.15 + inkNoise(vInkActPosition * 34.0) * 0.035;
    float edge = progress * 1.3 - 0.15;
    return 1.0 - smoothstep(edge - 0.035, edge + 0.035, sweep + bristles);
  }
`

export function createBrushTexture() {
  const texture = new THREE.TextureLoader().load('/textures/ink-dry-brush.webp')
  texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping
  texture.colorSpace = THREE.NoColorSpace
  texture.anisotropy = 4
  return texture
}

function brushShader(shader, { texture, reveal, worldToAct, strength }) {
  Object.assign(shader.uniforms, {
    uInkBrush: { value: texture }, uInkReveal: reveal,
    uInkWorldToAct: worldToAct, uInkStrength: { value: strength },
  })
  shader.vertexShader = `
    varying vec3 vInkPosition;
    varying vec3 vInkNormal;
    varying vec3 vInkObjectNormal;
    varying vec3 vInkActPosition;
    uniform mat4 uInkWorldToAct;
  ` + shader.vertexShader
  shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
    #include <begin_vertex>
    vInkPosition = position;
    vInkNormal = normalize(normalMatrix * normal);
    vInkObjectNormal = normal;
    vInkActPosition = (uInkWorldToAct * modelMatrix * vec4(position, 1.0)).xyz;
  `)
  shader.fragmentShader = WASH_NOISE + shader.fragmentShader
}

// Pigment lives in object space so it follows each animated limb, never swims
// across the screen. Unlit materials remove cast shadows and glossy highlights.
export function paintInkWash(material, {
  texture, reveal = { value: 1 }, worldToAct = { value: new THREE.Matrix4() }, strength,
} = {}) {
  const role = material.userData.inkRole
  const foliage = ['blossom', 'blossomLight'].includes(role)
  const pigmentStrength = strength ?? (['skin', 'figure', 'eyes', 'smile'].includes(role) ? 0.24 : 0.8)
  material.onBeforeCompile = (shader) => {
    brushShader(shader, { texture, reveal, worldToAct, strength: pigmentStrength })
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      float wash = inkNoise(vInkPosition * 13.0);
      float brush = brushPigment();
      float form = smoothstep(-0.75, 0.95, dot(normalize(vInkNormal), normalize(vec3(-0.3, 0.8, 1.0))));
      vec3 silk = vec3(0.965, 0.956, 0.914);
      diffuseColor.rgb *= mix(0.9, 1.0, form) * mix(1.0, 0.74 + brush * 0.38, uInkStrength);
      diffuseColor.rgb = mix(diffuseColor.rgb, silk, smoothstep(0.6, 0.86, brush) * uInkStrength * 0.32);
      float lineCoverage = inkCoverage(min(1.0, uInkReveal + 0.2), brush);
      float colorCoverage = inkCoverage(uInkReveal, brush);
      // An ivory underpainting occludes the back-facing contour, so the
      // leading ink silhouette stays a thin line rather than a black blob.
      diffuseColor.rgb = mix(silk, diffuseColor.rgb, colorCoverage);
      diffuseColor.a *= lineCoverage;
      if (lineCoverage < 0.008) discard;
      ${foliage ? 'diffuseColor.a *= smoothstep(0.02, 0.52, abs(normalize(vInkNormal).z)) * (0.72 + wash * 0.28);' : ''}
    `)
  }
  material.customProgramCacheKey = () => 'ink-brush-v2-' + (foliage ? 'foliage' : 'solid')
  return material
}

export function createInkMaterials() {
  const source = createThemeMaterials()
  return Object.fromEntries(Object.entries(source).map(([name, original]) => {
    const foliage = ['blossom', 'blossomLight'].includes(name)
    const material = new THREE.MeshBasicMaterial({
      color: PIGMENTS[name] ?? original.color,
      transparent: true,
      opacity: foliage ? 0.82 : original.opacity,
      depthWrite: foliage ? false : original.depthWrite,
      side: original.side,
    })
    material.userData.inkRole = name
    original.dispose()
    return [name, material]
  }))
}

export function simplifyInkFigures(anchor) {
  anchor.traverse((object) => {
    if (!object.isMesh) return
    const role = object.material.userData.inkRole
    const headDetail = object.parent.name === 'ahwon-head' && (
      (role === 'hair' && object.geometry.type === 'TubeGeometry')
      || (role === 'skin' && object.geometry.parameters.radius < 0.03)
    )
    // Keep a clean hair silhouette, two eyes and a smile; remove tiny clothing
    // seams, cords, brows and sculpted facial details in this draft only.
    if (headDetail || ['hoodieTrim', 'hoodieCord'].includes(role)) {
      object.visible = false
      object.castShadow = false
    }
  })
  return anchor
}

export function finishInkAct(anchor, texture) {
  const reveal = { value: 0 }
  const worldToAct = { value: new THREE.Matrix4() }
  anchor.userData.inkReveal = reveal
  anchor.userData.inkWorldToAct = worldToAct
  anchor.userData.fadeMaterials.forEach((material) => paintInkWash(material, { texture, reveal, worldToAct }))
  const surfaces = []
  anchor.traverse((object) => {
    if (!object.isMesh) return
    object.castShadow = false
    object.receiveShadow = false
    if (!object.visible) return
    const role = object.material.userData.inkRole
    if (['blossom', 'blossomLight', 'water', 'steam', 'eyes', 'smile'].includes(role)) return
    object.geometry.computeBoundingSphere()
    if (object.geometry.boundingSphere.radius >= 0.07) surfaces.push(object)
  })
  const outline = new THREE.MeshBasicMaterial({
    color: 0x4b5956, side: THREE.BackSide, transparent: true,
    opacity: 0.46, depthWrite: false,
  })
  outline.userData.baseOpacity = outline.opacity
  outline.onBeforeCompile = (shader) => {
    brushShader(shader, { texture, reveal, worldToAct, strength: 1 })
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      float nib = 0.0036 * (0.82 + 0.18 * sin(position.y * 91.0 + position.x * 63.0));
      transformed += normal * nib;
    `)
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      float brush = brushPigment();
      float coverage = inkCoverage(min(1.0, uInkReveal + 0.2), brush);
      diffuseColor.a *= coverage * mix(0.52, 1.0, smoothstep(0.3, 0.75, brush));
      if (coverage < 0.008) discard;
    `)
  }
  outline.customProgramCacheKey = () => 'ink-brush-contour-v2'
  surfaces.forEach((object) => {
    const contour = new THREE.Mesh(object.geometry, outline)
    contour.name = 'ink-contour'
    contour.renderOrder = -1
    object.add(contour)
  })
  anchor.userData.fadeMaterials.push(outline)
  return anchor
}
