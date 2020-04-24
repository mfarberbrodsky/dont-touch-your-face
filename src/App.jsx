import React, { useState, useRef, useEffect } from "react";
import styles from "./App.module.css";

import Detector from "./detector";
import Camera from "./Camera";
import Overlay from "./Overlay";

const alarm = new Audio("alarm.mp3");
alarm.loop = true;

function App() {
    const [video, setVideo] = useState(null);
    const [detector, setDetector] = useState(null);
    const [overlay, setOverlay] = useState(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (overlayRef.current) {
            overlayRef.current.setDetector(detector);
            detector.predictionCallback = overlayRef.current.onPrediction.bind(
                overlayRef.current
            );
        }
    });

    function onCameraConnected(v, s) {
        setVideo(v);
        let newOverlay = <Overlay ref={overlayRef} alarm={alarm} />;
        let newDetector = new Detector(s, newOverlay.onPrediction);
        setDetector(newDetector);
        setOverlay(newOverlay);
    }

    if (video === null) {
        return (
            <div className={styles.app}>
                <Camera onCameraConnected={onCameraConnected} />
            </div>
        );
    } else {
        return (
            <div className={styles.app}>
                <Camera onCameraConnected={onCameraConnected} />
                {overlay}
            </div>
        );
    }
}

export default App;
