#version 460 core

#include <flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float uTime;

out vec4 fragColor; // Output colour for Flutter, like gl_FragColor

void main() {
    vec2 fragCoord = FlutterFragCoord();
    vec2 pixel = fragCoord / uSize;
    pixel.x *= uSize.x / uSize.y;

    vec3 color = vec3(pixel.x, pixel.y, abs(sin(uTime)));

    fragColor = vec4(color, 1.0);
}