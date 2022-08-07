import { Link } from "react-router-dom"

import { Button } from "react-bootstrap";

import { useTransition, useSpring, animated } from "react-spring";

export default function PetePopup({ setPopup }) {
    const transition = useTransition(true, {
        from: { x: 500, y: 0, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
    });

    const transition2 = useTransition(true, {
        from: { x: 600, y: 0, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
        config: {
            duration: 500 // duration for the whole animation form start to end
        }
    });

    return (

        <div className="">
            {transition2((style, item) =>
                <animated.div style={style} className="roleframe">
                    <div style={style} className="personContainer">
                        <img src="/pete.png" alt="role_person_image" />
                    </div>
                    <p>
                        Please hover your mouse over items on the map to analyze the status of your house and the city</p>
                    <p> 1) Decide How much is the Risk for Electricity Plant in the city with the Water flood risk.</p>
                    <p>2) City Emergency Manager, Erica will send you an update message, please check her message carefully then decide on what to do on the form and submit</p>
                    <div className="buttons" style={{ margin: "15px 80px" }}><Button size="lg" onClick={() => setPopup(false)}>Start</Button></div>
                </animated.div>
            )}
        </div>
    )
}
