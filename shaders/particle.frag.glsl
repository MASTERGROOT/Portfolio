uniform vec3 uGoldColor;

varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);

  // Circular point with soft edge + glow falloff
  float core  = smoothstep(0.5, 0.1, d);
  float glow  = smoothstep(0.5, 0.0, d) * 0.4;
  float alpha = (core + glow) * vAlpha;

  if (alpha < 0.01) discard;
  gl_FragColor = vec4(uGoldColor, alpha);
}
