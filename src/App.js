import './App.css';
import {useState, useEffect} from 'react'
import sound from './Clock-alarm-electronic-beep.mp3'

function App() {
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [countdownAndIsSession, setCountdownAndIsSession] = useState({"countdown": sessionLength * 60, "isSession": true})
  const [isRunning, setIsRunning] = useState(false)
  

  function increaseBreak() {
    setBreakLength(breakLength => {
      if (breakLength < 60 && !isRunning) {
        return breakLength + 1
      }
      else return breakLength
      })
  }

  function decreaseBreak() {
    setBreakLength(breakLength => {
      if (breakLength > 1 && !isRunning) {
        return breakLength - 1
      }
      else return breakLength
      })
  }

  function increaseSession() {
    setSessionLength(sessionLength => {
      if (sessionLength < 60 && !isRunning) {
        return sessionLength + 1
      }
      else return sessionLength
      })
  }

  function decreaseSession() {
    setSessionLength(sessionLength => {
      if (sessionLength > 1 && !isRunning) {
        return sessionLength - 1
      }
      else return sessionLength
      })
  }

  function handleReset() {
    clearInterval(window.isInterval)
    // clearInterval(window.isBreakInterval)
    setBreakLength(5)
    setSessionLength(25)
    setCountdownAndIsSession({"countdown": sessionLength * 60, "isSession": true})
    setIsRunning(false)
    // rewind audio element
  }

  useEffect(() => {
    setCountdownAndIsSession(prev => {
      if (isRunning) return prev
      else if (!isRunning && (prev.countdown % 60 !== 0)) return prev
      else {
        let obj = {"countdown": sessionLength * 60, "isSession": true}
        return obj
      }
    })
  }, [sessionLength, isRunning])

  /* const Timer = ({ seconds }) => {
    // initialize timeLeft with the seconds prop
    const [timeLeft, setTimeLeft] = useState(seconds);
  
    useEffect(() => {
      // exit early when we reach 0
      if (!timeLeft) return;
  
      // save intervalId to clear the interval when the
      // component re-renders
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
  
      // clear interval on re-render to avoid memory leaks
      return () => clearInterval(intervalId);
      // add timeLeft as a dependency to re-rerun the effect
      // when we update it
    }, [timeLeft]);
  
    return (
      <div>
        <h1>{timeLeft}</h1>
      </div>
    );
  }; */


  
  function startStoppedClicked() {
    setIsRunning(prev => !prev)
  }


  useEffect(() => {
    clearInterval(window.isInterval)

      window.isInterval = setInterval(() => {
        setCountdownAndIsSession(prev => {
          if (prev["countdown"] >= 1 && (isRunning === true)) {
            let obj = {"isSession": prev["isSession"], "countdown": prev["countdown"] - 1}
            return (
              obj
            )
          }
          else if (isRunning === false) {
            clearInterval(window.isInterval)
            return (
              prev
            )
          }
          else {
            // play audio element
            playAudio()
            if (countdownAndIsSession['isSession'] === true) {
              let obj = {"isSession": !prev["isSession"], "countdown": breakLength * 60}
              return (
                obj
              )
            }
            else {
              let obj = {"isSession": !prev["isSession"], "countdown": sessionLength * 60}
              return (
                obj
              )
            }
          }
        })
        
        
      }, 1000)
  }, [isRunning, countdownAndIsSession, breakLength, sessionLength])

  const playAudio = audio => {
    const audioToPlay = new Audio(sound);
    audioToPlay.play();
  };
  
 
  return (
    <div className="App">
      <div id="app-content">
        <div id="app-name">
          <h1>25 + 5 Clock</h1>
        </div>
        <div id="break-and-session-length">
          <div className="break-length">
            <div id="break-label">
              Break Length
            </div>
            <div id="break-length-functionality">
              <button id="break-increment" onClick={increaseBreak}>Inc</button><span id="break-length">{breakLength}</span><button id="break-decrement" onClick={decreaseBreak}>Dec</button>
            </div>
            
          </div>
          <div className="session-length">
            <div id="session-label">
              Session Length
            </div>
            <div id="session-length-functionality">
              <button  id="session-increment" onClick={increaseSession}>Inc</button><span id="session-length">{sessionLength}</span><button id="session-decrement" onClick={decreaseSession}>Dec</button>
            </div>
            
          </div>
        </div>

        <div id="timer">
          <div id="timer-label">
            <DisplayTimerLabel countdownAndIsSession={countdownAndIsSession}/>
          </div>
          <div id="time-left">
            <TimeDisplay countdownAndIsSession={countdownAndIsSession} />
          </div>
        </div>
        <div id="media-buttons">
          <div id="start-stop">
            <button onClick={startStoppedClicked}>Start-Stop</button>
          </div>
          <div id="reset-button">
            <button onClick={handleReset}>Reset</button>
          </div>
        </div>
        <audio src="/media/cc0-audio/t-rex-roar.mp3" ></audio>
      </div>
    </div>
  );
}

const TimeDisplay = (props) => {
  let copy = Object.assign({}, props.countdownAndIsSession);
    if (copy["isSession"] !== undefined) {
  var time = copy["countdown"]
  
  let minutes = Math.floor(time / 60)
  let seconds = time - Math.floor(time / 60) * 60
  let firstZero = ''
  let secondZero = ''
  if (minutes.toString().length === 1) firstZero = '0'
  if (seconds.toString().length === 1) secondZero = '0'
  return firstZero + minutes + ':' + secondZero + seconds
    }
}

const DisplayTimerLabel = (props) => {
  let copy = Object.assign({}, props.countdownAndIsSession);

    console.log(copy["isSession"])
  if (copy["isSession"] !== undefined) {
    if (copy["isSession"] === true) return 'Session'
  else return 'Break'
  }
  
}

export default App;
