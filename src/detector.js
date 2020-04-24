// Code adapted from Google LLC Teachable Machine

import * as mobilenetModule from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import * as knnClassifier from "@tensorflow-models/knn-classifier";

import localforage from "localforage";

const IMAGE_SIZE = 227;
const TOPK = 10;

export default class Detector {
    constructor(stream) {
        // Initiate variables
        this.infoTexts = [];
        this.training = -1; // -1 when no class is being trained
        this.videoPlaying = false;

        // Initiate deeplearn.js math and knn classifier objects
        this.bindPage();

        // Create video element that will contain the webcam image
        this.video = document.createElement("video");
        this.video.setAttribute("autoplay", "");
        this.video.setAttribute("playsinline", "");

        // Add video element to DOM
        document.body.appendChild(this.video);
        this.video.style.display = "none";

        // Setup webcam
        this.video.srcObject = stream;
        this.video.width = IMAGE_SIZE;
        this.video.height = IMAGE_SIZE;
        this.video.addEventListener("playing", () => (this.videoPlaying = true));
        this.video.addEventListener("paused", () => (this.videoPlaying = false));
    }

    setTraining(i) {
        this.training = i;
    }

    async bindPage() {
        this.knn = knnClassifier.create();
        this.mobilenet = await mobilenetModule.load();

        this.start();
    }

    start() {
        this.video.play();
        this.video.ontimeupdate = this.animate.bind(this);
    }

    save() {
        let dataset = this.knn.getClassifierDataset();
        var datasetObj = {};
        Object.keys(dataset).forEach(key => {
            let data = dataset[key].dataSync();
            // use Array.from() so when JSON.stringify() it covert to an array string e.g [0.1,-0.2...]
            // instead of object e.g {0:"0.1", 1:"-0.2"...}
            datasetObj[key] = Array.from(data);
        });
        // can be changed to other source
        return localforage.setItem("knn", datasetObj);
    }

    async load() {
        // can be changed to other source
        let tensorObj = await localforage.getItem("knn");
        // convert back to tensor
        Object.keys(tensorObj).forEach(key => {
            tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1000, 1000]);
        });
        this.knn.setClassifierDataset(tensorObj);
    }

    async animate() {
        if (this.videoPlaying) {
            // Get image data from video element
            const image = tf.fromPixels(this.video);

            let logits;
            // 'conv_preds' is the logits activation of MobileNet.
            const infer = () => this.mobilenet.infer(image, "conv_preds");

            // Train class if one of the buttons is held down
            if (this.training !== -1) {
                logits = infer();

                // Add current image to classifier
                this.knn.addExample(logits, this.training);
            }

            const numClasses = this.knn.getNumClasses();
            if (numClasses > 0) {
                // If classes have been added run predict
                logits = infer();
                const res = await this.knn.predictClass(logits, TOPK);
                this.predictionCallback(res);
            } else {
                this.predictionCallback();
            }

            // Dispose image when done
            image.dispose();
            if (logits != null) {
                logits.dispose();
            }
        }
    }
}
