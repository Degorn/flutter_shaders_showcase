#version 460 core

#include <flutter/runtime_effect.glsl>  

uniform vec2 uSize;
uniform float uTime;

out vec4 fragColor;

// Palette function from https://iquilezles.org/articles/palettes/
vec3 palette(in float t)
{
    // Colors from http://dev.thi.ng/gradients/
    vec3 a = vec3(0.500, 0.500, 0.500);
    vec3 b = vec3(0.500, 0.500, 0.500);
    vec3 c = vec3(1.000, 1.000, 1.000);
    vec3 d = vec3(0.000, 0.333, 0.667);
    return a + b*cos( 6.28318*(c*t+d) );
}

// Distant function from https://iquilezles.org/articles/distfunctions2d/
float sdOctogon( in vec2 p, in float r )
{
    const vec3 k = vec3(-0.9238795325, 0.3826834323, 0.4142135623 );
    p = abs(p);
    p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
    p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}

void main() {
    vec2 fragCoord = FlutterFragCoord();

    // uv = fragCoord / uSize // Ranging from (0, 0) to (1, 1).
    // uv = uv - 0.5 // Ranging from (-0.5, -0.5) to (0.5, 0.5).
    // uv = uv * 2.0 // Ranging from (-1, -1) to (1, 1).
    // uv.x *= uSize.x / uSize.y // Ensure stretching if the screen is not square.
    vec2 uv = (fragCoord * 2.0 - uSize) / uSize.y;
    vec2 uv0 = uv;

    vec3 finalColor = vec3(0.0);

    for (int i = 0; i < 2; i++) {
        // uv = fract(uv); // Each repetition will be confined to the range [0, 1].
        // uv -= 0.5;
        uv = fract(uv * 1.5) - 0.5;

        // float dis = length(uv); // Circle.
        float dis = sdOctogon(uv, 0.5) * exp(-length(uv0));
        vec3 color = palette(length(uv0) + uTime * 0.1);
        
        dis = sin(dis * 8.0 - uTime) / 8.0;
        dis = abs(dis);
        dis = pow(0.02 / dis, 1.8);

        finalColor += color * dis;
    }

    fragColor = vec4(finalColor, 1.0);
}
