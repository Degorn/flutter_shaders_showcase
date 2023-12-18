#include <flutter/runtime_effect.glsl>

out vec4 fragColor;

uniform vec2 uSize;
uniform float iTime;
uniform vec2 iMouse;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

#define PI 3.1415926538

//// Comparison functions
float gt(float v1, float v2)
{
    return step(v2,v1);
}

float lt(float v1, float v2)
{
    return step(v1, v2);
}

float between(float val, float start, float end)
{
    return gt(val,start)*lt(val,end);
}

float eq(float v1, float v2, float e)
{
    return between(v1, v2-e, v2+e);
}

float s_gt(float v1, float v2, float e)
{
    return smoothstep(v2-e, v2+e, v1);
}

float s_lt(float v1, float v2, float e)
{
    return smoothstep(v1-e, v1+e, v2);
}

float s_between(float val, float start, float end, float epsilon)
{
    return s_gt(val,start,epsilon)*s_lt(val,end,epsilon);
}

float s_eq(float v1, float v2, float e, float s_e)
{
    return s_between(v1, v2-e, v2+e, s_e);
}

//// Coloring functions
vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}


//// Shapes functions
float circle_df(vec2 xy, vec2 pos)
{
    float d = distance(xy, pos);
    //float d = dot(xy-pos, xy-pos)*2.; // Cheaper distance function but will require more epsilon if using with smoothstep
    return d;
}

float circle(vec2 xy, vec2 pos, float r)
{
    float d = circle_df(xy, pos);
    return lt(d, r);
}

float s_circle(vec2 xy, vec2 pos, float r, float e)
{
    float d = circle_df(xy, pos);
    return s_lt(d, r, e);
}

float square_df(vec2 xy, vec2 pos, float l)
{
    vec2 v = abs(xy-pos)-l;
    float d = length(max(v, 0.));
    return d;
}

float square(vec2 xy, vec2 pos, float l, float roundness) // roundness == 0 means no roundess, roundness == 1 means full roundess
{
    float r = clamp(roundness, 0., 1.)*l;
    float d = square_df(xy, pos, l-r);
    return lt(d, r);
}

float s_square(vec2 xy, vec2 pos, float l, float roundness, float e) // roundness == 0 means no roundess, roundness == 1 means full roundess
{
    float r = clamp(roundness, 0., 1.)*l;
    float d = square_df(xy, pos, l-r);
    return clamp(s_lt(d, r, e*2.)*2., 0., 1.);
}

