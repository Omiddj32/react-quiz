function QuizType({ dispatch, filterQuestions }) {
  // console.log(filterQuestions);
  return (
    <div className="start" style={{ gap: "1rem", alignItems: "normal" }}>
      <h3>Choose Your Quiz Type :</h3>
      <button
        className="btn"
        onClick={() => dispatch({ type: "difficulty", payload: "Easy" })}
      >
        Easy
      </button>
      <button
        className="btn"
        onClick={() => dispatch({ type: "difficulty", payload: "Normal" })}
      >
        Normal
      </button>
      <button
        className="btn"
        onClick={() => dispatch({ type: "difficulty", payload: "Hard" })}
      >
        Hard
      </button>

      <button
        className="btn"
        onClick={() => dispatch({ type: "difficulty", payload: "Mixed" })}
      >
        Mixed
      </button>
    </div>
  );
}

export default QuizType;
