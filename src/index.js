const mainHeaderStatus = document.querySelector('#status-msg')
const mainHeaderDescription = document.querySelector('#description')
// const aimContainer = document.querySelector('#aim-container')
const aimEnterButton = document.querySelector('#aim-button')
const countdownContainer = document.querySelector('#countdown-container')
// const motivMsgContainer = document.querySelector('#motiv-msg-container')
const startStopButton = document.querySelector('#start-stop-button')

const states = {
  STOPPED: 'Stopped',
  WORKING: 'Working',
  DONE_WORKING: 'Done working, waiting to start resting',
  RESTING: 'Resting'
}

const aimStates = {
  ENTERED: 'Entered text',
  EDITING: 'Editing'
}

let currentState = states.STOPPED
let currentAimState = aimStates.EDITING
let setCountdownInterval

function setStartStopButtonText () {
  switch (currentState) {
    case states.STOPPED:
      startStopButton.innerHTML = 'Start working!'
      break
    case states.WORKING:
      startStopButton.innerHTML = 'Reset'
      break
    case states.DONE_WORKING:
      startStopButton.innerHTML = 'Start resting!'
      break
    case states.RESTING:
      startStopButton.innerHTML = 'Reset'
      break
  }
}

function setEnterEditButtonText () {
  switch (currentAimState) {
    case aimStates.ENTERED:
      aimEnterButton.innerHTML = 'Edit'
      break
    case aimStates.EDITING:
      aimEnterButton.innerHTML = 'Enter'
      break
  }
}

function enterAimText () {
  let aimTextInput = document.getElementById('aim-text-input')
  let text = aimTextInput.value
  aimTextInput.hidden = true

  if (text === '') {
    console.log('no aim text given')
    text = 'Work!'
  }

  let aimTextElm = document.getElementById('aim-text')
  aimTextElm.innerHTML = text
  aimTextElm.hidden = false
}

function editAimText () {
  let aimTextElm = document.getElementById('aim-text')
  let text = aimTextElm.textContent
  aimTextElm.hidden = true

  let aimTextInput = document.getElementById('aim-text-input')
  aimTextInput.value = text
  aimTextInput.hidden = false
}

function onClickEnterAimTextButton () {
  if (currentAimState === aimStates.EDITING) {
    enterAimText()
    currentAimState = aimStates.ENTERED
    setEnterEditButtonText()
  } else {
    editAimText()
    currentAimState = aimStates.EDITING
    setEnterEditButtonText()
  }
}

// switch (currentState) {
//   case states.STOPPED:
//   case states.WORKING:
//   case states.DONE_WORKING:
//   case states.RESTING:
// }

function setHeaderText () {
  switch (currentState) {
    case states.STOPPED:
      mainHeaderStatus.textContent = 'Ready to start working?'
      mainHeaderDescription.hidden = false
      break
    case states.WORKING:
      mainHeaderStatus.textContent = 'Working...'
      mainHeaderDescription.hidden = true
      break
    case states.DONE_WORKING:
      mainHeaderStatus.textContent = 'Time for a break!'
      break
    case states.RESTING:
      mainHeaderStatus.textContent = 'Taking a break :)'
      break
  }
}

function freezeAimTextContainer () {
  // remove edit button
  aimEnterButton.hidden = true

  // put text instead of the input form
  let aimTextInput = document.getElementById('aim-text-input')
  let aimDescription = document.getElementById('aim-description')

  switch (currentState) {
    case states.WORKING:
      if (!aimTextInput.hidden) { // did not enter anything
        aimTextInput.hidden = true
        aimDescription.hidden = true
      } else {
        aimDescription.textContent = 'I am going to:'
      }
      break
    case states.DONE_WORKING:
      aimDescription.textContent = 'I have accomplished:'
      break
  }
}

function unfreezeAimTextContainer () {
  if (currentState !== states.STOPPED) {
    throw 'currentState is NOT STOPPED!'
  }

  let aimTextInput = document.getElementById('aim-text-input')
  let aimDescription = document.getElementById('aim-description')

  aimTextInput.hidden = false
  aimTextInput.value = ''
  aimDescription.hidden = false
  aimDescription.textContent = 'I aim to:'

  aimEnterButton.hidden = false
}

function onClickStartStopButton () {
  switch (currentState) {
    case states.STOPPED:
      startCountdown(0.1)
      currentState = states.WORKING
      freezeAimTextContainer()
      setHeaderText()
      setStartStopButtonText()
      break
    case states.WORKING:
      clearInterval(setCountdownInterval)
      setCountdownTimerText('25', '00')
      currentState = states.STOPPED
      unfreezeAimTextContainer()
      setHeaderText()
      setStartStopButtonText()
      break
    case states.DONE_WORKING:
      startCountdown(0.1)
      currentState = states.RESTING
      freezeAimTextContainer()
      setHeaderText()
      setStartStopButtonText()
      break
    case states.RESTING:
      clearInterval(setCountdownInterval)
      setCountdownTimerText('25', '00')
      currentState = states.STOPPED
      unfreezeAimTextContainer()
      setHeaderText()
      setStartStopButtonText()
      break
  }
}

function setup () {
  // Add click listener to buttons
  startStopButton.addEventListener('click', onClickStartStopButton)
  aimEnterButton.addEventListener('click', onClickEnterAimTextButton)

  // Set the countdown timer text
  setCountdownTimerText('25', '00')
}

function triggerUpdate () {
  switch (currentState) {
    case states.WORKING:
      setCountdownTimerText('5', '00')
      currentState = states.DONE_WORKING
      freezeAimTextContainer()
      setHeaderText()
      setStartStopButtonText()
      break
    case states.RESTING:
      setCountdownTimerText('25', '00')
      currentState = states.STOPPED
      unfreezeAimTextContainer()
      setHeaderText()
      setStartStopButtonText()
      break
    default:
      throw 'NOT one of WORKING or RESTING!'
  }
}

function setCountdownTimerText (displayMinutes, displaySeconds) {
  countdownContainer.innerHTML = `<h1>${displayMinutes} : ${displaySeconds}</h1>`
}

function startCountdown (minutesChosen) {
  // Get total time in seconds
  let totalTimeSeconds = minutesChosen * 60

  // Update the timer every 1s
  setCountdownInterval = setInterval(function () {
    let displaySeconds = totalTimeSeconds % 60
    let displayMinutes = Math.floor(totalTimeSeconds / 60)

    // Add a 0 in front of displaySeconds if it is a single digit
    displaySeconds = displaySeconds < 10 ? '0' + displaySeconds : displaySeconds

    // Add the time to the countdown container
    setCountdownTimerText(displayMinutes, displaySeconds)

    // Decrement the totalTimeSeconds
    totalTimeSeconds--

    // If time reaches 0, stop the countdown
    if (totalTimeSeconds < 0) {
      clearInterval(setCountdownInterval)
      triggerUpdate()
    }
  }, 1000)
}

setup()
