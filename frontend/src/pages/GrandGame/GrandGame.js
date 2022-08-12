import Erica0 from './GameErica/Erica0'
import Erica1 from './GameErica/Erica1'
import Erica2 from './GameErica/Erica2'
import Erica3 from './GameErica/Erica3'

import Norman0 from './GameNorman/Norman0'
import Norman1 from './GameNorman/Norman1'
import Norman2 from './GameNorman/Norman2'
import Norman3 from './GameNorman/Norman3'

import Pete0 from './GamePete/Pete0'
import Pete1 from './GamePete/Pete1'
import Pete2 from './GamePete/Pete2'
import Pete3 from './GamePete/Pete3'

import Instruction from './Instruction'

import { Button } from "react-bootstrap";

import { Link } from "react-router-dom"

import { useEffect, useState } from 'react'

import io from 'socket.io-client'

import { original_data } from './dataGame'

import HOST from '../../utils/routes'

import axios from 'axios';

import { useRecoilState } from 'recoil';
import { sessionState, gameState } from '../../recoil/globalState';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

import { bindProxyAndYMap } from "valtio-yjs";
import { proxy, useSnapshot } from "valtio";

import valtioState  from '../../valtio/valtioState';

export default function GrandGame() {

    const snap = useSnapshot(valtioState);
    let wsProvider;

    const doc = new Y.Doc();

    const yarray = doc.get('array', Y.Array);

    const ymap = doc.get('map', Y.Map);
  
    useEffect(()=> {
        if (process.env.NODE_ENV === 'production') {
            wsProvider = new WebsocketProvider('wss://ufokn-game.herokuapp.com:1234', 'thisRoom', doc)
        } else {
            wsProvider = new WebsocketProvider('ws://localhost:1234', 'thisRoom', doc)
        }

        wsProvider.on('status', e => {
            // console.log("status: ", doc);
        })

        wsProvider.on('synced', synced => {
            // console.log('Sync: ', synced);
        })

        yarray.observeDeep(() => {
            // console.log('Observed array: ', yarray.toJSON());
        })

        ymap.observeDeep(() => {
            // console.log('Observed map: ', ymap.toJSON());
        })

        window.example = { wsProvider, doc, yarray }

    }, [])
    
    const data = JSON.parse(JSON.stringify(original_data))
    
    const GAME_ROUND = 4;

    const [role, setRole] = useState('')

    const [gameStart, setGameStart] = useState(false);
    const [pageQuantity, setPageQuantity] = useState(4)
    const [step, setStep] = useState(0)
    const [id, setId] = useState({})
    
    const [userTaskDoneCounter, setUserTaskDoneCounter] = useState(0);
    const [socket, setSocket] = useState(null)

    const [round, setRound] = useState(1)

    const [user, setUser] = useState({
        role: '',
        id: '',
        scores: [],
        round_completed: 0,
        final_score: 100,
    })

    const [clients, setClients ] = useState(0);

    const [roomOneSize, setRoomOneSize] = useState(0);

    const [messagesStorageErica, setMessagesStorageErica] = useState({
        round1: {
            toNorman: [],
            toPete: [],
            levelOfWarning: []
        },
        round2: {
            toNorman: [],
            toPete: [],
            levelOfWarning: []
        },
        round3: {
            toNorman: [],
            toPete: [],
            levelOfWarning: []
        },
        round4: {
            toNorman: [],
            toPete: [],
            levelOfWarning: []
        },
    })
    
    const [roundFinished, setRoundFinished] = useState(false)
    const [resultReady, setResultReady] = useState(false)//////////true <-> false 로 step값과 함께 페이지 이동 결정함

    const [peteDecisions, setPeteDecisions] = useState({ 1: {}, 2: {}, 3: {}, 4: {} });

    const [normanDecisions, setNormanDecisions] = useState({1: [], 2: [], 3: [], 4: []})

    const [normanDecisionsComplete, setNormanDecisionsComplete] = useState(false);

    const [ericaDecisions, setEricaDecisions] = useState({ 1: { toNorman: "", toPete: "", levelOfWarning: "" }, 2: {}, 3: {}, 4: {}})

    const [levelOfWarning, setLevelOfWarning] = useState('')
    const [messageToNorman, setMessageToNorman] = useState('')
    const [messageToPete, setMessageToPete] = useState('')
    const [messageFromErica, setMessageFromErica] = useState('')
    
    const [petePower, setPetePower] = useState("poweron")
    const [normanStay, setNormanStay] = useState("stayon")

    const [whichRoute, setWhichRoute] = useState("")
    const [whichRoutePete, setWhichRoutePete] = useState("")

    const [popForm, setPopForm] = useState(false);
    const [waitPopupErica, setWaitPopupErica] = useState(false)

    const [normanQuestion, setNormanQuestion] = useState(false)

    const [normanHealth, setNormanHealth] = useState(100)
    const [ericaHealth, setEricaHealth] = useState(100)
    const [peteHealth, setPeteHealth] = useState(100)

    //if decidedArea's water depth above 30cm
    const [critical, setCritical] = useState(false)

    const [gameResult, setGameResult] = useState([])

    
    const [electricity, setElectricity] = useState('poweron')

    const [ players, setPlayers ] = useState([])

    const normanRoles = ['NormanA', 'NormanB', 'NormanC', 'NormanD', 'NormanE', 'NormanF'];

    const [waterDepthEndupNorman, setWaterDepthEndupNorman] = useState(0)
    const [waterDepthEndupPete, setWaterDepthEndupPete] = useState(0)

    const [chatData, setChatData] = useState({ 1: [], 2: [], 3: [], 4: [] });

    const [userQuantity, setUserQuantity] = useState(0)
  
    const [browserTapCount, setBrowserTapCount] = useState(0);

    const [canStartGame, setCanStartGame ] = useState(false);

    const MAX_CLIENTS = 8;
    const MIN_CLIENTS = 3;

    const sessionData = sessionStorage.getItem('ufoknSession');
    const sessionDataObject = JSON.parse(sessionData);

    ///////////////////////////main data///////////////////////////////////////////////////////////////////////// 
    const [session, setSession] = useState({});

    const [globalSession, setGlobalSession] = useRecoilState(sessionState);
    const [globalGame, setGlobalGame] = useRecoilState(gameState);

    const roles = ['Erica', 'Pete', 'NormanA', 'NormanB', 'NormanC', 'NormanD', 'NormanE', 'NormanF'];

    const [game, setGame] = useState({
        room_name: "",
        players: [],
        chatting: { 1: [], 2: [], 3: [], 4: [] },
        norman_decisions: { 1: {}, 2:{}, 3: {}, 4: {} }
    });

    const [isGame, setIsGame] = useState(false);

    const [games, setGames] = useState(() => [
        { room_name: "1", players: [], chatting: {}, norman_decisions: { 1: {}, 2: {}, 3: {}, 4: {} } }, 
        { room_name: "2", players: [], chatting: {}, norman_decisions: { 1: {}, 2: {}, 3: {}, 4: {} } },
        { room_name: "3", players: [], chatting: {}, norman_decisions: { 1: {}, 2: {}, 3: {}, 4: {} } }
    ])

    useEffect(() => {
        const socket = io()
        setSocket(socket)
        console.log("================= socket open ===========")
        return () => {
            setSocket(null);
            console.log("================= socket close ===========")
        }

    }, [])

    useEffect(() => {
        const getInitialSession = async () => {

        let s = await sessionStorage.getItem('ufoknSession')
        console.log("ufoknSession: ", s)
        if (!s ) {
            console.log('No ufoknSession yet')
            s = await createSession()

            setSession(s)
            setGlobalSession(s)

        } else {
            setSession(JSON.parse(s))
            setGlobalSession(JSON.parse(s))
        }
    }
        getInitialSession()

        // let tm;
        // function ping() {
        //     wsProvider.send('__ping__');
        //     tm = setTimeout(function () {

        //         /// ---connection closed ///


        //     }, 5000);
        // }

        // function pong() {
        //     clearTimeout(tm);
        // }
        // wsProvider.onopen = function () {
        //     setInterval(ping, 30000);
        // }
        // wsProvider.onmessage = function (evt) {
        //     var msg = evt.data;
        //     if (msg == '__pong__') {
        //         pong();
        //         return;
        //     }
        //     //////-- other operation --//
        // }
    }, [])

    useEffect(() => {
        sessionStorage.setItem('ufoknSession', JSON.stringify(globalSession))
        console.log('Global Session from userEffect[glbalSession]; ', globalSession)
   
    }, [globalSession])

    useEffect(()=> {
        sessionStorage.setItem('ufoknGame', JSON.stringify(globalGame))
        console.log('Global Game from userEffect[glbalGame]; ', globalGame)

    }, [globalGame])

    // useEffect(() => {
    //     const updateGames = async () => {
    //         console.log('game updated!')
    //         await sessionStorage.setItem('ufoknGame', JSON.stringify(game))
    //         console.log('Your Game data in userEffect[game];', game)
    
    //         let newGames = games.map(g => {
    //             if (g.room_name === game.room_name) {
    //                 return game
    //             } else {
    //                 return g
    //             }
    //         })
    //         setGames(newGames)
    //         console.log('Your Global Session on useEffect[game]', globalSession)
    //         console.log('Your Global Game on useEffect[game]', globalGame)
    //     }
    //     updateGames();
    // }, [game])


    useEffect(() => {
        // console.log("ericaMessage to norman:", messageToNorman)

    }, [messageToNorman])

    useEffect(() => {
        // console.log("ericaMessage to pete:", messageToPete)

    }, [messageToPete])

    
    useEffect(() => {
        const average = (peteHealth + normanHealth * 3) / 4;
        setEricaHealth(average.toFixed())
        // console.log('erica health updated; ', ericaHealth )
    }, [peteHealth, normanHealth], () => { console.log('erica health updated; ', ericaHealth) })

    useEffect(() => {
        // console.log("City Power now on: ", electricity )
    }, [electricity])
   
    useEffect(()=>{
        if (socket) {
            socket.on("client_count", (arg1, arg2) => {
                // console.log('Client Count:', arg2)
                setClients(arg2);
            })

            socket.on("join_room", (room_name, player_name, game, room_size) => {
                console.log(`New player joined a room #${room_name}: `, game, player_name)
                //위의 스텝은 아마 거의 필요없어 집니다, 글로벌 사용하니까요.
                setGlobalGame(game);
                sessionStorage.setItem('ufoknGame', game);
                setGame(game)
                setGames([...games, game])
                console.log('game: ', game)
                console.log('room_size: ', room_size)
                checkGameStart(room_size)
    
                setRoomOneSize(room_size)
            })
    
            //매번 글로벌게임 압데이트를 모든 참여 유저데이타에 해줌
            socket.on("game_update", (data) => {
                console.log('game_update socket: ', data)
                setGame(data)
                setGlobalGame(data);
            })
    
            socket.on("game_start", () => {
                const gameOn = async () => {

                    setGameStart(true)
                }
                gameOn();
            })
    
            socket.onAny((event, ...args) => {
                // console.log('socket event: ', event, args)
            })
    
            socket.on("leaving", () => {
                // console.log("someone leaving the room")
            })
    
            socket.on("left", () => {
                // console.log("someone left the room")
            })
    
            socket.on("erica_message", (msg) => {
                // console.log('Erica message from Erica received: ', msg)
                setMessageFromErica(msg)
                setGlobalGame(prev => ({ ...prev, erica_messages: { ...prev.erica_messages, [round]: msg } }))
                setUserTaskDoneCounter(prev => prev + 1)
                setTimeout(() => {
                    setPopForm(true)
                    setWaitPopupErica(true)
                }, 3000);
    
            })
    
            // normanDecisions = { 1: [], 2: [], 3: [], 4: [] }
            socket.on("norman_message", (data => {
                // console.log('Norman data from Norman received: ', data)
    
                // setGlobalGame(prev => ({ ...prev, pete_decisions: { ...prev.pete_decisions, [round]: data } }))
                // setGlobalGame(prev => ({ ...prev, erica_messages: { ...prev.erica_messages, [round]: msg } }))
    
                setGlobalGame(prev => ({ ...prev, norman_decisions: { ...prev.norman_decisions, [round]: data } }))
    
    
                setUserTaskDoneCounter(prev => prev + 1)
            }))
    
            socket.on("pete_message", (data => {
                // console.log('Pete data from Pete received: ', data)
    
                if (data.stay === 'poweroff') {
                    setElectricity('poweroff')
                } else if (data.stay === 'poweron') {
                    setElectricity('poweron')
                }
                setGlobalGame(prev => ({ ...prev, pete_decisions: { ...prev.pete_decisions, [round]: data } }))
    
                setUserTaskDoneCounter(prev => prev + 1)
            }))
    
    
            socket.on("norman_chat", (data) => {
                // console.log('Norman is chatting on frontend received: ', data.message);
                // console.log('chat data received: ', data)
    
                setChatData(prev => ({ ...prev, [round]: [...prev[round], data] }));
    
                setGlobalGame(prev => ({ ...prev, chatting: { ...prev.chatting, [round]: data } }))
                // console.log("chatData Updated: ", data)
            })
    
            socket.on("role", ({ role, id }) => {
                const sessionS = JSON.parse(sessionStorage.getItem('ufoknSession'));
                // console.log('sessionS._id: ', sessionS._id)
                // console.log('id: ', id)

                 if (sessionS._id === id && role ){
                    setSession(session => { return { ...session, role: role } })
                    setGlobalSession(session => { return { ...session, role: role } })
                    setRole(role)
                }
            })
        
        }

    }, [socket])

    useEffect( async () => {
        // console.log('Role has been assigned to: ', role)
        if (socket) {
            await socket.emit('game_start', "1")
        }
    }, [role])

/////////////////////////////////////////////////////////                   Round Complete Decision Logic                                 ///////////////////////////////////////////////////////////////////////////////////
    // peteDecisions =[stay: null, whichRoute: null }] 
    // normanDecisions = { 1: [], 2: [], 3: [], 4: [] }

    useEffect( () => {
        const roundDone = async () => {
            console.log('userTaskCounter: ', userTaskDoneCounter);

            if ((userTaskDoneCounter !== 0 && roomOneSize === userTaskDoneCounter + 1 && round === 1) || 
                (userTaskDoneCounter !== 0 && roomOneSize === userTaskDoneCounter + 1)) {
                setPopForm(false)
    
                //// calculate socres here///////
                // calculateScore(normanDecisions, peteDecisions)
    
                //// Mongo Game Update /////
                await updateToMongoDBGame(globalGame)
    
                // render result page /////
                setResultReady(true)
    
                // sessionStorage에다가 저장해 주어 이걸 다음 다른 페이지들에게 정확히 패스해 줄수 있다. 
                sessionStorage.setItem('ufoknGame', globalGame)
                

                console.log('sessonStorage, game: ', sessionStorage.getItem('ufoknGame'))

                ///그리고 모든 이전 스테이트 최기화!
                setPeteDecisions([])
                setWhichRoutePete('')
                setPetePower('')
                setWhichRoute('')
                setNormanStay('')
                setMessageFromErica('')
                setMessageToNorman('')
                setMessageToPete('')
 
    
    
                setUserTaskDoneCounter(0)
                setWaitPopupErica(false)


    
                console.log('!!!!!!!calcuation done')
            } else {
                console.log("result page is not ready yet: " + 'NormanDecisions: ' + JSON.stringify(normanDecisions) + 'PeteDecisions: ' + JSON.stringify(peteDecisions))
            } 
        }

        roundDone();

    }, [normanDecisions, ericaDecisions, peteDecisions, globalGame, globalSession, setGlobalSession, setGlobalGame])

    useEffect(() => {
        // console.log("chatData: ", chatData)
    }, [chatData])

    ///////////////////////////////////create a session//////
    const createSession = async () => {
        return await fetch(HOST + '/api/session', { "method": "POST" })
            .then(res => res.json())
            .then(data => {

                sessionStorage.setItem('ufoknSession', JSON.stringify(data));
                console.log('New Session created in mongoDB, saved in SessionStorage on GrandGame page:', data)
                return data
            })
            .catch(err => console.log(err))
    }

    //when user joins, check see if game can start
    const checkGameStart = (room_size) => {
        if (room_size >= MIN_CLIENTS) {
            setCanStartGame(true);
        }
    }

    const updateToMongoDBSession = async (payload) => {
        console.log('session data: ', sessionDataObject);

        const dataUpdate = async () => {
            await axios.put(HOST + '/api/session', payload)
                .then(data => {
                    console.log('Session to MongoDB updated: ', data)
                    // return data
                })
                .catch(err => console.log(err))
        }

        await dataUpdate();
    }

    const updateToMongoDBGame = async (payload) => {
        console.log('global game object: ', globalGame);

        const dataUpdate = async () => {
            await axios.put(HOST + '/api/grandgame', payload)
                .then(data => {
                    console.log('Game to MongoDB updated: ', data)
                    // return data
                })
                .catch(err => console.log(err))
        }

        await dataUpdate();
    }

    const calculateScore = (normanDecisions, peteDecisions) => {

        //지금 라운드의 자료
        const stayedHome = normanDecisions[round - 1].stay === 'stayon' 
        const stayedHomePete = peteDecisions[round - 1].stay === 'poweron'

        // console.log('stayed home ? : ', stayedHome)
        // console.log('stayed home pete? : ', stayedHomePete)


        // console.log('노만의 결정은 ? : ', normanDecisions[round - 1].stay)
        // console.log('pete의 결정은 ? : ', peteDecisions[round - 1].stay)

        let travelRisk;
        let travelRiskPete;
        let powerOutrageRisk;
    
        let criticalRisk;
        let criticalRiskPete;
        let decidedAreaNorman;
        let decidedAreaPete;


        if (stayedHome) {
            console.log('======== stayed home norman =========')
            travelRisk = 0;

            decidedAreaNorman = normanDecisions[round - 1].role

            // console.log('normanDecisions[round - 1]: ', normanDecisions[round - 1])
            // console.log('normanDecisions[round - 1].role: ', normanDecisions[round - 1].role)

            // console.log("decidedAreaNorman: ", decidedAreaNorman)

            if (electricity === 'poweron') {
                powerOutrageRisk = 0;
            } else if (electricity === 'poweroff') {
                powerOutrageRisk = 5;
            }

            //find the water depth you end up, data array 에서 찾아야함
            //다음 라운드의 current wtaer depth 값임
            data[`round${round + 1}`].map(ele => {
                if (ele.name.toLowerCase() === decidedAreaNorman.toLowerCase()) {
                    setWaterDepthEndupNorman(ele['Current Water Depth'])
                }
            })

            //when the result of the waterDepth in the house above 30cm
            if ( waterDepthEndupNorman > 30 ) {
                    criticalRisk = 80;
            } else {
                criticalRisk = 0;
            }
            

            // console.log('travelRisk: ', travelRisk)
            // console.log('powerOutrageRisk: ', powerOutrageRisk)
            // console.log('criticalRisk: ', criticalRisk)
            // console.log('decidedAreaNorman: ', decidedAreaNorman)
            // console.log('waterDepthEndupNorman: ', waterDepthEndupNorman)


        ///now in case of 'left home'
        } else {
            decidedAreaNorman = normanDecisions[round - 1].whichRoute;

            travelRisk = 5;

            powerOutrageRisk = 0;

            data[`round${round + 1}`].map(ele => {
                if (ele.name.toLowerCase() === decidedAreaNorman) {
                    setWaterDepthEndupNorman(ele['Current Water Depth'])
                }
            })
            
            //when the result of the waterDepth in the house above 30cm
            if (waterDepthEndupNorman > 30) {
                criticalRisk = 80;
            } else {
                criticalRisk = 0;
            }


            // console.log('======== went out norman =========')

            // console.log('travelRisk: ', travelRisk)
            // console.log('powerOutrageRisk: ', powerOutrageRisk)
            // console.log('criticalRisk: ', criticalRisk)
            // console.log('decidedAreaNorman: ', decidedAreaNorman)
            // console.log('waterDepthEndupNorman: ', waterDepthEndupNorman)
        }

        setNormanHealth(prev => 
            prev - travelRisk - powerOutrageRisk - criticalRisk
        )

        //peteScore update
        if (stayedHomePete) {
            console.log('======== stayed home pete =========')
            travelRiskPete = 0;

            decidedAreaPete = peteDecisions[round - 1].role

            // console.log('peteDecisions[round - 1]: ', peteDecisions[round - 1])
            // console.log('peteDecisions[round - 1].role: ', peteDecisions[round - 1].role)

            // console.log("decidedAreaPete: ", decidedAreaPete)

            if (electricity === 'poweron') {
                powerOutrageRisk = 0;
            } else if (electricity === 'poweroff') {
                powerOutrageRisk = 5;
            }

            //find the water depth you end up, data array 에서 찾아야함
            //다음 라운드의 current wtaer depth 값임
            data[`round${round + 1}`].map(ele => {

                // console.log("ele.name.toLowerCase(): ", ele.name.toLowerCase())
                // console.log(" decidedAreaPete.toLowerCase(): ", decidedAreaPete.toLowerCase())

                if (ele.name.toLowerCase() === decidedAreaPete.toLowerCase()) {
                    setWaterDepthEndupPete(ele['Current Water Depth'])
                }
            })

            //when the result of the waterDepth in the house above 30cm
            if (waterDepthEndupPete > 30) {
                criticalRiskPete = 80;
            } else {
                criticalRiskPete = 0;
            }


            // console.log('travelRisk: ', travelRiskPete)
            // console.log('powerOutrageRisk: ', powerOutrageRisk)
            // console.log('criticalRisk: ', criticalRiskPete)
            // console.log('decidedAreaPete: ', decidedAreaPete)
            // console.log('waterDepthEndupPete: ', waterDepthEndupPete)


            ///now in case of 'left home'
        } else {
            decidedAreaPete = peteDecisions[round - 1].whichRoute;

            travelRiskPete = 5;

            powerOutrageRisk = 0;

            // console.log("decidedAreaPete: ", decidedAreaPete)

            data[`round${round + 1}`].map(ele => {
                if (ele.name.toLowerCase() === decidedAreaPete.toLowerCase()) {
                    setWaterDepthEndupPete(ele['Current Water Depth'])
                }
            })

            //when the result of the waterDepth in the house above 30cm
            if (waterDepthEndupPete > 30) {
                criticalRiskPete = 80;
            } else {
                criticalRiskPete = 0;
            }


            // console.log('======== went out Pete =========')

            // console.log('travelRisk: ', travelRiskPete)
            // console.log('powerOutrageRisk: ', powerOutrageRisk)
            // console.log('criticalRisk: ', criticalRiskPete)
            // console.log('decidedAreaPete: ', decidedAreaPete)
            // console.log('waterDepthEndupPete: ', waterDepthEndupPete)
        }

        console.log("hmm: ", 100 - travelRiskPete - powerOutrageRisk - criticalRiskPete)

        setPeteHealth(prev =>
            (prev - travelRiskPete - powerOutrageRisk - criticalRiskPete)
        )
        //ericaScore update
    }




     // peteDecisions = {stay: null, whichRoute: null } 
    // normanDecisions = { 1: [], 2: [], 3: [], 4: [] }
    const handleSubmitPete = async (e) => {
        setPopForm(false)
        console.log('pete just submitted his decison form: ')
        e.preventDefault()

        const peteDecision = { stay: petePower, whichRoute: whichRoutePete, role: 'pete' }

        setPeteDecisions(peteDecision);
        setElectricity(petePower)

        setGlobalSession(prev => ({...prev, your_decisions: {...prev.your_decisions, [round]: peteDecision }}))
        setSession(prev => ({ ...prev, your_decisions: { ...prev.your_decisions, [round]: peteDecision } }))

        socket.emit('pete_message', peteDecision)

        // sessionStorage에다가 저장해 주어 이걸 다음 다른 페이지들에게 정확히 패스해 줄수 있다. 
        sessionStorage.setItem('ufoknSession', JSON.stringify({ ...globalSession, your_decisions: { ...globalSession.your_decisions, [round]: peteDecision } }))

        console.log('sessonStorage, Session: ', JSON.parse(sessionStorage.getItem('ufoknSession')))

        await updateToMongoDBSession({ ...globalSession, your_decisions: { ...globalSession.your_decisions, [round]: peteDecision } })
    }

    const handleChangePetePower = (e) => {
        setPetePower(e.target.value)
        console.log('pete power: ', e.target.value)

    }


    const handleChangeWhichRoutePete =(e) => {
        setWhichRoutePete(e.target.value)
        console.log('which route pete: ', e.target.value)

    }

    //Norman handles
    const handleSubmitNorman = async (e) => {
        setPopForm(false)
        // console.log('Norman just submitted his form:')
        e.preventDefault()

        const normanDecision = { stay: normanStay, whichRoute: whichRoute, role: role };

        console.log('normanDecision: ', normanDecision);

        setNormanDecisions(prev => ({...prev, [round]: [...prev[round], normanDecision ]}))
        
        // setNormanStay(true)
        // setWhichRoute('')

        setGlobalSession(prev => ({ ...prev, your_decisions: { ...prev.your_decisions, [round]: normanDecision } }))
        setSession(prev => ({ ...prev, your_decisions: { ...prev.your_decisions, [round]: normanDecision } }))

        
        // socket interaction
        socket.emit('norman_message', normanDecision)

        // sessionStorage에다가 저장해 주어 이걸 다음 다른 페이지들에게 정확히 패스해 줄수 있다. 
        sessionStorage.setItem('ufoknSession', JSON.stringify({ ...globalSession, your_decisions: { ...globalSession.your_decisions, [round]: normanDecision } }))

        console.log('sessonStorage, Session: ', JSON.parse(sessionStorage.getItem('ufoknSession')))

        //Update to MongoDB
        await updateToMongoDBSession({ ...globalSession, your_decisions: { ...globalSession.your_decisions, [round]: normanDecision } })
    }

    const handleChangeNormanStay = (e) => {
        setNormanStay(e.target.value)
        // console.log('norman select: ', normanStay)
    }

    const handleChangeWhichRoute =(e) => {
        setWhichRoute(e.target.value)
        // console.log('norman which route: ', e.target.value)
    }

    //ericaDecisions = { 1: {}, 2: {}, 3: {}, 4: {} }
    //
    //erica communicating through SOCKET  + to do: save to MongoDB
    const handleSubmitErica = async (e) => {
        e.preventDefault()
        // console.log('erica just submitted her messages:')

        const messages = {
            toNorman: messageToNorman, toPete: messageToPete, levelOfWarning: levelOfWarning, role: role
        }


        setEricaDecisions(prev => ({...prev, [round]: messages })) 

        setGlobalSession(prev => ({...prev, your_decisions: {...prev.your_decisions, [round]: messages}}))

        setSession(prev => ({ ...prev, your_decisions: { ...prev.your_decisions, [round]: messages } }))
        // socket interaction
        socket.emit('erica_message', messages)

        // sessionStorage에다가 저장해 주어 이걸 다음 다른 페이지들에게 정확히 패스해 줄수 있다. 
        sessionStorage.setItem('ufoknSession', JSON.stringify({ ...globalSession, your_decisions: { ...globalSession.your_decisions, [round]: messages } }))

        console.log('sessonStorage, Session: ', JSON.parse(sessionStorage.getItem('ufoknSession')))

        await updateToMongoDBSession({ ...globalSession, your_decisions: { ...globalSession.your_decisions, [round]: messages } })


        setLevelOfWarning('')
        setMessageToNorman('')
        setMessageToPete('')
    }

    const handleClick = () => {
        console.log("!final click!: ");
    };

    const handleChangeWarning = (e) => {
        setLevelOfWarning(e.target.value)
        // console.log("Level of wanrning: ", e.target.value)
    }

    const handleChangeMessageToNorman = (e) => {
        setMessageToNorman(e.target.value)
        // console.log("Message To Norman: ", e.target.value)
    }

    const handleChangeMessageToPete = (e) => {
        setMessageToPete(e.target.value)
        // console.log("Message To Pete: ", e.target.value)
    }

    const ericas = [
        <Erica0 step={step} role setRole />,
        <Erica1 step={step} round={round} />,
        <Erica2 userTaskDoneCounter={userTaskDoneCounter} globalGame={globalGame} setGlobalGame={setGlobalGame} globalSession={globalSession} setGlobalSession={setGlobalSession} data={data} setWaitPopupErica={setWaitPopupErica} waitPopupErica={waitPopupErica} handleSubmitErica={handleSubmitErica} round={round} handleChangeWarning={handleChangeWarning} handleChangeMessageToNorman={handleChangeMessageToNorman} handleChangeMessageToPete={handleChangeMessageToPete} levelOfWarning={levelOfWarning} messageToPete={messageToPete} messageToNorman={messageToNorman} ericaHealth={ericaHealth} players={players}/>,
        <Erica3 GAME_ROUND={GAME_ROUND} step={step} setRound={setRound} setStep={setStep} setResultReady={setResultReady} petePower={petePower} normanHealth={normanHealth} peteHealth={peteHealth} round={round} ericaHealth={ericaHealth} messagesStorageErica={messagesStorageErica} normanStay={normanStay} />,
    ];
    
    const normans = [
        <Norman0 step={step} />,
        <Norman1 step={step} round={round}/>,
        <Norman2 userTaskDoneCounter={userTaskDoneCounter} globalGame={globalGame} setGlobalGame={setGlobalGame} globalSession={globalSession} setGlobalSession={setGlobalSession} step={step} data={data} handleChangeWhichRoute={handleChangeWhichRoute} normanStay={normanStay} handleSubmitNorman={handleSubmitNorman} handleChangeNormanStay={handleChangeNormanStay} popForm={popForm} setPopForm={setPopForm} round={round} electricity={electricity} normanQuestion={normanQuestion} normanHealth={normanHealth} messageToNorman={messageToNorman} role={role} messageFromErica={messageFromErica} socket={socket} setChatData={setChatData} chatData={chatData}/>,
        <Norman3 GAME_ROUND={GAME_ROUND} step={step} setRound={setRound} setStep={setStep} setResultReady={setResultReady} round={round} peteHealth={peteHealth} ericaHealth={ericaHealth} whichRoute={whichRoute} normanStay={normanStay} electricity={electricity} normanHealth={normanHealth} waterDepthEndupNorman={waterDepthEndupNorman} petePower={petePower}/>,
    ];
    
    const petes = [
        <Pete0 step={step} />,
        <Pete1 step={step} round={round} />,
        <Pete2 userTaskDoneCounter={userTaskDoneCounter} step={step} globalGame={globalGame} setGlobalGame={setGlobalGame} globalSession={globalSession} setGlobalSession={setGlobalSession} data={data} handleChangePetePower={handleChangePetePower} handleSubmitPete={handleSubmitPete} popForm={popForm} setPopForm={setPopForm} round={round} electricity={electricity} normanQuestion={normanQuestion} peteHealth={peteHealth} petePower={petePower} whichRoutePete={whichRoutePete} normanStay={normanStay} handleChangeWhichRoutePete={handleChangeWhichRoutePete} messageToPete={messageToPete} messageFromErica={messageFromErica}/>,
        <Pete3 GAME_ROUND={GAME_ROUND} step={step} setRound={setRound} setStep={setStep} setResultReady={setResultReady} round={round} normanHealth={normanHealth} ericaHealth={ericaHealth} peteHealth={peteHealth} whichRoutePete={whichRoutePete} electricity={electricity} petePower={petePower} waterDepthEndupPete={waterDepthEndupPete}/>
    ];
    
    const Buttons = () => (
        <section className='buttons' >
            {/* {step > 0 && (
                <Button
                type="button"
                onClick={() => {
                    setStep(step - 1);
                    console.log(step)
                }}
                style={{ margin: "0.5rem"}}
                >
                BACK
                </Button>
            )} */}
            {step === pageQuantity && (
                <Link to="/instructionformpostgame">
                    <Button onClick={handleClick}
                        style={{ margin: "0.5rem" }}
                    >
                    SUBMIT
                    </Button>
                </Link>
            )}

            {step < pageQuantity && (
                <Button
                    type="button"
                    style={{ margin: "0.5rem" }}
                    onClick={() => {
                        setStep(step + 1);
                        console.log("Current Game Page: ", step + 1)
                    }}
                >
                    NEXT
                </Button>
            )}
        </section>
    );

    return (
        <div className="main">
            <div className="gameframe">
            { gameStart ?
                <>
                    { 
                        role === 'Erica' && resultReady
                            ? 
                            ericas[3] 
                            :
                        role === 'Erica'
                            ?
                            ericas[step] 
                            : 
                        role === 'Pete' && resultReady
                            ? 
                            petes[3] 
                            :
                        role === 'Pete'
                            ?
                            petes[step] 
                            : 
                        normanRoles.includes(role) && resultReady
                            ?
                            normans[3] 
                            :
                            normans[step]
                        }

                    { step !== 2 && <Buttons/> }
                </>
                    : 
                    <Instruction updateToMongoDBGame={updateToMongoDBGame} Buttons={Buttons} normanRoles={normanRoles} step={step} normans={normans} petes={petes} ericas={ericas} yarray={yarray} snap={snap} setGlobalSession={setGlobalSession} globalSession={globalSession} setGlobalGame={setGlobalGame} globalGame={globalGame} clients={clients} axios={axios} HOST={HOST} sessionDataObject={sessionDataObject} setGameStart={setGameStart} id={id} setId={setId} canStartGame={canStartGame} setCanStartGame={setCanStartGame} game={game} setGame={setGame} socket={socket} session={session} setRole={setRole} role={role} userQuantity={userQuantity} games={games} MAX_CLIENTS={MAX_CLIENTS} MIN_CLIENTS={MIN_CLIENTS} resultReady={resultReady}/>
                } 
            </div>
        </div>
    )
}
