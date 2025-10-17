import React, { useState, useEffect, useRef } from "react";

const colors = [
  "Red", "Blue", "Green", "Yellow", "Purple", "Orange",
  "Pink", "Cyan", "Brown", "Lime"
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ColorStroopGameHard = () => {
  const [started, setStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [displayColor, setDisplayColor] = useState("");
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [streak, setStreak] = useState(0);
  const [bonusMsg, setBonusMsg] = useState("");

  const clockSound = useRef(null);

  const stopAllSounds = () => {
    if (clockSound.current) {
      clockSound.current.pause();
      clockSound.current.currentTime = 0;
    }
  };

  const playSound = (src, volume = 1, loop = false) => {
    const audio = new Audio(`${process.env.PUBLIC_URL}${src}`);;
    audio.volume = volume;
    audio.loop = loop;
    audio.play().catch(() => {});
    return audio;
  };

  const getTimeLimit = (currentScore) =>
    Math.max(4, 10 - Math.floor(currentScore / 5));

  const newRound = (newScore = score) => {
    stopAllSounds(); // stop previous tick sounds

    const word = getRandomItem(colors);
    let color = getRandomItem(colors);
    while (color === word) color = getRandomItem(colors);

    setCurrentWord(word);
    setDisplayColor(color);

    const correctAnswer = word;
    let opts = [correctAnswer];
    while (opts.length < 6) {
      const randOpt = getRandomItem(colors);
      if (!opts.includes(randOpt)) opts.push(randOpt);
    }
    setOptions(opts.sort(() => Math.random() - 0.5));

    const newTime = getTimeLimit(newScore);
    setTimeLeft(newTime);
  };

  // 🕒 Timer effect
  useEffect(() => {
    if (!started || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopAllSounds();
          playSound("/sounds/wrong.mp3");
          setGameOver(true);
          return 0;
        }
        if (t <= 6 && t > 1) {
          stopAllSounds();
          clockSound.current = playSound("/sounds/clock.mp3", 0.5);
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      stopAllSounds();
    };
  }, [started, gameOver]);

  const handleClick = (color) => {
    if (gameOver) return;
    stopAllSounds();
    playSound("/sounds/click.mp3", 0.8);

    if (color === currentWord) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      let points = 5;
      if (newStreak >= 3 && newStreak % 3 === 0) {
        points += 10;
        stopAllSounds();
        playSound("/sounds/bonus.mp3");
        setBonusMsg(`🔥 Combo Bonus +10!`);
        setTimeout(() => setBonusMsg(""), 900);
      }

      const newScore = score + points;
      setScore(newScore);
      newRound(newScore);
    } else {
      stopAllSounds();
      playSound("/sounds/wrong.mp3");
      setGameOver(true);
    }
  };

  const startGame = () => {
    stopAllSounds();
    playSound("/sounds/start.mp3");
    setStarted(true);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setBonusMsg("");
    setTimeLeft(10);
    newRound(0);
  };

  // ✨ Fade animation for combo text
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        50% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
        background: "radial-gradient(circle at top, #0f0f0f 0%, #000 100%)",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
        textAlign: "center",
      }}
    >
      {!started && (
        <div>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#00FFFF" }}>
            🎨 Reverse Stroop Clash
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "1.5rem",
              color: "#ddd",
              maxWidth: "600px",
              lineHeight: "1.6",
            }}
          >
            Tap the <b>color the word says</b>, not the color it's written in!  
            Timer shrinks as you score higher.  
            3 correct in a row = 🔥 Combo Bonus +10  
            One wrong answer ends the game.
          </p>
          <button
            onClick={startGame}
            style={{
              fontSize: "1.5rem",
              padding: "15px 40px",
              borderRadius: "15px",
              border: "none",
              backgroundColor: "#00FFFF",
              color: "#000",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 0 20px #00FFFF",
              transition: "transform 0.2s",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Start Game
          </button>
        </div>
      )}

      {started && !gameOver && (
        <>
          <div style={{ position: "absolute", top: "20px", right: "30px", fontSize: "1.5rem" }}>
            ⏱ {timeLeft}s
          </div>

          {bonusMsg && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                right: "30px",
                fontSize: "1.3rem",
                color: "#FFD700",
                fontWeight: "bold",
                animation: "fadeInOut 0.8s ease",
              }}
            >
              {bonusMsg}
            </div>
          )}

          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>Score: {score}</div>

          <div
            style={{
              fontSize: "6rem",
              fontWeight: "bold",
              color: displayColor.toLowerCase(),
              margin: "40px 0",
              letterSpacing: "2px",
            }}
          >
            {currentWord}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: "20px",
              width: "90%",
              maxWidth: "600px",
              marginTop: "20px",
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleClick(opt)}
                style={{
                  height: "90px",
                  borderRadius: "20px",
                  border: "3px solid #fff",
                  backgroundColor: opt.toLowerCase(),
                  boxShadow: `0 0 20px ${opt.toLowerCase()}`,
                  cursor: "pointer",
                  transition: "transform 0.15s",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              ></button>
            ))}
          </div>
        </>
      )}

      {gameOver && started && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ fontSize: "2.5rem", color: "#FF6347" }}>💥 Game Over!</h2>
          <p style={{ fontSize: "1.5rem" }}>Final Score: {score}</p>
          <button
            onClick={startGame}
            style={{
              padding: "15px 35px",
              fontSize: "1.5rem",
              cursor: "pointer",
              marginTop: "20px",
              borderRadius: "15px",
              border: "none",
              backgroundColor: "#00FFFF",
              color: "#000",
              fontWeight: "bold",
              boxShadow: "0 0 20px #00FFFF",
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorStroopGameHard;
