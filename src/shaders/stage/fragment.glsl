varying vec2 vUv;

void main(){
    vec3 baseColor = vec3(0.6);
    vec3 gridColor = vec3(0.8);

    float GRID_WIDTH = 0.04;
    float GRID_COUNT = 20.0;


    float strength = step(1.0 - mod(vUv.x * GRID_COUNT - GRID_WIDTH / 2.0, 1.0), GRID_WIDTH);
    strength += step(1.0 - mod(vUv.y * GRID_COUNT - GRID_WIDTH / 2.0, 1.0), GRID_WIDTH);

    vec3 color = mix(baseColor, gridColor, strength);

    gl_FragColor = vec4(color, 1.0);
}