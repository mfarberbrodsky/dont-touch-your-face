import React, { useState } from "react";
import styles from "./Tips.module.css";

const tips = [
    {
        title: "Wash your hands frequently",
        description:
            "Regularly and thoroughly clean your hands with an alcohol-based hand rub or wash them with soap and water."
    },
    {
        title: "Maintain social distancing",
        description:
            "Maintain at least 1 metre (3 feet) distance between yourself and anyone who is coughing or sneezing."
    },
    {
        title: "Avoid touching eyes, nose and mouth",
        description:
            "Hands touch many surfaces and can pick up viruses. Once contaminated, hands can transfer the virus to your eyes, nose or mouth. From there, the virus can enter your body and can make you sick."
    },
    {
        title: "Practice respiratory hygiene",
        description:
            "Make sure you, and the people around you, follow good respiratory hygiene. This means covering your mouth and nose with your bent elbow or tissue when you cough or sneeze. Then dispose of the used tissue immediately."
    },
    {
        title: "COVID-19 virus can be transmitted in areas with hot and humid climates ",
        description:
            "From the evidence so far, the COVID-19 virus can be transmitted in ALL AREAS, including areas with hot and humid weather. Regardless of climate, adopt protective measures if you live in, or travel to an area reporting COVID-19. The best way to protect yourself against COVID-19 is by frequently cleaning your hands. By doing this you eliminate viruses that may be on your hands and avoid infection that could occur by then touching your eyes, mouth, and nose."
    },
    {
        title: "Cold weather and snow CANNOT kill the new coronavirus.",
        description:
            "There is no reason to believe that cold weather can kill the new coronavirus or other diseases. The normal human body temperature remains around 36.5°C to 37°C, regardless of the external temperature or weather. The most effective way to protect yourself against the new coronavirus is by frequently cleaning your hands with alcohol-based hand rub or washing them with soap and water."
    },
    {
        title: "The new coronavirus CANNOT be transmitted through mosquito bites.",
        description:
            "To date there has been no information nor evidence to suggest that the new coronavirus could be transmitted by mosquitoes. The new coronavirus is a respiratory virus which spreads primarily through droplets generated when an infected person coughs or sneezes, or through droplets of saliva or discharge from the nose. To protect yourself, clean your hands frequently with an alcohol-based hand rub or wash them with soap and water. Also, avoid close contact with anyone who is coughing and sneezing."
    },
    {
        title: "Are hand dryers effective in killing the new coronavirus?",
        description:
            "No. Hand dryers are not effective in killing the 2019-nCoV. To protect yourself against the new coronavirus, you should frequently clean your hands with an alcohol-based hand rub or wash them with soap and water. Once your hands are cleaned, you should dry them thoroughly by using paper towels or a warm air dryer."
    },
    {
        title: "How effective are thermal scanners in detecting people infected with the new coronavirus?",
        description:
            "Thermal scanners are effective in detecting people who have developed a fever (i.e. have a higher than normal body temperature) because of infection with the new coronavirus. However, they cannot detect people who are infected but are not yet sick with fever. This is because it takes between 2 and 10 days before people who are infected become sick and develop a fever."
    },
    {
        title: "Can spraying alcohol or chlorine all over your body kill the new coronavirus?",
        description:
            "No. Spraying alcohol or chlorine all over your body will not kill viruses that have already entered your body. Spraying such substances can be harmful to clothes or mucous membranes (i.e. eyes, mouth). Be aware that both alcohol and chlorine can be useful to disinfect surfaces, but they need to be used under appropriate recommendations."
    },
    {
        title: "Should I wear a mask to protect myself?",
        description:
            "Only wear a mask if you are ill with COVID-19 symptoms (especially coughing) or looking after someone who may have COVID-19. Disposable face mask can only be used once. If you are not ill or looking after someone who is ill then you are wasting a mask. There is a world-wide shortage of masks, so WHO urges people to use masks wisely."
    },
    {
        title: "How long is the incubation period for COVID-19?",
        description:
            "The “incubation period” means the time between catching the virus and beginning to have symptoms of the disease. Most estimates of the incubation period for COVID-19 range from 1-14 days, most commonly around five days. These estimates will be updated as more data become available."
    }
];

export default function Tips() {
    const [currTip, setCurrTip] = useState(Math.floor(Math.random() * tips.length));
    const [lastTime, setLastTime] = useState(Date.now());

    function cycle() {
        setLastTime(Date.now());
        setCurrTip((currTip + 1) % tips.length);
    }

    if (Date.now() - 30000 > lastTime) {
        cycle();
    }

    return (
        <div className={styles.Tips}>
            <div className={styles.progressBar}>
                <div style={{ width: (Date.now() - lastTime) / 300 + "%" }} className={styles.progressBarInner}></div>
            </div>
            <h2>{tips[currTip].title}</h2>
            <p>{tips[currTip].description}</p>
            <button onClick={cycle}>Next tip</button>
        </div>
    );
}
