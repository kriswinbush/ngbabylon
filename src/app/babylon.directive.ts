import { Directive, ElementRef, NgZone, Inject, AfterViewInit } from '@angular/core';
import * as BABYLON from 'babylonjs/es6';
import { WINDOW } from './window.service';

@Directive({
  selector: '[pdiBabylon]'
})
export class BabylonDirective implements AfterViewInit {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;

  constructor(@Inject(WINDOW) private window: Window, private el: ElementRef, private zone: NgZone) {
    console.log(el)
    console.log(BABYLON)
    console.log(window)
    this._canvas = el.nativeElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
  }
  ngAfterViewInit() {
    this.createScene();
    this.doRender();
  }
  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);
    this._camera = new BABYLON.FreeCamera('cam1', new BABYLON.Vector3(0,5,-10, this._scene));

    this._camera.setTarget(BABYLON.Vector3.Zero());
    this._camera.attachControl(this._canvas, true);

    this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,4,0),this._scene);

    let sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments: 16, diameter: 2}, this._scene);

    sphere.position.y = 1;

    let ground = BABYLON.MeshBuilder.CreateGround('ground',{width: 6, height: 6, subdivisions: 2},this._scene)

    let box = BABYLON.MeshBuilder.CreateBox('box1', {height: 5, width: 2, depth: 0.5}, this._scene)
    box.position.y = 4;
    box.position.x = 2;
    box.position.z = -1;

    var myMaterial = new BABYLON.StandardMaterial("myMaterial", this._scene);
    myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    myMaterial.emissiveColor = new BABYLON.Color3(1, 0.5, 0.3);
    box.material = myMaterial;
  }

  doRender(): void {

    this.zone.runOutsideAngular(() => {
      this._engine.runRenderLoop(() => {
        this._scene.render();
      });

      this.window.addEventListener('resize', () => {
        this._engine.resize();
      });

    });

  }
}
