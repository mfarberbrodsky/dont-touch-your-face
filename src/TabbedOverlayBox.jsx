import React, { useState } from "react";
import styles from "./TabbedOverlayBox.module.css";

export default function TabbedOverlayBox(props) {
    const [nthTab, setNthTab] = useState(0);
    return (
        <div className={styles.TabbedOverlay}>
            <div className={styles.tabs}>
                {props.tabNames.map((name, i) => (
                    <button key={i} className={nthTab === i ? styles.focused : null} onClick={() => setNthTab(i)}>
                        {name}
                    </button>
                ))}
            </div>
            {props.children[nthTab]}
        </div>
    );
}
