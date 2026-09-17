import * as THREE from 'three'

// Ambient contact beneath the rigid covers complements the moving directional
// shadow. It is a floor effect, not a drop shadow around the screen-space canvas.
export function createBookContactShadow(book, width, height, floorY) {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      coverSize: { value: new THREE.Vector2(width, height) },
      leftWeight: { value: 0 },
      shadowColor: { value: new THREE.Color('#34383e') },
    },
    vertexShader: `
      varying vec2 floorPoint;
      void main() {
        floorPoint = position.xz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 coverSize;
      uniform float leftWeight;
      uniform vec3 shadowColor;
      varying vec2 floorPoint;

      float footprint(vec2 point, float centerX) {
        vec2 q = abs(point - vec2(centerX, 0.0)) - coverSize * 0.5 + 0.045;
        float distance = max(length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.045, 0.0);
        float contact = 0.28 * exp(-0.5 * pow(distance / 0.055, 2.0));
        float penumbra = 0.13 * exp(-0.5 * pow(distance / 0.24, 2.0));
        return contact + penumbra;
      }

      void main() {
        float rightShadow = footprint(floorPoint, coverSize.x * 0.5);
        float leftShadow = footprint(floorPoint, -coverSize.x * 0.5) * leftWeight;
        // A shared footprint avoids a double-dark stripe along the open spine.
        float alpha = max(rightShadow, leftShadow);
        if (alpha < 0.001) discard;
        gl_FragColor = vec4(shadowColor, alpha);
        #include <colorspace_fragment>
      }
    `,
  })
  const geometry = new THREE.PlaneGeometry(width * 2 + 2.4, height + 2.4)
  geometry.rotateX(-Math.PI / 2)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = floorY + .001
  mesh.renderOrder = 1
  book.add(mesh)
  return {
    update(open) {
      // The lifted cover casts its directional shadow until it nearly touches
      // the floor. Only then should a tight contact shadow emerge beneath it.
      const t = Math.max(0, Math.min(1, (open - .97) / .03))
      material.uniforms.leftWeight.value = t * t * (3 - 2 * t)
    },
    diagnostics: () => ({ leftWeight: material.uniforms.leftWeight.value, floorY: mesh.position.y, depthWrite: material.depthWrite }),
  }
}
