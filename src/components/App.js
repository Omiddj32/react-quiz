import { useEffect, useReducer } from "react";
/*
https://codesandbox.io/p/sandbox/react-challenge-usereducer-bank-starter-forked-x6vxsp?file=%2Fsrc%2FApp.js%3A42%2C1
*/

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Options from "./Options";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import QuizType from "./QuizType";
import { useLocalStorageState } from "./useLocalStorageState";

// console.log(questions.questions);

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  // questions: questions.questions,

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemainig: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemainig: state.questions.length * SECS_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    /*
      return {
        ...state,
        status: "ready",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
        index: 0,
        answer: null,
        points: 0,
      };
    */

    case "tick":
      return {
        ...state,
        secondsRemainig: state.secondsRemainig - 1,
        status: state.secondsRemainig === 0 ? "finished" : state.status,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case "difficulty":
      return {
        ...state,
        questions: state.questions.filter((question) => {
          if (action.payload === "Easy") return question.points <= 10;
          if (action.payload === "Normal") return question.points <= 20;
          if (action.payload === "Hard") return question.points > 20;
          if (action.payload === "Mixed") return question;
          return true;
        }),
        status: "questType",
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemainig },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, cur) => acc + cur.points, 0);
  // const maxPossiblePoints = 10;

  const [score, setScore] = useLocalStorageState([], "highscore");

  // console.log(questions);

  function handleHighscore() {
    setScore(highscore);
  }

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "dataReceived", payload: data.questions });
        // console.log(data.questions);
      })
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <QuizType dispatch={dispatch} questions={questions} />
        )}
        {status === "questType" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}

        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestion={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question question={questions[index]}>
              <Options
                question={questions[index]}
                dispatch={dispatch}
                answer={answer}
              />
            </Question>
            <Footer>
              <Timer dispatch={dispatch} secondsRemainig={secondsRemainig} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
            score={score}
            onHighscore={handleHighscore}
          />
        )}
      </Main>
    </div>
  );
}
