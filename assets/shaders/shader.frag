#include <flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float uTime;

out vec4 fragColor; // Output colour for Flutter, like gl_FragColor

void main() {
    vec2 st = FlutterFragCoord().xy/uSize.xy;
    st.x *= uSize.x/uSize.y;

    vec3 color = vec3(0.);
    color = vec3(st.x,st.y,abs(sin(uTime)));

    fragColor = vec4(color,1.0);
}