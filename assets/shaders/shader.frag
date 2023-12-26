#version 460 core

#include <flutter/runtime_effect.glsl>  

uniform vec2 uSize;
uniform float uTime;
uniform vec2 uMouse;

out vec4 fragColor;

mat2 rot2D(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float sdSphere(vec3 position, float radius) {
    return length(position) - radius;
}

float sdBox(vec3 position, vec3 size) {
    vec3 d = abs(position) - size;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float opSmoothSubtraction(float d1, float d2, float k) {
    float h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
    return mix(d2, -d1, h) + k * h * (1.0 - h);
}

float opSmoothIntersection(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) + k * h * (1.0 - h);
}

float sceneObject(vec3 position) {
    vec3 spherePosition = vec3(sin(uTime) * 3.0, 0, 0);
    float sphere = sdSphere(position - spherePosition, 1.0);

    vec3 boxPosition = position;

    boxPosition = position - vec3(0, sin(uTime * 3) * 2, 0);
    boxPosition.xy *= rot2D(uTime);
    // boxPosition = vec3(0, sin(uTime * 3) * 2, 0);

    boxPosition = fract(boxPosition) - 0.5;

    float box = sdBox(boxPosition, vec3(0.1));

    float ground = -position.y + 1.0;

    return smin(ground, box, 1.4);
    // return smin(ground, smin(sphere, box, 3), 2.2);
}

void main() {
    vec2 fragCoord = FlutterFragCoord();
    vec2 uv = (fragCoord * 2.0 - uSize) / uSize.y;
    vec2 mouse = (uMouse * 2.0 - uSize) / uSize.y;
    float fov = 1.5;

    vec3 rayOrigin = vec3(0, 0, -3);
    vec3 rayDirection = normalize(vec3(uv * fov, 1));
    vec3 color = vec3(0.0);

    float rayDistance = 0.0;

    // Camera rotation
    rayOrigin.yz *= rot2D(mouse.y);
    rayDirection.yz *= rot2D(mouse.y);
    rayOrigin.xz *= rot2D(mouse.x);
    rayDirection.xz *= rot2D(mouse.x);

    for (int i = 0; i < 60; i++) {
        vec3 position = rayOrigin + rayDirection * rayDistance;
        float distanceToScene = sceneObject(position);
        rayDistance += distanceToScene;

        if (distanceToScene < 0.001 || rayDistance > 100.0) break;
    }

    color = vec3(rayDistance * 0.1);

    fragColor = vec4(color, 1);
}
