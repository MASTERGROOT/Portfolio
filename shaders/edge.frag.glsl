uniform float uPulse;
uniform float uOpacity;
uniform vec3 uColor;
varying float vT;

void main() {
  // Bright travelling pulse: a spot moving from 0 to 1 along the edge
  float pulse = fract(uPulse);
  float dist = abs(vT - pulse);
  // Wrap-around distance for continuous loop
  dist = min(dist, 1.0 - dist);
  float glow = 1.0 - smoothstep(0.0, 0.12, dist);
  float baseAlpha = 0.55 * uOpacity;
  float pulseAlpha = glow * 0.9 * uOpacity;
  gl_FragColor = vec4(uColor, clamp(baseAlpha + pulseAlpha, 0.0, 1.0));
}
