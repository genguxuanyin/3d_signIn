<script>
import { OBJLoader } from "./loaders/OBJLoader";
import { MTLLoader } from "./loaders/MTLLoader";
import { SVGLoader } from "./loaders/SVGLoader";
import { toIndexed } from "./util";
import { CSS3DObject } from "./renderer/CSS3DRenderer";
import mixin from "./model-mixin.vue";

import * as THREE from "three";
var TWEEN = require("@tweenjs/tween.js");
import { getSize, getCenter } from "./util";

export default {
  name: "model-svg",
  mixins: [mixin],
  props: {
    lights: {
      type: Array,
      default() {
        return [
          {
            type: "ambientlight",
            color: 0xffffff,
            intensity: 0.8
          },
          {
            type: "hemispherelight",
            position: { x: 0, y: 1, z: 0 },
            skyColor: 0xaaaaff,
            groundColor: 0x806060,
            intensity: 0.6
          },
          {
            type: "directionallight",
            position: { x: 1, y: 1, z: 1 },
            color: 0xffffff,
            intensity: 0.8
          }
        ];
      }
    },
    smoothing: {
      type: Boolean,
      default: false
    },
    hasSkyBox: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const svgLoader = new SVGLoader();
    return {
      loader: svgLoader,
      MAXNUMBER: 256,
      table: [],
      objects: [],
      targets: {
        sphere: [],
        logo: []
      }
    };
  },
  watch: {
    skyBox() {
      if (this.hasSkyBox) {
        this.createSkyBox();
      }
    }
  },
  created() {
    this.initScene();
  },
  methods: {
    initScene() {
      const data = [
        { avatar: "../../images/1.jpg" },
        { avatar: "../../images/2.jpg" },
        { avatar: "../../images/3.jpg" },
        { avatar: "../../images/4.jpg" },
        { avatar: "../../images/5.jpg" },
        { avatar: "../../images/6.jpg" },
        { avatar: "../../images/7.jpg" },
        { avatar: "../../images/8.jpg" },
        { avatar: "../../images/9.jpg" },
        { avatar: "../../images/10.jpg" },
        { avatar: "../../images/11.jpg" },
        { avatar: "../../images/12.jpg" }
      ];
      var cw = 150,
        hn = 25,
        wn = 40;
      this.MAXNUMBER = hn * wn;
      var index;
      for (let i = 0; i < this.MAXNUMBER; i++) {
        index = parseInt(Math.random() * data.length);
        this.table.push(data[index]);
      }
      for (var i = 0; i < this.table.length; i++) {
        var element = document.createElement("div");
        element.className = "element";
        element.style.background = `rgba(0,127,127,${Math.random() * 0.5 +
          0.25}) url(${this.table[i].avatar}) no-repeat center center`;
        element.style.backgroundSize = `100% 100%`;

        var object = new CSS3DObject(element);
        object.position.x = Math.random() * 8000 - 4000;
        object.position.y = Math.random() * 8000 - 4000;
        object.position.z = Math.random() * 8000 - 4000;
        this.scene.add(object);
        this.objects.push(object);
      }

      // sphere

      var vector = new THREE.Vector3();
      var spherical = new THREE.Spherical();

      for (var i = 0, l = this.objects.length; i < l; i++) {
        var phi = Math.acos(-1 + (2 * i) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;

        var object = new THREE.Object3D();

        spherical.set(1000, phi, theta);

        object.position.setFromSpherical(spherical);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        this.targets.sphere.push(object);
      }

      // Logo
      for (var i = -wn / 2; i < wn / 2; i++) {
        for (var j = -hn / 2 + 2; j < hn / 2 + 2; j++) {

            var object = new THREE.Object3D();

            object.position.set(i * cw, j * cw, 0);

            this.targets.logo.push(object);
        }
      }

      this.transform(this.targets.logo, 3000);
    },
    process(object) {
      if (this.smoothing) {
        object.traverse(child => {
          if (child.geometry) {
            child.geometry = toIndexed(child.geometry);
            child.geometry.computeVertexNormals();
          }
        });
      }
    },
    load() {
      if (!this.src) return;

      if (this.object) {
        this.wrapper.remove(this.object);
      }

      const onLoad = paths => {
        var group = new THREE.Group();
        group.scale.multiplyScalar(0.25);
        group.position.x = -70;
        group.position.y = 70;
        group.scale.y *= -1;

        for (var i = 0; i < paths.length; i++) {
          var path = paths[i];

          var material = new THREE.MeshBasicMaterial({
            color: path.color,
            side: THREE.DoubleSide,
            depthWrite: false
          });

          var shapes = path.toShapes(true);

          for (var j = 0; j < shapes.length; j++) {
            var shape = shapes[j];

            var geometry = new THREE.ShapeBufferGeometry(shape);
            var mesh = new THREE.Mesh(geometry, material);

            group.add(mesh);
          }
        }

        if (this.process) {
          this.process(group);
        }

        this.addObject(group);

        this.$emit("on-load");
      };

      const onProgress = xhr => {
        this.$emit("on-progress", xhr);
      };

      const onError = err => {
        this.$emit("on-error", err);
      };
      this.loader.load(this.src, onLoad, onProgress, onError);
    },
    createSkyBox() {
      if (!this.hasSkyBox) return;
      var cubeMap = new THREE.CubeTexture([]);
      cubeMap.format = THREE.RGBFormat;
      new THREE.ImageLoader().load("../../../static/images/skybox.png", img => {
        var size = 256;
        var getSide = function(x, y) {
          var canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          canvas.fillStyle = "#aec5da";
          var context = canvas.getContext("2d");
          if (img) {
            context.drawImage(img, -x * size, -y * size);
          }

          return canvas;
        };
        cubeMap.images[0] = getSide(2, 1); // px
        cubeMap.images[1] = getSide(0, 1); // nx
        cubeMap.images[2] = getSide(1, 0); // py
        cubeMap.images[3] = getSide(1, 2); // ny
        cubeMap.images[4] = getSide(1, 1); // pz
        cubeMap.images[5] = getSide(3, 1); // nz
        cubeMap.needsUpdate = true;

        var cubeShader = THREE.ShaderLib["cube"];
        cubeShader.uniforms["tCube"].value = cubeMap;
        var skyBoxMaterial = new THREE.ShaderMaterial({
          fragmentShader: cubeShader.fragmentShader,
          vertexShader: cubeShader.vertexShader,
          uniforms: cubeShader.uniforms,
          depthWrite: false,
          side: THREE.BackSide
        });

        var skyBox = new THREE.Mesh(
          new THREE.BoxGeometry(size * 30, size * 30, size * 30),
          skyBoxMaterial
        );
        //this.addObject( skyBox )
        this.wrapper.add(skyBox);
      });
    },
    transform: function(targets, duration) {
      TWEEN.removeAll();

      for (var i = 0; i < this.objects.length; i++) {
        var object = this.objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
          .to(
            {
              x: target.position.x,
              y: target.position.y,
              z: target.position.z
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to(
            {
              x: target.rotation.x,
              y: target.rotation.y,
              z: target.rotation.z
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      /*  new TWEEN.Tween(this)
                .to({}, duration * 2)
                .onUpdate(this.render)
                .start();

            var pos = this.camera.position;
            new TWEEN.Tween(pos)
                .to({
                    x: 0,
                    y: -120,
                    z: 1200
                }, duration / 2)
                .onUpdate(this.render)
                .delay(duration * 2)
                .start().onComplete(()=>{
                    this.controls.autoRotate = true;
                }); */
    }
  }
};
</script>
