import { WebGLSketch } from '@jocabola/gfx';

export class App extends WebGLSketch {
	constructor() {
		super(window.innerWidth, window.innerHeight, {
			alpha: false,
			antialias: true
		});
		this.renderer.setClearColor(0xffffff, 1);
		document.body.appendChild(this.domElement);
		this.domElement.className = 'view';
		
		window.addEventListener('resize', (event)=>{
			this.resize(window.innerWidth, window.innerHeight);
		});

		this.camera.position.z = 5;

		this.start();
	}

	update() {
		super.update();
	}
}