function Progress({ index, numQuestion, points, maxPossiblePoints, answer }) {
  return (
    <header className="progress">
      <progress max={numQuestion} value={index + Number(answer !== null)} />

      <p>
        Question{" "}
        <strong>
          {index + 1} / {numQuestion}
        </strong>
      </p>

      <p style={{ fontWeight: "bold" }}>
        {points} / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
