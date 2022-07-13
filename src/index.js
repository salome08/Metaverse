import Movements from "./movements.js";
import blockchain from "./Web3.js";
import abi from "./abi/abi.js";

// Declaration of new scene with three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

// Camera and renderer configuration
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Setting the scene lights
const ambient_light = new THREE.AmbientLight(0xbda355);
const direction_light = new THREE.DirectionalLight(0xffffff, 1);
ambient_light.add(direction_light);
scene.add(ambient_light);

// Setting up a flat space of the metaverse
const geometry_space = new THREE.BoxGeometry(100, 0.2, 50);
const material_space = new THREE.MeshPhongMaterial({ color: 0xffffff });
const space = new THREE.Mesh(geometry_space, material_space);
scene.add(space);

// Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(10, 10, 30);
scene.add(cube);

// Cone
const geometry_cone = new THREE.ConeGeometry(5, 20, 32);
const material_cone = new THREE.MeshPhongMaterial({ color: 0xff43ff });
const cone = new THREE.Mesh(geometry_cone, material_cone);
cone.position.set(-10, 5, 0);
scene.add(cone);

const myNft = camera.position.set(10, 5, 40);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  cone.rotation.x += 0.01;
  cone.rotation.y += 0.01;
  requestAnimationFrame(animate);

  //Movement to the left
  if (Movements.isPressed(37)) {
    camera.position.x -= 0.5;
  }

  //Movement to Up
  if (Movements.isPressed(38)) {
    camera.position.x += 0.5;
    camera.position.y += 0.5;
  }

  //Movement to right
  if (Movements.isPressed(39)) {
    camera.position.x += 0.5;
  }

  //Movement to down
  if (Movements.isPressed(40)) {
    camera.position.x -= 0.5;
    camera.position.y -= 0.5;
  }

  camera.lookAt(space.position);
  renderer.render(scene, camera);
}

animate();

// New NFT
const buttonMint = document.getElementById("mint");
buttonMint.addEventListener("click", mintNFT);

function mintNFT() {
  var nft_name = document.getElementById("nft-name").value;
  var nft_width = document.getElementById("nft-width").value;
  var nft_height = document.getElementById("nft-height").value;
  var nft_depth = document.getElementById("nft-depth").value;
  var nft_x = document.getElementById("nft-x").value;
  var nft_y = document.getElementById("nft-y").value;
  var nft_z = document.getElementById("nft-z").value;

  // Specify to user that they need to use metamask
  // Detect if metamask is available if not we notify user
  if (typeof window.ethereum == "undefined") {
    rej("You should install Metamask to use it");
  }

  // Web3 instance
  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(
    abi,
    "0x7B447DE2049B579eF411031a02d5b852EB4927AC"
  );

  web3.eth.requestAccounts().then((accounts) => {
    contract.methods
      .mint(nft_name, nft_width, nft_height, nft_depth, nft_x, nft_y, nft_z)
      .send({ from: accounts[0] })
      .then((data) => {
        console.log("NFT available in the Metaverse!");
      });
  });
}

// Web3 connection to the data generated in the blockchain to be represented in the metaverse
blockchain.then((result) => {
  // For each building paid for in the Smart contract gonna be a graphical representtion in the Metaverse
  result.buildings.forEach((building, index) => {
    if (index <= result.supply) {
      // Represent of nft tokens as boxes
      const boxGeometry = new THREE.BoxGeometry(
        building.w,
        building.h,
        building.d
      );
      const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x33fffc });
      const nft = new THREE.Mesh(boxGeometry, boxMaterial);
      nft.position.set(building.x, building.y, building.z);
      scene.add(nft);
    }
  });
});
