import React, { useState } from "react";
import styles from "./Tutorial.module.css";

const tutorial = [
    {
        title: "Don't touch your face!",
        text: (
            <p>
                This is a website designed to help you break the habit of touching your face, in order to keep yourself
                and your surroundings safe of coronavirus. It uses machine learning techniques to detect when you're
                touching your face, and warns you every time you do.
            </p>
        )
    },
    {
        title: "Time to teach the computer.",
        text: (
            <p>
                In order to teach the machine learning model to recognize when you're touching your face, you need to
                train it. Hold the "Teach not touching" button for a few seconds while not touching your face, and do
                the same for the "Teach touching" button (make sure to wash your hands before you touch your face!). Try
                to move around while doing this, to make sure the camera captures you from different angles.
            </p>
        )
    },
    {
        title: "It works!",
        text: (
            <p>
                Everything should be working now! Try touching your face, and see what happens. If anything's not
                working correctly just train it again to make sure it learns from its mistakes. Save the model when
                you're happy with it using the save button, so that you can load it next time you visit the website!
            </p>
        )
    },
    {
        title: "About Us",
        text: (
            <p>
                This project was created for the Repl.it Code Jam, by Misha Farber Brodsky (
                <a href="https://repl.it/@liltaco" target="_blank" rel="noopener noreferrer">
                    @LilTaco
                </a>
                ) and Maya Farber Brodsky (
                <a href="https://repl.it/@AlephZero" target="_blank" rel="noopener noreferrer">
                    @AlephZero
                </a>
                ).
            </p>
        )
    },
    {
        title: "Behind the scenes",
        text: (
            <p>
                The machine learning model powering this website was adapted from the code used to build Google's
                Teachable Machine. It uses a technique called transfer learning. There is a pretrained neural network
                that can classify images, and it feeds its second-to-last layer to a K-Nearest-Neighbors model, that
                fits itself to your images. By the way, you can use this to detect anything, not just touching your
                face!
            </p>
        )
    }
];

export default function Tutorial() {
    const [step, setStep] = useState(0);
    return (
        <div className={styles.Tutorial}>
            <h2>{tutorial[step].title}</h2>
            {tutorial[step].text}

            {step + 1 < tutorial.length ? <button onClick={() => setStep(step + 1)}>Next</button> : null}
            {step !== 0 ? (
                <button onClick={() => setStep(step - 1)} className={styles.left}>
                    Previous
                </button>
            ) : null}
        </div>
    );
}
