import React, {useState, useEffect, useRef} from 'react';
import styles from './Camera.module.css';

export default function Camera(props) {
  const [stream, setStream] = useState(props.stream || null);
  const videoEl = useRef(null);

  useEffect(() => {
    if (stream !== null && videoEl && videoEl.current.srcObject !== stream) {
      videoEl.current.srcObject = stream
      videoEl.current.onloadedmetadata = function(e) {
        videoEl.current.play()
        props.onCameraConnected(videoEl.current, stream)
      }
    }
  })

  async function askForPermissions() {
    try {
      setStream(await navigator.mediaDevices.getUserMedia({ video: true }));
    } catch (err) {}
  }

  if (stream === null) {
    return (
      <div className={styles.noCamera} onClick={askForPermissions}>
        Click here to enable camera permissions.
      </div>
    )
  } else {
    return (
      <div className={styles.camera}>
        <video className={styles.cameraVideo} ref={videoEl}></video>
      </div>
    )
  }
}