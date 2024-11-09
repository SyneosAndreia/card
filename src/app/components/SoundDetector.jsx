'use client'


import { useEffect } from 'react';

const SoundDetector = () => {
  useEffect(() => {
    // Check if browser supports audio features
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      const handleSoundDetection = async () => {
        try {
          // Request permission to access the microphone
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

          // Create AudioContext and AnalyserNode
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;

          const microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const detectSound = () => {
            analyser.getByteFrequencyData(dataArray);

            // Calculate the average volume of the audio input
            const averageVolume =
              dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

            // Log 'sound' if the volume is above a certain threshold
            if (averageVolume > 50) { // Adjust threshold as needed
              console.log('sound');
            }

            requestAnimationFrame(detectSound);
          };

          detectSound();
        } catch (error) {
          console.error('Microphone access error:', error);
        }
      };

      handleSoundDetection();
    }
  }, []);

  return <p>Listening for sounds...</p>;
};

export default SoundDetector;
