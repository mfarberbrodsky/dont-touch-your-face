# [Dont Touch Your Face](https://www.donttouchyourface.ml)

Don't Touch Your Face is a web application designed to help you break the habit of touching your face, to keep yourself and your surroundings safe of coronavirus.
It uses machine learning to detect and alert when you're touching your face, collects and displays stats and shows tips and facts about coronavirus to keep you informed.

This project was built by [Maya Farber Brodsky](https://github.com/mfarberbrodsky) and [Misha Farber Brodsky](https://github.com/fabemish), for the [repl.it](https://repl.it) COVID19 hackathon. It is accessible at www.donttouchyourface.ml.

## Overview
- Frontend: Built using React.js, and Create React App.
- Machine learning: Built using TensorFlow.js, it uses transfer learning with a pretrained MobileNet image classification model, and a K-Nearest-Neighbour model that is trained in the browser, during execution.