import { ThreeDOMLayer, ThreeLayer } from "@fils/gl-dom";
import { PerspectiveCamera } from "three";

export class ThreeSketch extends ThreeLayer {
    camera:PerspectiveCamera;

    constructor(_gl:ThreeDOMLayer) {
        super(_gl);
        const w = this.gl.rect.width;
        const h = this.gl.rect.height;
        this.camera = new PerspectiveCamera(35, w/h, .1, 500);
        this.scene.add(this.camera);
        this.params.camera = this.camera;
    }

    setSize(width: number, height: number): void {
        this.camera.aspect = width/height;
        this.camera.updateProjectionMatrix();
    }

    update(time:number) {
        
    }
}