float rectangle_df(vec2 p, float w, float h)
{
    vec2 b = vec2(w, h);
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float rectangle(vec2 xy, vec2 pos, float w, float h, float roundness) // roundness == 0 means no roundess, roundness == 1 means full roundess
{
    h = h/2.;
    w = w/2.;
    float r = clamp(roundness, 0., 1.)*w;
    float d = rectangle_df(xy-pos, w-r, h-r);
    return lt(d, r);
}

float s_rectangle(vec2 xy, vec2 pos, float w, float h, float roundness, float e) // roundness == 0 means no roundess, roundness == 1 means full roundess
{
    h = h/2.;
    w = w/2.;
    float r = clamp(roundness, 0., 1.)*w;
    float d = rectangle_df(xy-pos, w-r, h-r);
    return s_lt(d, r, e);
}

float triangle_df(vec2 xy, vec2 pos, float l)
{
    vec2 p = (xy-pos)/l;
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
}

float triangle(vec2 xy, vec2 pos, float l, float roundness) // roundness == 0 means no roundess, roundness == 1 means full roundess
{
    float r = clamp(roundness, 0., 1.)*l;
    float d = triangle_df(xy, pos, l);
    return lt(d, r);
}

float s_triangle(vec2 xy, vec2 pos, float l, float roundness, float e) // roundness == 0 means no roundess, roundness == 1 means full roundess
{
    float r = clamp(roundness, 0., 1.)*l;
    float d = triangle_df(xy, pos, l);
    return clamp(s_lt(d, r, e*2.)*2., 0., 1.);
}

//// Rotation function
vec2 rotate(vec2 vec, float a)
{
    return vec2(vec.x*cos(a)-vec.y*sin(a), vec.x*sin(a)+vec.y*cos(a));
}


//// Line function
vec2 lerp(vec2 p1, vec2 p2, float t)
{
    vec2 u = p2-p1;
    return t*u+p1;
}

float line(vec2 xy, vec2 p1, vec2 p2, float w)
{
    xy -= lerp(p1, p2, 0.5);
    float d = distance(p1, p2);
    xy = rotate(xy, atan(p2.x-p1.x, p2.y-p1.y));

    return rectangle(xy, vec2(0.), w, d, 1.);
}

float s_line(vec2 xy, vec2 p1, vec2 p2, float w, float e)
{
    xy -= lerp(p1, p2, 0.5);
    float d = distance(p1, p2);
    xy = rotate(xy, atan(p2.x-p1.x, p2.y-p1.y));

    return s_rectangle(xy, vec2(0.), w, d, 1., e);
}


vec3 rotate(vec3 vec, float a, int axis) // 0 for x, 1 for y 2 for z
{
    mat3 rt;
    switch (axis) {
    case 0:
        rt = mat3(1.,   0.  ,    0.  ,
                  0., cos(a), -sin(a),
                  0., sin(a),  cos(a));
        break;
    case 1:
        rt = mat3(cos(a), 0., sin(a),
                    0.,   1.,   0.  ,
                  -sin(a), 0., cos(a));
        break;
    case 2:
        rt = mat3(cos(a), -sin(a), 0.,
                  sin(a),  cos(a), 0.,
                    0.,      0.,   1.);
        break;
    }
    return vec*rt;
}



vec2 projectPoint(vec3 p)
{
    vec3 ppc = vec3(0.,0., 1.);
    vec3 n = vec3(0., 0., -1.);
    
    vec3 v = p-ppc;
    float vp = dot(n, v);
    
    vec3 result = p-vp*n;
    
    return vec2(result.x, result.y);
}


// https://stackoverflow.com/questions/5666222/3d-line-plane-intersection
vec3 intersect(vec3 p0, vec3 p1, vec3 p_co, vec3 p_no, float e)
{
    vec3 u = p1-p0;
    float d = dot(p_no, u);

    if (abs(d) > e)
    {
        vec3 w = p0-p_co;
        float fac = -dot(p_no, w)/d;
        u*=fac;
        return p0+u;
    }

    return vec3(0.);
}

float getAngle(vec3 v1, vec3 v2)
{
    return acos(dot(v1,v2)/(length(v1)*length(v2)));
}


void main() {
    vec2 fragCoord = FlutterFragCoord();
    vec2 iResolution = uSize;

    vec2 mouse = iMouse.xy / iResolution.xy;
    vec2 uv = fragCoord/iResolution.xy;

    float zoom = 20.;
    
    vec2 zoomCenter = vec2(0.);

    float viewPortCenter = 0.5;
    float ratio = iResolution.y/iResolution.x;
    
    vec2 xy = (uv - viewPortCenter) * zoom + zoomCenter;
    xy = vec2(xy.x, xy.y*ratio);
    
    mouse.xy -= vec2(viewPortCenter);
    mouse.y *= ratio;
    
    float pixel = 1. / iResolution.x;
    vec3 col = vec3(0.);
    
    float x_r = cos(iTime/2.);
    float y_r = iTime;
    float z_r = sin(iTime);
    
    vec3 p = rotate(rotate(rotate(vec3(0.), x_r, 0), y_r, 1), z_r, 2);
    vec3 n = normalize(rotate(rotate(rotate(vec3(0., 0., 1.), x_r, 0), y_r, 1), z_r, 2));
    
    vec3 y_axis = rotate(rotate(rotate(vec3(0., 1., 0.), x_r, 0), y_r, 1), z_r, 2);
    vec3 x_axis = rotate(rotate(rotate(vec3(1., 0., 0.), x_r, 0), y_r, 1), z_r, 2);

    
    //vec3 l1 = vec3(xy.x, xy.y,1);
    vec3 l1 = vec3(0.,0.,6); //perspective projection
    vec3 l2 = vec3(xy.x, xy.y, -1);
    
    vec3 hit = intersect(l1, l2, p, n, 0.);
    
    float d = distance(hit, p);
    
    vec3 hit_p_v = hit-p;

    float y = dot(hit_p_v, y_axis)/length(y_axis);
    float x = dot(hit_p_v, x_axis)/length(x_axis);
    vec2 hit_xy = vec2(x,y);

    //vec2 pp = projectPoint(hit); // No need since we would know the x and y from the ray were hitting
    vec2 pp = hit.xy;
    
    vec4 front = texture(iChannel0, hit_xy/3.)*gt(cos(getAngle(vec3(0,0,1),n)),0.);
    vec4 back = texture(iChannel1, hit_xy/3.)*lt(cos(getAngle(vec3(0,0,1),n)),0.);
    
    col += front.rgb;
    col += back.rgb;
    
    col *= s_rectangle(hit_xy, vec2(0), 3., 5., 0.5, pixel);
    
    fragColor = vec4(col,1.0);
}