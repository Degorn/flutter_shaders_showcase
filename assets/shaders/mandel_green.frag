#include <flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform float iTime;

out vec4 frag_color;
 
#define MAX_ITERATIONS 500
 
int get_iterations()
{
    vec2 fragCoord = FlutterFragCoord();

    float zoom = 1.0/iTime;
    float center_x = 0;
    float center_y = 0;

    float real = ((fragCoord.x / 1080.0 - 0.5) * zoom + center_x) * 5.0;
    float imag = ((fragCoord.y / 1080.0 - 0.5) * zoom + center_y) * 5.0;
 
    int iterations = 0;
    float const_real = real;
    float const_imag = imag;
 
    for(int i = 0; i < MAX_ITERATIONS; i++)
    {
        float tmp_real = real;
        real = (real * real - imag * imag) + const_real;
        imag = (2.0 * tmp_real * imag) + const_imag;
        
        float dist = real * real + imag * imag;
        
        if (dist > 4.0)
        break;

        iterations = i;
    }
    return iterations;
}
 
vec4 return_color()
{
    int iter = get_iterations();
    if (iter == MAX_ITERATIONS)
    {
        return vec4(0.0f, 0.0f, 0.0f, 1.0f);
    }
 
    float iterations = float(iter) / MAX_ITERATIONS;    
    return vec4(0.0f, iterations, 0.0f, 1.0f);
}
 
void main()
{
    frag_color = return_color();
}