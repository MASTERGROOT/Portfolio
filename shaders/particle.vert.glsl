uniform vec3 uMouse;
uniform float uVortexStrength;
uniform float uTime;

attribute float aSize;
attribute float aSpeed;

varying float vAlpha;

// Simple pseudo-random for noise
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 pos = position;

  // Autonomous drift using time + per-particle seed
  float seed = rand(vec2(position.x, position.z));
  pos.x += sin(uTime * aSpeed + seed * 6.28) * 0.15;
  pos.y += cos(uTime * aSpeed * 0.7 + seed * 3.14) * 0.1;

  // Cursor vortex pull
  float dist = length(pos - uMouse);
  float strength = 1.0 / (dist * dist + 0.5);
  pos += (uMouse - pos) * strength * uVortexStrength;

  vAlpha = clamp(1.0 - dist * 0.18, 0.1, 1.0);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
