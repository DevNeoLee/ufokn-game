import { Link } from "react-router-dom"

import { useState } from 'react'

import { Button, Form } from "react-bootstrap";

import { useTransition, animated } from "react-spring";


export default function DecisionControl({ handleDecisionBox }) {

    const [stay, setStay] = useState(false);

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

    const handleStay = () => {

    }

    return (
        <div className="">
            {transition2((style, item) =>
                <Form onSubmit={handleDecisionBox} style={{ position: "absolute", top: "50px", left: "200px", zIndex: "5000"}} >
                        <div className="buttons" ><Button type="submit" style={{ width: "15rem", height: "3rem"}}>Decide Now</Button></div>
                    </Form>
                // <animated.div style={style} className="roleframe">
                // </animated.div>
            )}
        </div>
    )
}

