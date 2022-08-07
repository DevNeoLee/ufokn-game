import { Link } from "react-router-dom"

import { HeartFill } from 'react-bootstrap-icons';
import { Form, Button, ProgressBar } from "react-bootstrap";

import { useTransition, useSpring, animated } from "react-spring";


export default function Erica4({ round }) {
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

        <div className="gamecontainer">
            <div className="gameUpperForm">
                {transition((style, item) =>
                    <animated.h2 style={style}>Round{round} Result</animated.h2>
                )}
            </div>
            <div className="resultContainer">
                {transition2((style, item) =>
                    <animated.div style={style} className="resultLeft">
                        <div style={style} className="personContainer">
                            <img src="/erica.png" alt="role_person_image" />
                            <ProgressBar now={100} animated variant="primary" />
                            <div className="heartRole"><HeartFill size={24} color="red" /></div>
                        </div>
                        <p>You are randomly assigned as Erica. the city’s manager
                            for emergency response.</p>
                        <p>
                            Your task is to</p>
                        <p> 1) engage in risk communication and</p>
                        <p>2) provide guidance on the recommended actions</p>
                    </animated.div>
                )}
                {transition2((style, item) =>
                    <animated.div style={style} className="resultRight">
                        <div style={style} className="personContainer">
                            <img src="/erica.png" alt="role_person_image" />
                            <ProgressBar now={100} animated variant="primary" />
                            <div className="heartRole"><HeartFill size={24} color="red" /></div>
                        </div>
                        <p>You are randomly assigned as Erica. the city’s manager
                            for emergency response.</p>
                        <p>
                            Your task is to</p>
                        <p> 1) engage in risk communication and</p>
                        <p>2) provide guidance on the recommended actions</p>
                    </animated.div>
                )}
            </div>
        </div>
    )
}
