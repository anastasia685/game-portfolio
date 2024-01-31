varying vec2 vUv;
varying vec3 vNormal;
varying float vElevation;
varying vec3 vPosition;

#include <fog_pars_fragment>
#include <common>
#include <packing>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <dithering_pars_fragment>

void main(){
    vec3 depthColor = vec3(110, 54, 32) / 255.0;
    vec3 baseColor = vec3(150, 77, 32) / 255.0;
    vec3 heightColor = vec3(173, 105, 52) / 255.0;


    vec3 color = mix(depthColor, baseColor, smoothstep(0.0, 1.0, vElevation / 1.3));
    color = mix(color, heightColor, smoothstep(0.15, 1.0, vElevation / 7.5));



    float ambientLightIntensity = 0.55;
    vec3 ambientLightColor = vec3(1.0, 1.0, 1.0);

    vec3 ambientColor =  ambientLightColor * ambientLightIntensity;

    float directionalLightIntensity = 0.65;
    vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
    vec3 directionalLightDirection = normalize(vec3(-1.0, 1.75, 1.0));

    float diffuseFactor = max(0.0, dot(vNormal, directionalLightDirection));
    vec3 directionalColor = directionalLightColor * directionalLightIntensity * diffuseFactor;


    color *= (ambientColor + directionalColor);

    vec3 shadowColor = vec3(0.0);
    float shadowPower = 0.3;

    gl_FragColor = vec4(mix(color, shadowColor, (1.0 - getShadowMask()) * shadowPower), 1.0);

    #include <fog_fragment>
    #include <dithering_fragment>
}