import { Link, useNavigate } from "react-router-dom"

import { HeartFill } from 'react-bootstrap-icons';
import { Form, Button, ProgressBar, Table } from "react-bootstrap";
import { useEffect } from "react";

import { useTransition, useSpring, animated } from "react-spring";

import WaitResultModal from "../../../components/waitResultPopup";

export default function Pete3({ resultReady, setSubmittedPete, GAME_ROUND, setRound, setStep, setResultReady, normanHealth, petePower, ericaHealth, round, peteHealth, whichRoutePete, electricity, normanStay, waterDepthEndupPete }) {
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

    const navigate = useNavigate();

    const handleNextRound = () => {
        console.log('Next Round Clicked! :', round)
    }

    useEffect(() => {
        if (resultReady) {
            const interval = setTimeout(() => {
             
                console.log('round from Pete3 before: ', round)
    
                if (round === GAME_ROUND ) {
                    navigate('/instructionformpostgame')
                }
                setRound(prevround => prevround + 1)
                setStep(prev => prev + 1);
                setResultReady(false);
                setSubmittedPete(false);
                console.log('round from Pete3 after: ', round)
            }, 5000);
            return () => clearTimeout(interval)
        }

    }, [resultReady])

    return (
        <>
            <div className="gameUpperForm">
                {transition((style, item) =>
                    <animated.h2 style={style}>Round {round} Result</animated.h2>
                )}
            </div>
                {!resultReady && <WaitResultModal />}
        <div className="resultWrapper">
            <div className="resultContainer">
                {transition2((style, item) =>
                    <animated.div style={style} className="resultLeft">
                        <div style={{ marginBottom: "1rem" }} className="personContainer">
                            <img src="/pete.png" alt="role_person_image" />
                        </div>
                        <h4>Your Decision: {petePower === "poweron" ? <span>You maintained the power in the city</span> : <span>You turned off the power and went to {whichRoutePete}</span>}</h4>
                        <p>Water depth reached <span>{waterDepthEndupPete} cm</span></p>
                        {/* <p>There is no damage to the substation</p> */}
                        <p>Your performance is <span>{peteHealth}</span> </p>
                        <div className="gameProgressBlock">
                            <ProgressBar now={peteHealth} style={{ fontSize: "1.1rem", height: "27px", backgroundColor: 'black' }} variant="primary" label={peteHealth} />
                            <div className="heartNorman"><HeartFill size={23} color="red" /></div>
                        </div>
                    </animated.div>
                )}
                {transition2((style, item) =>
                    <animated.div style={style} className="resultRight">
                        <h3>Players Summary</h3>
                        <Table striped bordered hover size="lg" responsive>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Decision</th>
                    
                                    <th>Current Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Erica</td>
                                    <td>{ericaHealth > 85 ? <span>Under Control</span> : <span>Risky</span>}</td>
                         
                                    <td>{ericaHealth}</td>
                                </tr>
                                <tr>
                                    <td>Pete</td>
                                    <td>{petePower === 'poweron' ? <span>Keep Power</span> : <span>Power Off</span>}</td>
                                
                                    <td>{peteHealth}</td>
                                </tr>
                                <tr>
                                    <td>Norman A</td>
                                    <td>{normanStay === 'stayon' ? <span>Stayed</span> : <span>Went Out Road</span>}</td>
                           
                                    <td>{normanHealth}</td>
                                </tr>
                                <tr>
                                    <td>Norman B</td>
                                    <td>{normanStay === 'stayon' ? <span>Stayed</span> : <span>Went Out Road</span>}</td>
                      
                                    <td>{normanHealth}</td>
                                </tr>
                                <tr>
                                    <td>Norman C</td>
                                    <td>{normanStay === 'stayon' ? <span>Stayed</span> : <span>Went Out Road</span>}</td>
                       
                                    <td>{normanHealth}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </animated.div>
                )}
            </div>
        </div>
        </>
    )
}
