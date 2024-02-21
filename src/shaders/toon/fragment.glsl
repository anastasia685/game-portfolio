varying vec3 vNormal;

void main(){
    vec3 lightDirection = normalize(vec3(-1.0, 1.75, 1.5));

    vec3 blackColor = vec3(54.0/255.0, 32.0/255.0, 4.0/255.0);
    vec3 shadowColor = vec3(128.0/255.0, 74.0/255.0, 8.0/255.0);
    vec3 baseColor = vec3(196.0/255.0, 121.0/255.0, 29.0/255.0);
    vec3 highlightColor = vec3(232.0/255.0, 171.0/255.0, 97.0/255.0);

    vec3 color;
    float intensity = dot(normalize(vNormal), lightDirection);

    if (intensity > 0.95){
        color = highlightColor;
    } else if (intensity > 0.5) {
        color = baseColor;
    } else if (intensity > 0.2) {
        color = shadowColor;
    } else {
        color = blackColor;
    }

    gl_FragColor = vec4(color, 1.0);
}