#include <flutter/runtime_effect.glsl>


uniform vec2 uSize;
uniform float iTime;

float screen_ratio;
vec2 screen_size;
vec2 center;
float zoom;
uniform int itr;

vec2 iResolution;

out vec4 fragColor;

vec4 map_to_color(float t) {
    float r = 9.0 * (1.0 - t) * t * t * t;
    float g = 15.0 * (1.0 - t) * (1.0 - t) * t * t;
    float b = 8.5 * (1.0 - t) * (1.0 - t) * (1.0 - t) * t;

    return vec4(r, g, b, 1.0);
}

void main()
{
	iResolution = uSize;
    vec2 fragCoord = FlutterFragCoord();

    screen_ratio = uSize.x / uSize.y;
    center = screen_size / 1.0;
    zoom = 1.0;

    vec2 z, c;
    c.x = screen_ratio * (gl_FragCoord.x / screen_size.x - 0.5);
    c.y = (gl_FragCoord.y / screen_size.y - 0.5);

    c.x /= zoom;
    c.y /= zoom;

    c.x += center.x;
    c.y += center.y;

    int i;
    for(int ii = 0; ii < 1000; ii++) {
        i = ii;
        float x = (z.x * z.x - z.y * z.y) + c.x;
		float y = (z.y * z.x + z.x * z.y) + c.y;

		if((x * x + y * y) > 2.0) break;
		z.x = x;
		z.y = y;
    }

    float t = i / 1000;
    fragColor = map_to_color(float(t));

    // vec2 st = FlutterFragCoord().xy/iResolution.xy;
    // st.x *= iResolution.x/iResolution.y;
    // vec3 color = vec3(0.);
    // color = vec3(st.x,st.y,abs(sin(iTime)));
    // fragColor = vec4(color,1.0);
}