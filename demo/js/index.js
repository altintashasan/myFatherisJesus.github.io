const video = document.getElementById("myvideo");
const handimg = document.getElementById("handimage");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let nextImageButton = document.getElementById("nextimagebutton");
let updateNote = document.getElementById("updatenote");


let imgindex = 1
let isVideo = false;
let model = null;
var handCount = 0;
var rawspeed;
var speed;
// video.width = 640
// video.height = 480


//specify column number
var column;
//specify row number
var row;
//x coordinate of detected hand
var x;

//y coordinate of detected hand
var y;
var marker;//specify the zone 
var a;
var b;
var commandName;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.4,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "2 hands shows Speed! Waiting..."
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



nextImageButton.addEventListener("click", function(){
    nextImage();
});

trackButton.addEventListener("click", function(){
    toggleVideo();
});

function nextImage() {

    imgindex++;
    handimg.src = "images/" + imgindex % 15 + ".jpg"
    // alert(handimg.src)
    runDetectionImage(handimg)
			    drawBoard();

}



function runDetection() {
    model.detect(video).then(predictions => {
	    handCount = Object.keys(predictions).length;
		
		if (handCount == 1){
        console.log("Predictions: ", predictions);

		x = predictions[0].bbox[0];
		y = predictions[0].bbox[1];
		console.log(x);
		console.log(y);
		checkZone();
		console.log("Column is",column);
		console.log("row is",row);
		findZone();
		console.log("Zone No is", marker);
		handLocation();
		sendCommand();
		}
		

        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
				    drawBoard();

    });
}
function runDetectionImage(img) {
    model.detect(img).then(predictions => {
       // console.log("Predictions: ", predictions);
		//uzunluk = Object.keys(predictions).length;
        model.renderPredictions(predictions, canvas, context, img);
		    drawBoard();

    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Camera Speed View"
    runDetectionImage(handimg)
    trackButton.disabled = false
    nextImageButton.disabled = false
			    drawBoard();

});

//some script from web, to draw a grid board on video
	var bw = 640;
    var bh = 480;
    var p = 0;
    var cw = bw + (p*2) + 1;
    var ch = bh + (p*2) + 1;

    function drawBoard(){
        for (var x = 0; x <= bw; x += 212	) {
            context.moveTo(1 + x + p, p);
            context.lineTo(1 + x + p, bh + p);
        }

       for (var x = 0; x <= bh; x += 160) {
            context.moveTo(p, 1 + x + p);
            context.lineTo(bw + p, 1 + x + p);
        }

        context.strokeStyle = "blue";
        context.stroke();
    }
drawBoard();
/*
** captured image divided by nine zone. this zone are specified by row and columns. by using predictions object we can access x and y coordinate of and
** image. To find the row and column info checkzone function is used for.
*/

function checkZone(){
if (x < 213){
column = 1;
}

else if (x < 426){
column = 2;
}

else if (x < 640){
column = 3;
}

if (y < 160){
row = 1;
}

else if (y < 320){
row = 2;
}

else if (y < 480){
row = 3;
}
}

/* The image was divided by 9 zone. to find the zone, we can check  row and column number. 
**findZone function gives us zone information of recognnized hand/hands.
*/
function findZone(){
	
	if (column == 1 && row == 1){
	
	marker = 1
	
	}
	
	if (column == 1 && row == 2){
	
	marker = 4
	
	}
	
	if (column == 1 && row == 3){
	
	marker = 7
	
	}
	
	if (column == 2 && row == 1){
	
	marker = 2
	
	}
	
	if (column == 2 && row == 2){
	
	marker = 5
	
	}
	
		if (column == 2 && row == 3){
	
	marker = 8
	
	}
	
		if (column == 3 && row == 1){
	
	marker = 3
	
	}
	
		if (column == 3 && row == 2){
	
	marker = 6
	
	}
	
		if (column == 3 && row == 3){
	
	marker = 9
	
	}
	
}

function handLocation(){

	if (marker == 5){
		a = 1;
		
	}
	if (marker != 5){
	b = marker;
	}
	

}


function sendCommand(){

	if (a == 1){
		if (b==1){
		updateNote.innerText = "TopLeft movement";
		console.log("LeftUp");
		a=0;
		b=0;
		commandName = "ptzMoveTopLeft";
		httpCommandSend();

		return;
		}
		if (b==2){
		updateNote.innerText = "Up movement";
		console.log("Up");
		a=0;
		b=0;
		commandName = "ptzMoveUp";
		httpCommandSend();
		return;
		}
		
		if (b==3){
		updateNote.innerText = "TopRight movement";
		console.log("TopRight");
		a=0;
		b=0;
		commandName = "ptzMoveTopRight";
		httpCommandSend();
		return;
		}
	
		if (b==4){
		updateNote.innerText = "Left movement";
		console.log("Left");

		commandName = "ptzMoveLeft";
		httpCommandSend();
		
		a=0;
		b=0;
		
		return;
		}
		if (b==6){
		updateNote.innerText = "Right movement";
		console.log("Right");
		a=0;
		b=0;
		return;
		}
		if (b==7){
		updateNote.innerText = "BottomLeft movement";
		console.log("BottomLeft");
		a=0;
		b=0;
		return;
		}
		
		if (b==8){
		updateNote.innerText = "Down movement";
		console.log("Down");
		a=0;
		b=0;
		return;
		}
	
		if (b==9){
		updateNote.innerText = "BottomRight movement";
		console.log("BottomRight");
		a=0;
		b=0;
		return;
		}
		
		
		
	}


}



function httpCommandSend(){


		const Http = new XMLHttpRequest();

		const url='https://leszped.tmit.bme.hu/smartcity-control/c.php?/cgi-bin/CGIProxy.fcgi?cmd=';
		Http.open("GET", url.concat(commandName));
		Http.setRequestHeader('Content-Type', 'application/xml');
		Http.send();
		Http.onreadystatechange = (e) => {
		console.log(typeof Http.responseText)
		rawspeed = Http.responseText.replace( /[^\d.]/g, '' );
		speed = parseInt(rawspeed,10);
		
		updateNote.innerText = "Camera speed is "+ speed;


}
}