uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.1415926535897932384626433832795;

void main(){
  gl_FragColor = vec4(vUv, 0.0, 1.);
}
