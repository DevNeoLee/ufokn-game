

import { Spinner } from "react-bootstrap";

import { useTransition,  animated } from "react-spring";


export default function WaitResultModal() {

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
        <div className="waitResult">
            {transition2((style, item) =>
                <animated.div style={style} className="roleframe">
                    <p>
                        Please wait until all the other players finish their round</p>

                    <div className="spinner">
                        <div className="spinnerPerson">
                            <img src="/erica.png" width="100px" />
                        </div>
                        <Spinner animation="grow" variant="info" size="sm" />
                        <div className="spinnerPerson">
                            <img src="/pete.png" width="100px" />
                        </div>
                        <Spinner animation="grow" variant="info" size="sm" />
                        <div className="spinnerPerson">
                            <img src="/norman.png" width="100px" />
                        </div>
                    </div>
                </animated.div>
            )}
        </div>
    )
}

