
let forwardTimes = []
let withBoxes = false

// Controls checkbox to allow bounding boxes to be visible
function onChangeHideBoundingBoxes(e) {
    withBoxes = !$(e.target).prop('checked')
}

// Not in currently in use
function updateTimeStats(timeInMs) {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
    const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
    $('#time').val(`${Math.round(avgTimeInMs)} ms`)
    $('#fps').val(`${faceapi.round(1000 / avgTimeInMs)}`)
}

// Main canvas function that controls live video feed
async function onPlay() {
    const videoEl = $('#inputVideo').get(0)

    // if (hideFace) return

    if(videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
        return setTimeout(() => onPlay())


    const options = getFaceDetectorOptions()

    const ts = Date.now()

    const result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks()

    updateTimeStats(Date.now() - ts)

    if (result) {
        drawLandmarks(videoEl, $('#overlay').get(0), [result], withBoxes)
        // console.log(drawLandmarks(videoEl, $('#overlay').get(0), [result], withBoxes))
    }

    setTimeout(() => onPlay())
}

async function run() {
    // load face detection and face landmark models
    await changeFaceDetector(TINY_FACE_DETECTOR)
    await faceapi.loadFaceLandmarkModel('/')
    changeInputSize(224)

    // try to access users webcam and stream the images
    // to the video element
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
    const videoEl = $('#inputVideo').get(0)
    videoEl.srcObject = stream
}

function updateResults() {}

$(document).ready(function() {
    initFaceDetectionControls()
    run()
})

// Left Panel Dashboard
let EventHandler = {
    ShowHideSideBar: function(){


        if (document.getElementById("side-panel").className.indexOf("open") !== -1){
            document.getElementById("side-panel").className = "side-panel"
            document.getElementById("side-panel").className += " close"
            document.getElementById('show_hide').childNodes[0].className = "fa fa-angle-double-right"
            return
        }

        document.getElementById("side-panel").className = "side-panel"
        document.getElementById("side-panel").className += " open"
        document.getElementById('show_hide').childNodes[0].className = "fa fa-angle-double-left"
    }
}

window.onload = () => {
    document.getElementById('show_hide').onclick = EventHandler.ShowHideSideBar
}

// Toggle the face landmarks on and off
$('body').on('click', '#face-toggle-button', function(e) {
    $('#overlay').toggle();
})

// Side buttons to reveal and show various divs
$('body').on('click', 'div#preferences, div#photos, div#twitter, div#facebook, div#instagram', function(e) {
    const id =$(this).attr('id')
    $('#side-panel').removeClass('show-default show-preferences show-photos show-twitter show-facebook show-instagram')
    $('#side-panel').addClass(`show-${id}`)
})

$(function () {
    $(document).scroll(function () {
        var $nav = $("#mainNav");
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    });
});
