var gl;

var selectedArray = [];

var optionsArray = ["Catamaran",
"Surfboard",
"Short Catamaran",
"Short Surfboard",
"Solar Panel",
"Air Propeller",
"Single Water Propeller",
"Dual Water Propellers",
"Propeller Cage",
"Two Large Enclosures",
"Three Small Enclosures",
"12V Lithium Phosphate (10 AH)",
"12V Lithium Phosphate (23 AH)",
"12V Lithium Phosphate (46 AH)",
"Wireless Serial (up to 500m)",
"Cellular USB Stick",
"Satellite Modem"];


//i there is no .obj in the string, there is no associated change in model
var optionsModelArray = ['catamaranLong.obj',
	'surfboardLong.obj',
	'catamaranShort',
	'surfboardShort',
	'solarPanel.obj',
	'airPropeller.obj',
	'singleWaterPropeller.obj',
	'dualWaterPropeller.obj',
	'propellerCage.obj',
	'twoLargeEnclosures.obj',
	'threeSmallEnclosures.obj',
	'battery10',
	'battery23',
	'battery46',
	'wirelessSerial',
	'cellularUSB',
	'satelliteModem'
]


var optionsModelMaterialArray = ['catamaranLong.mtl',
	'surfboardLong.mtl',
	'catamaranShort.mtl',
	'surfboardShort.mtl',
	'solarPanel.mtl',
	'airPropeller.mtl',
	'singleWaterPropeller.mtl',
	'dualWaterPropeller.mtl',
	'propellerCage.mtl',
	'twoLargeEnclosures.mtl',
	'threeSmallEnclosures.mtl',
	'battery10.mtl',
	'battery23.mtl',
	'battery46.mtl',
	'wirelessSerial.mtl',
	'cellularUSB.mtl',
	'satelliteModem.mtl'
]

var pricesArray = [100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100];

var weightsArray = [100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100,
100];

var currencyArray = [
	"CAD",
	"USD",
	"Euro"
];

//updated 2020-08-16
var exchangeRatesFromCAD = [
	1.00,
	0.76,
	0.64
];

if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
        }

var container;

var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;

init();
animate();

function init() {

		container = document.getElementById("canvasDiv");
    /* Camera */

    camera = new THREE.PerspectiveCamera(45, 400 / 400, 1, 1000);
    camera.position.z = -300;


    /* Scene */

    scene = new THREE.Scene();
    lighting = false;

    ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    /* Model */

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl('assets/');
    mtlLoader.setPath('assets/');
    mtlLoader.load('catamaranLong.mtl', function (materials) {

        materials.preload();


        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('assets/');
        objLoader.load('catamaranLong.obj', function (object) {
            scene.add(object);
        });
    });

    /* Renderer */

		var cWidth = document.getElementById("canvasDiv").offsetWidth;

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(cWidth-25, cWidth-25);
    renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

    container.appendChild(renderer.domElement);

    /* Controls */

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
		controls.minDistance=100;
		controls.maxDistance=500;

		controls.keys = {
			LEFT: 39, //left arrow
			UP: 40, // up arrow
			RIGHT: 37, // right arrow
			BOTTOM: 38 // down arrow
		}

    /* Events */

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyboardEvent, false);

}

function onWindowResize() {

  console.log("onWindowResize");


}

function onKeyboardEvent(e) {

    if (e.code === 'KeyL') {

        lighting = !lighting;

        if (lighting) {

            ambient.intensity = 0.25;
            scene.add(keyLight);
            scene.add(fillLight);
            scene.add(backLight);

        } else {

            ambient.intensity = 1.0;
            scene.remove(keyLight);
            scene.remove(fillLight);
            scene.remove(backLight);

        }

    }

		// else if (e.code === 'KeyZ') {
		// 	camera.position.z +=10;
		// }
		//
		// else if (e.code === 'KeyX') {
		// 	camera.position.z -=10;
		// }

}

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    render();

}

function render() {

    renderer.render(scene, camera);

}

var AddObject = function(i){
	var objectBase;
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setBaseUrl('assets/');
	mtlLoader.setPath('assets/');


	mtlLoader.load(optionsModelMaterialArray[i], function (materials) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath('assets/');

				objLoader.load(optionsModelArray[i], function (object) {
						scene.add(object);
				});

		});
}

var AddAlternateObject = function(stringVal){
	var objectBase;
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setBaseUrl('assets/');
	mtlLoader.setPath('assets/');


	mtlLoader.load(stringVal + ".mtl", function (materials) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath('assets/');

				objLoader.load(stringVal + ".obj", function (object) {
						scene.add(object);
				});

		});
}

