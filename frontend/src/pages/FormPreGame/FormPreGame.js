

import { Form, Button, ProgressBar } from "react-bootstrap"
import Input from "../../components/Input"
import Radio from "../../components/Radio"
import Select from "../../components/Select"
import Checkbox from "../../components/Checkbox"

import { useTransition, useSpring, animated } from "react-spring";

import { useState, useEffect } from 'react'

import { useNavigate } from "react-router-dom";
import "../../App.css"
import data from "./DataPreGame"

import { Link } from "react-router-dom"

import HOST from "../../utils/routes";
import axios from 'axios';


export default function FormPreGame() {
  
  const [questions, setQuestions] = useState(
    data
    )
    
  const checkboxes = data.questions.filter(ele =>
    ele.multiple === 'true'
  )

  const questionQuantity = data.questions.length;

  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState({})
  // const [question, setQuestion] = useState('')

  const [pageQuantity, setPageQuantity] = useState(questionQuantity)

  const [step, setStep] = useState(0) 

  const [checkedState, setCheckedState] = useState(
    new Array(checkboxes[0].choices.length).fill(false)
  )
  
  const navigate = useNavigate();

  const sessionData = sessionStorage.getItem('ufoknSession');
  const sessionDataObject = JSON.parse(sessionData);

  const handleChange = (e) => {
    setAnswer(e.target.value)
    console.log('e.target.name: ', e.target.name)
    setAnswers({...answers, [e.target.name]: e.target.value})
    console.log('answers: ', answers)
  }

  const handleChangeCheckbox = (idx, index) => {
    console.log('index: ', index)
    let mapped = (checkedState.map((ele, ind) =>
    {
      if (index == ind) {
        // console.log("같네: ", ind)
        return !ele
      }
      // console.log('다르네: ', ind)
      return ele;
    }
    ))

    console.log('mapped state: ', mapped)
    setCheckedState(mapped)
    setAnswers({...answers, [idx + 1]: mapped})

    console.log('answers: ', answers)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('hello world!');

    //update sessionStorage
    if (sessionDataObject) {
      sessionDataObject.preGameSurvey = answers;
      await sessionStorage.setItem('ufoknSession', JSON.stringify(sessionDataObject));
      console.log('sessionStorage: ', sessionStorage.getItem('ufoknSession'))

      //update sessionData in MongoDB
      await updateSessionToMongoDB()
    }
  }

  const updateSessionToMongoDB = async () => {
    console.log('session data: ', sessionDataObject);
  
    const dataUpdate = async () => { 
      await axios.put(HOST + '/api/session', sessionDataObject)
      .then(data => {
        console.log('data from mongo saved: ', data)
        // return data
      })
      .catch(err => console.log(err))
    }

    await dataUpdate();
    navigate('/welcome');
  }


  useEffect(()=>{
    console.log('answer: ', answer)}, 
  [answer])

  useEffect(() => {
    console.log('answers: ', answers)
  },
    [answers])


  const transition = useTransition(true, {
    from: { x: 300, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
  });

  const transition2 = useTransition(true, {
    from: { x: 400, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    config: {
      duration: 500 // duration for the whole animation form start to end
    }
  });

  const handleClick = () => {
    console.log("!final click!: ");
  };

  const Buttons = () => (
    <section className="buttonsPreGame">
      {step > 0 && (
        <Button
          type="button"
          onClick={() => {
            setStep(step - 1);
          }}
        >
          BACK
        </Button>
      )}
      {step === pageQuantity - 1 && (
        <Button onClick={handleSubmit} disabled={answers[step + 1] ? false : true}>
          SUBMIT
        </Button>
      )}

      {step < pageQuantity - 1 && (
        <Button
          type="button"
          onClick={() => {
            setStep(step + 1);
          }}
          disabled={answers[step + 1] ? false : true}
        >
          NEXT
        </Button>
      )}
    </section>
  );

  return (
    <>
      <div className="container">
        <div className="formGeneral">
          <Form > 
            <fieldset>
              <Form.Group>

                {data && data.questions.map((question, idx) => 
                <>
                      {/* <h2 style={{ padding: "2rem"}}>{data.title}</h2> */}
                    <div key={question.id} className="welcomeParagraph">
                      <ProgressBar now={100 * (step + 1) / questionQuantity} label={`${(step + 1)} of ${questionQuantity}` } style={{ transition: "width 1s ease"}}/>
                      <h4>Question {step + 1} </h4>
                      {question.choices.length < 5 && !question.multiple
                        ?
                        <>
                        {transition2((style, item) =>
                          <animated.div style={style} key={question.id} className="inputFrame">
                            <Form.Label htmlFor={`radio`}>{question.question}</Form.Label>
                            {question.choices.map((choice, i) => (
                              <Radio label={choice} key={i + choice} checked={answers[idx + 1] == i + 1} value={i + 1} answer={answer} name={idx + 1} handleChange={handleChange} required={"required"} />
                            ))}
                            {question.detail === 'yes' && answers[idx + 1] == question.choices.length 
                              ? 
                              <>
                                <Input placeholder={question.detailText} onChange={handleChange} name={idx + 1 + 'b'} value={answers[idx + 1 + 'b']}/>
                              </> 
                              : 
                              null
                            }
                          </animated.div>
                        )}
                          <Buttons/>
                        </>
                        :
                        question.multiple ?
                        <>
                            {transition2((style, item) =>
                            <animated.div style={style} key={question.id} className="inputFrame">
                              <Form.Label htmlFor={`checkbox`}>{question.question}</Form.Label>
                              {question.choices.map((choice, i) => (
                                <Checkbox label={choice} key={i + choice} checked={checkedState[i]} name={idx + 1} handleChangeCheckbox={() => handleChangeCheckbox(idx, i)} required={"required"} />
                              ))}
                                {question.detail === 'yes' && String(answers[idx + 1]?.[answers[idx + 1].length - 1]) == 'true'
                                  ?
                                  <>
                                    <Input placeholder={question.detailText} onChange={handleChange} name={idx + 1 + 'b'} value={answers[idx + 1 + 'b']} />
                                  </>
                                  :
                                  null
                                }
                            </animated.div>
                            )}
                            <Buttons />
                        </>
                        :
                        <>
                          <Select question={question.question} answer={answer} name={idx + 1} value={answers[idx + 1]} onChange={handleChange} choices={question.choices} />
                          <Buttons />
                        </>
                      }
                    </div>
                
                    </>
                  )[step]
                  }

              </Form.Group>
            </fieldset>
            {/* <Link to="/grandgame"><Button className="" size="lg">Next</Button></Link> */}
          </Form>
        </div>
      </div>
    </>
  )
}
