float random (vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898, 78.233)))*
    43758.5453123);
}

float noise (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}
const mat2 m2 = mat2(0.75, -0.45, 0.45, 0.75);
float fbm(vec2 p){
    float f = 0.0;
    f += 0.5000*noise(p); p = m2*p*2.02;
    f += 0.2500*noise(p); p = m2*p*2.03;
    f += 0.1250*noise(p); p = m2*p*2.01;
    f += 0.0625*noise(p);

    return f/0.9375;
}

#include <common>
#include <fog_pars_vertex>
#include <shadowmap_pars_vertex>


varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

attribute float aDisplacement;

float height(vec2 pos){
    float elevation = 0.0;

    float generalTerrainNoise = fbm(pos * 0.25);
    generalTerrainNoise = generalTerrainNoise * 1.5;

    float spikesNoise = fbm(pos * 1.2) * 0.22;


    float mountainNoise = fbm(pos * 0.4);
    mountainNoise = mountainNoise * aDisplacement * 8.0;

    elevation += generalTerrainNoise + spikesNoise + mountainNoise * aDisplacement;

    return elevation;
}


void main(){
    #include <begin_vertex>
    #include <project_vertex>
    #include <worldpos_vertex>
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <fog_vertex>

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vPosition = modelPosition.xyz;

    //modelPosition.xyz += normal * aDisplacement * 3.0;


    float elevation = height(modelPosition.xy);
    vElevation = elevation;

    modelPosition.xyz += normal * elevation;



    vec2 offsetX = vec2(1.0, 0.0);
    vec2 offsetY = vec2(0.0, 1.0);
    float hL = height(modelPosition.xy - offsetX);
    float hR = height(modelPosition.xy + offsetX);
    float hD = height(modelPosition.xy - offsetY);
    float hU = height(modelPosition.xy + offsetY);

    // deduce terrain normal
    vec3 N;
    N.x = hL - hR;
    N.y = hD - hU;
    N.z = 2.0;
    N = normalize(N);

    vNormal = N;


    objectNormal = N;
    transformedNormal = normalMatrix * N;
    #include <shadowmap_vertex>



    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}