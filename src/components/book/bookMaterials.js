import * as THREE from 'three'

// A lighting-only relief map derived from the supplied lettering. Nothing is
// painted over or retyped in the artwork. Dark cover panels stay completely flat.
function letteringRelief(image, anisotropy) {
  const canvas = document.createElement('canvas')
  const w = canvas.width = image.naturalWidth, h = canvas.height = image.naturalHeight
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(image, 0, 0)
  const pixels = ctx.getImageData(0, 0, w, h).data
  const mask = new Float32Array(w * h), horizontal = new Float32Array(w * h), height = new Float32Array(w * h)
  let raisedPixels = 0
  for (let i = 0; i < mask.length; i++) {
    const p = i * 4, luma = .2126 * pixels[p] + .7152 * pixels[p + 1] + .0722 * pixels[p + 2]
    const t = Math.max(0, Math.min(1, (luma - 145) / 60))
    mask[i] = t * t * (3 - 2 * t)
    if (mask[i] > .5) raisedPixels++
  }
  // A shallow rounded bevel preserves the thin name and the italic hairlines.
  const kernel = [1, 14, 91, 364, 1001, 2002, 3003, 3432, 3003, 2002, 1001, 364, 91, 14, 1]
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let sum = 0
    for (let k = -7; k <= 7; k++) sum += mask[y * w + Math.max(0, Math.min(w - 1, x + k))] * kernel[k + 7]
    horizontal[y * w + x] = sum / 16384
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let sum = 0
    for (let k = -7; k <= 7; k++) sum += horizontal[Math.max(0, Math.min(h - 1, y + k)) * w + x] * kernel[k + 7]
    height[y * w + x] = sum / 16384
  }
  const depth = .010, data = new Uint8Array(w * h * 4)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, p = i * 4
    const dx = (height[y * w + Math.min(w - 1, x + 1)] - height[y * w + Math.max(0, x - 1)]) * depth * w / (2 * 3.108)
    const dy = (height[Math.min(h - 1, y + 1) * w + x] - height[Math.max(0, y - 1) * w + x]) * depth * h / (2 * 4.188)
    const length = Math.hypot(dx, dy, 1)
    data[p] = Math.round((.5 - dx / length * .5) * 255)
    data[p + 1] = Math.round((.5 + dy / length * .5) * 255)
    data[p + 2] = Math.round((.5 + 1 / length * .5) * 255)
    data[p + 3] = Math.round(mask[i] * 255)
  }
  const texture = new THREE.DataTexture(data, w, h, THREE.RGBAFormat)
  texture.flipY = true
  texture.magFilter = THREE.LinearFilter; texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.generateMipmaps = true; texture.anisotropy = anisotropy; texture.needsUpdate = true
  texture.userData = { depth, width: w, height: h, raisedFraction: raisedPixels / (w * h) }
  return texture
}

// Repeating height data for the existing 3D binding material, not new artwork.
// The supplied cover remains an untouched texture; color grading happens in
// the lit material so its typography and layout are preserved exactly.
export function createBookCloth(anisotropy) {
  const size = 512, data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const warp = Math.cos(x * Math.PI / 6), weft = Math.cos(y * Math.PI / 6)
    const over = (Math.floor(x / 12) + Math.floor(y / 12)) % 2
    const fiber = Math.sin(x * 2.17 + y * 1.39) * 3
    const value = Math.round(128 + 27 * (over ? warp : weft) + 7 * (over ? weft : warp) + fiber)
    const i = (y * size + x) * 4
    data[i] = data[i + 1] = data[i + 2] = value; data[i + 3] = 255
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1.5, 2)
  texture.magFilter = THREE.LinearFilter; texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.generateMipmaps = true; texture.anisotropy = anisotropy; texture.needsUpdate = true
  const binding = color => new THREE.MeshPhysicalMaterial({
    color, roughness: .9, metalness: 0, bumpMap: texture, bumpScale: .012,
    sheen: .18, sheenColor: '#b8b6b1', sheenRoughness: .85,
  })
  const cover = binding('#e9e8e5')
  cover.bumpScale = .032
  cover.userData.saturation = .60
  cover.onBeforeCompile = shader => {
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
      #include <map_fragment>
      float inkLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
      diffuseColor.rgb = mix(vec3(inkLuma), diffuseColor.rgb, 0.60);
      float weave = texture2D(bumpMap, vBumpMapUv).r - 0.5;
      float lettering = 0.0;
      #ifdef USE_NORMALMAP
        vec4 relief = texture2D(normalMap, vNormalMapUv);
        lettering = relief.a;
        // Fine contact shading at the bevel survives the cover's small on-screen
        // size. Its bright edge still comes from the real scene lighting below.
        float bevelContact = (1.0 - relief.b) * mix(0.85, 0.22, lettering);
        diffuseColor.rgb *= 1.0 - bevelContact;
      #endif
      diffuseColor.rgb *= 1.0 + weave * 0.24 * (1.0 - lettering * 0.8);
    `)
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
      #include <roughnessmap_fragment>
      // Satin raised ink catches the light; the surrounding linen stays matte.
      roughnessFactor = mix(roughnessFactor, 0.36, lettering);
    `)
    shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_maps>', `
      #include <normal_fragment_maps>
      #ifdef USE_NORMALMAP
        normal = perturbNormalArb(-vViewPosition, normal, dHdxy_fwd() * (1.0 - lettering * 0.8), faceDirection);
      #endif
    `)
  }
  cover.customProgramCacheKey = () => 'book-embossed-linen-v3'
  function emboss(image) {
    const relief = letteringRelief(image, anisotropy)
    cover.normalMap = relief
    cover.userData.letteringRelief = relief.userData
    cover.needsUpdate = true
    return relief
  }
  return { texture, cover, binding, emboss }
}
