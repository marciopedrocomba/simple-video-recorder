//elements
const startBtnEl = document.getElementById('start')
const stopBtnEl = document.getElementById('stop')
const videoEl = document.querySelector('video')

//types
const mimeType = 'video/webm'

//
let _stream
let mediaRecorder

//events

//start button clicked
startBtnEl.onclick = (e) => {
    getCamerePermission()
}

//stop button clicked
stopBtnEl.onclick = (e) => {
    stopRecording()
}


// functions declaration

//get the camera permission and show on the video element
const getCamerePermission = () => {

    navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: true
    }).then(stream => {

        _stream = stream

        videoEl.srcObject = stream
        videoEl.muted = true
        videoEl.play()

        startRecording(stream)

    })

}

//stop recording and download the video
const stopRecording = () => {

    _stream.getTracks().forEach(track => {
        track.stop()
    })

    mediaRecorder.stop()

}

//start recording a video 
const startRecording = (stream) => {

    let chuncks = []

    mediaRecorder = new MediaRecorder(stream, {
        mimeType
    })

    //get all the data available
    mediaRecorder.ondataavailable = (e) => {

        if(e.data.size > 0) chuncks.push(e.data)

    }

    //this will be called when ever the media recorder stop function is called
    mediaRecorder.onstop = (e) => {

        const blob = new Blob(chuncks, {
            type: mimeType
        })

        const filename = `video-${Date.now()}.webm`

        const file = new File([blob], filename, {
            type: mimeType,
            lastModified: Date.now()
        })

        //create the URL
        const URL = window.URL.createObjectURL(blob)

        //create the link element
        const a = document.createElement('a')
        document.body.appendChild(a)

        a.style.display = 'none'
        a.href = URL

        a.download = filename
        a.click()
        
        window.URL.revokeObjectURL(URL)

    } 

    //start recording
    mediaRecorder.start()

} 