var UpdateModel = function (){

	scene.remove.apply(scene, scene.children);

	/* Scene */

	scene = new THREE.Scene();
	lighting = false;

	ambient = new THREE.AmbientLight(0xffffff, 1.0);
	scene.add(ambient);

	keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
	keyLight.position.set(-100, 0, 100);

	fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
	fillLight.position.set(100, 0, 100);

	backLight = new THREE.DirectionalLight(0xffffff, 1.0);
	backLight.position.set(100, 0, -100).normalize();

	/*Model*/
	for (var i =0;i<optionsArray.length;i++){
		if (selectedArray[i]===1 && optionsModelArray[i].includes(".obj")){
			if (optionsModelArray[i].includes("propellerCage") && (selectedArray[6]===1 || selectedArray[7]===1) ){
				//if water option selected, propeller cage is different
				//AddAlternateObject("propellerCageEmpty");
				//no file to add in this case though, but you would add it here
				console.log("Water propeller cage");
			}
			else if ( optionsModelArray[i].includes("propellerCage") && selectedArray[10]===1 ){
				//three boxes selected, load lower propeller
				AddAlternateObject("propellerCageLower");
			}
			else if ( optionsModelArray[i].includes("airPropeller") && selectedArray[10]===1 ){
				//three boxes selected, load lower propeller
				AddAlternateObject("airPropellerLower");
			}
			else if ( optionsModelArray[i].includes("dualWaterPropeller") && selectedArray[1]===1 ){
				//dual water for surfboard
				AddAlternateObject("dualPropSurf");
			}
			else if ( optionsModelArray[i].includes("singleWaterPropeller") && selectedArray[1]===1 ){
				//single water for surfboard
				AddAlternateObject("singlePropSurf");
			}
			else{
				AddObject(i);
			}

		}
	}
};




var InitDemo = function () {

	//-----------------CHECKLIST COMMUNICATIONS--------------------------------------

	var checkList = document.getElementById("communicationsBoxes");
	var checkedBoxes;
	// When the user clicks on the button, open the modal
	checkList.addEventListener( 'change', function() {
	  	checkedBoxes = checkList.querySelectorAll('input[type="checkbox"]:checked').length;
			if (checkedBoxes===0){
				document.getElementById("primary").checked = "checked";
				alert("Please Select At Least One Communication Method")
			}
			CalculateCostAndWeight();
	});

	var checkBox = document.getElementById("solarCheck");
	checkBox.addEventListener( 'change', function() {
		CalculateCostAndWeight();
	});
	var checkBox2 = document.getElementById("propCheck");
	checkBox2.addEventListener( 'change', function() {
		CalculateCostAndWeight();
	});

	//-----------------------MODAL JS----------------------------------
	// Get the modal
	var modal = document.getElementById("myModal");

	// Get the button that opens the modal
	var btn = document.getElementById("myBtn");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on the button, open the modal
	btn.onclick = function() {
	  modal.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	  if (event.target == modal) {
	    modal.style.display = "none";
	  }
	}
	//------------------END OF MODAL----------------------------------

	//---------------------DROPDOWN JS----------------------------------
	var x, i, j, l, ll, selElmnt, a, b, c;
	/* Look for any elements with the class "custom-select": */
	x = document.getElementsByClassName("custom-select");
	l = x.length;
	for (i = 0; i < l; i++) {
	  selElmnt = x[i].getElementsByTagName("select")[0];
	  ll = selElmnt.length;
	  /* For each element, create a new DIV that will act as the selected item: */
	  a = document.createElement("DIV");
	  a.setAttribute("class", "select-selected");
	  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
	  x[i].appendChild(a);
	  /* For each element, create a new DIV that will contain the option list: */
	  b = document.createElement("DIV");
	  b.setAttribute("class", "select-items select-hide");
	  for (j = 0; j < ll; j++) {
	    /* For each option in the original select element,
	    create a new DIV that will act as an option item: */
	    c = document.createElement("DIV");
			//c=selElmnt.textContent.split(",")[0];
	    c.innerHTML = selElmnt.options[j].innerHTML;
			var currentTitle= c.textContent.split(",")[0];
			var currentDesc= c.textContent.split(",")[1];

			c1=document.createElement("DIV");
			c1.innerHTML=currentTitle;
			c2=document.createElement("DIV");
			c2.innerHTML=currentDesc;



	    c.addEventListener("click", function(e) {
	        /* When an item is clicked, update the original select box,
	        and the selected item: */

	        var y, i, k, s, h, sl, yl;
	        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
	        sl = s.length;
	        h = this.parentNode.previousSibling;
	        for (i = 0; i < sl; i++) {
	          if (s.options[i].innerHTML == this.innerHTML) {
	            s.selectedIndex = i;
	            h.innerHTML = this.innerHTML;
	            y = this.parentNode.getElementsByClassName("same-as-selected");

	            yl = y.length;
	            for (k = 0; k < yl; k++) {
	              y[k].removeAttribute("class");
	            }
	            this.setAttribute("class", "same-as-selected");
	            break;
	          }
	        }
	        h.click();
					CalculateCostAndWeight();
	    });
	    b.appendChild(c);
	  }
	  x[i].appendChild(b);
	  a.addEventListener("click", function(e) {
	    /* When the select box is clicked, close any other select boxes,
	    and open/close the current select box: */
	    e.stopPropagation();
	    closeAllSelect(this);
	    this.nextSibling.classList.toggle("select-hide");
	    this.classList.toggle("select-arrow-active");
	  });
	}

	function closeAllSelect(elmnt) {
	  /* A function that will close all select boxes in the document,
	  except the current select box: */
	  var x, y, i, xl, yl, arrNo = [];
	  x = document.getElementsByClassName("select-items");
	  y = document.getElementsByClassName("select-selected");
	  xl = x.length;
	  yl = y.length;
	  for (i = 0; i < yl; i++) {
	    if (elmnt == y[i]) {
	      arrNo.push(i)
	    } else {
	      y[i].classList.remove("select-arrow-active");
	    }
	  }
	  for (i = 0; i < xl; i++) {
	    if (arrNo.indexOf(i)) {
	      x[i].classList.add("select-hide");
	    }
	  }
	}

	/* If the user clicks anywhere outside the select box,
	then close all select boxes: */
	document.addEventListener("click", closeAllSelect);
//-----------------END DROPDOWN JS------------------------------------

CalculateCostAndWeight();

};

