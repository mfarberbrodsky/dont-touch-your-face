import React from "react";
import styles from "./Overlay.module.css";
import Tips from "./Tips";
import Tutorial from "./Tutorial";
import TabbedOverlayBox from "./TabbedOverlayBox";
import { Line, Pie } from "react-chartjs-2";
import localforage from "localforage";

const chartOptions = {
    legend: {
        labels: {
            fontColor: "white"
        }
    },
    scales: {
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 5,
                    fontColor: "white"
                }
            }
        ],
        xAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    fontColor: "white"
                }
            }
        ]
    }
};

const pieOptions = {
    legend: {
        labels: {
            fontColor: "white"
        }
    }
};

function hoursMinutesSecondsFormatter(date) {
    return (
        date
            .getHours()
            .toString()
            .padStart(2, "0") +
        ":" +
        date
            .getMinutes()
            .toString()
            .padStart(2, "0") +
        ":" +
        date
            .getSeconds()
            .toString()
            .padStart(2, "0")
    );
}

function monthDayFormatter(date) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    return monthNames[date.getMonth()] + " " + date.getDate();
}

function hourFormatter(date) {
    const hours = date.getHours();
    return (hours > 12 ? hours - 12 : hours) + " " + (hours >= 12 ? "pm" : "am");
}

export default class Overlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alarm: props.alarm,
            detector: null,
            prediction: null,
            detectorReady: false,
            backgroundColor: "rgba(0,0,0,0)",
            allTouches: []
        };
    }

    processTouches(startTime, timeframe, label, dateFormatter) {
        let timeArr = [];
        let labels = [];

        startTime = Math.floor(startTime / timeframe) * timeframe;

        let currTouchI = 0;
        while (this.state.allTouches[currTouchI] < startTime) {
            currTouchI++;
        }

        let currTime = Date.now();
        for (let currTimeframe = 1; currTimeframe <= Math.ceil((currTime - startTime) / timeframe); currTimeframe++) {
            let lastTime = startTime + currTimeframe * timeframe;

            let num = 0;
            while (currTouchI < this.state.allTouches.length && this.state.allTouches[currTouchI] < lastTime) {
                num++;
                currTouchI++;
            }
            timeArr.push(num);

            let date = new Date(lastTime);
            labels.push(dateFormatter(date));
        }

        return {
            labels: labels,
            datasets: [
                {
                    label,
                    backgroundColor: "#50fa7b",
                    borderColor: "#50fa7b",
                    data: timeArr
                }
            ]
        };
    }

    async componentDidMount() {
        let allTouches = await localforage.getItem("allTouches");
        if (allTouches) {
            this.setState({
                allTouches
            });
        }
        this.interval = setInterval(() => this.forceUpdate(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    setDetector(d) {
        this.setState({
            detector: d
        });
    }

    onPrediction(res) {
        if (res) {
            if (
                res.classIndex === 1 &&
                this.state.prediction.classIndex === 0 &&
                this.state.detector.training === -1 &&
                this.state.alarm.readyState === 4
            ) {
                this.state.alarm.currentTime = 0;
                this.state.alarm.play();

                this.setState({
                    allTouches: [...this.state.allTouches, Date.now()]
                });
                localforage.setItem("allTouches", this.state.allTouches);
            }
            if (res.classIndex === 0) {
                this.state.alarm.pause();
            }
            this.setState({
                backgroundColor: res.classIndex === 1 ? "rgba(255, 85, 85, 0.3)" : null,
                prediction: res,
                detectorReady: true
            });
        } else {
            this.setState({
                detectorReady: true
            });
        }
    }

    render() {
        return (
            <div style={{ backgroundColor: this.state.backgroundColor }} className={styles.overlay}>
                <div className={styles.top}>
                    <div>
                        {/* left overlays */}
                        <TabbedOverlayBox tabNames={["10s", "hours", "days"]}>
                            <Line
                                data={this.processTouches(
                                    Date.now() - 5 * 60 * 1000,
                                    10000,
                                    "Number of touches every 10 seconds",
                                    hoursMinutesSecondsFormatter
                                )}
                                options={chartOptions}
                            />
                            <Line
                                data={this.processTouches(
                                    Date.now() - 12 * 60 * 60 * 1000,
                                    60 * 60 * 1000,
                                    "Number of touches every hour",
                                    hourFormatter
                                )}
                                options={chartOptions}
                            />
                            <Line
                                data={this.processTouches(
                                    Date.now() - 7 * 24 * 60 * 60 * 1000,
                                    24 * 60 * 60 * 1000,
                                    "Number of touches every day",
                                    monthDayFormatter
                                )}
                                options={chartOptions}
                            />
                        </TabbedOverlayBox>
                        {this.state.prediction !== null &&
                        Object.keys(this.state.prediction.confidences).length === 2 ? (
                            <div className={styles.overlayBox}>
                                <Pie
                                    data={{
                                        datasets: [
                                            {
                                                data: [
                                                    this.state.prediction.confidences[0],
                                                    this.state.prediction.confidences[1]
                                                ],
                                                backgroundColor: ["#50fa7b", "#ff5555"],
                                                borderWidth: 0
                                            }
                                        ],
                                        labels: ["Probability of not touching face", "Probability of touching face"]
                                    }}
                                    options={pieOptions}
                                />
                            </div>
                        ) : null}
                    </div>
                    <div>
                        <Tutorial />
                        <Tips />
                    </div>
                </div>
                {this.state.detectorReady ? (
                    <div className={styles.bottomBar}>
                        {/* bottom bar */}
                        <button
                            onMouseDown={() => {
                                this.state.detector.setTraining(0);
                            }}
                            onMouseUp={() => {
                                this.state.detector.setTraining(-1);
                            }}
                        >
                            Teach not touching
                        </button>
                        <button
                            onMouseDown={() => {
                                this.state.detector.setTraining(1);
                            }}
                            onMouseUp={() => {
                                this.state.detector.setTraining(-1);
                            }}
                        >
                            Teach touching
                        </button>
                        <button onClick={this.state.detector.save.bind(this.state.detector)}>Save</button>
                        <button
                            onClick={this.state.detector.load.bind(this.state.detector)}
                            className={styles.bottomBarLastButton}
                        >
                            Load
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}
