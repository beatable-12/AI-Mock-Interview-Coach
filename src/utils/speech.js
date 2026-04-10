export function isSpeechRecognitionSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function startSpeechRecognition({ onResult, onEnd, onError }) {
  if (!isSpeechRecognitionSupported()) {
    onError(new Error("Voice recognition not supported in this browser."));
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    
    onResult({ finalTranscript, interimTranscript });
  };

  recognition.onerror = (event) => {
    onError(new Error(`Speech recognition error: ${event.error}`));
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.start();
  return recognition;
}

export function stopSpeechRecognition(recognition) {
  if (recognition) {
    recognition.stop();
  }
}