var CalculateCostAndWeight = function(){


	var totalPrice=0;
	var totalWeight=0;
	var communicationsString = "";
	var selectedCurrencyIndex=0;
	document.querySelectorAll('.selectedSolar')[0].innerHTML = ("Solar Panel: Not Selected");
	document.querySelectorAll('.selectedCage')[0].innerHTML = ("Propeller Cage: Not Selected");

	selectedArray=[];
	for (var i = 0; i < optionsArray.length; i++){
		selectedArray.push(0);
	}

	//Iterate through drop downs
	var selects = document.getElementsByClassName("select-selected");
	for (var i = 0; i < selects.length; i++) {
		 selectedString=selects.item(i).textContent;
		 for (var j = 0; j < optionsArray.length; j++) {
			 if (selectedString === optionsArray[j]){
				 if (j<4){
					 //Base Type
					 document.querySelectorAll('.selectedBase')[0].innerHTML = ("Base Type: ").concat(selectedString);
				 }
				 else if (j>=5 && j<=7){
					 //Propeller
					 document.querySelectorAll('.selectedPropulsion')[0].innerHTML = ("Propulsion: ").concat(selectedString);
				 }
				 else if (j>=9 && j<=10){
					 //Electronic Boxes
					 document.querySelectorAll('.selectedEB')[0].innerHTML = ("Electronics Boxes: ").concat(selectedString);
				 }
				 else if (j>=11 && j<=13){
					 //Battery
					 document.querySelectorAll('.selectedBattery')[0].innerHTML = ("Battery: ").concat(selectedString);
				 }


				 totalPrice += pricesArray[j];
				 totalWeight += weightsArray[j];
				 selectedArray[j]=1;
				 break;
			 }
		 }
		 for (var j = 0; j < currencyArray.length; j++) {
			  if (selectedString === currencyArray[j]){
					selectedCurrencyIndex=j;
					break;
				}
		 }
	}

	//Iterate through checkboxes
	var checkedBoxArr = document.querySelectorAll('input[type=checkbox]:checked');
	var labelArray = [];
	for (var i = 0; i < checkedBoxArr.length; i++) {
		 labelArray.push(checkedBoxArr.item(i).parentElement.textContent.trim());
	}
	for (var i = 0; i < checkedBoxArr.length; i++) {
		selectedString=labelArray[i];
		for (var j = 0; j < optionsArray.length; j++) {
			if (selectedString === optionsArray[j]){
				if (j==4){
					//Solar
					document.querySelectorAll('.selectedSolar')[0].innerHTML = ("Solar Panel: Selected");
				}
				else if (j==8){
					//Propeller Cage
					document.querySelectorAll('.selectedCage')[0].innerHTML = ("Propeller Cage: Selected");
				}
				else if (j>=14 && j<=16){
					//coms
					if (communicationsString != ""){
						communicationsString = communicationsString.concat(", ");
					}
					communicationsString = communicationsString.concat(selectedString);
					document.querySelectorAll('.selectedCom')[0].innerHTML = ("Communications: ").concat(communicationsString);
				}

				totalPrice += pricesArray[j];
				totalWeight += weightsArray[j];
				selectedArray[j]=1;
				break;
			}
		}
	}



	 totalPrice = totalPrice*exchangeRatesFromCAD[selectedCurrencyIndex];
	 if (selectedCurrencyIndex==0){
		 document.querySelectorAll('.total')[0].innerHTML = ("Price: $").concat((totalPrice).toFixed(2));
	 }
	 else if (selectedCurrencyIndex==1){
		 document.querySelectorAll('.total')[0].innerHTML = ("Price: $").concat((totalPrice).toFixed(2));
	 }
	 else{
		 document.querySelectorAll('.total')[0].innerHTML = ("Price: ").concat(String.fromCharCode(8364)).concat((totalPrice).toFixed(2));
	 }


	 document.querySelectorAll('.weight')[0].innerHTML = ("Weight: ").concat((totalWeight).toFixed(0)).concat("kg");

	 UpdateModel();
};
