"use client";

import { useState, useEffect } from "react";
import SoundDetector from "./SoundDetector.jsx";
import Image from "next/image";

const Card = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [blowCandle, setBlowCandle] = useState(false);
  const [isOpacityZero, setIsOpacityZero] = useState(false);

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  const handleTransitionEnd = () => {
    if (blowCandle) {
      setIsOpacityZero(true); 
      console.log("Opacity is now zero!");
    }
  };

  useEffect(() => {
    // Check if browser supports audio features
    if (typeof window !== "undefined" && navigator.mediaDevices && isOpen) {
      const handleSoundDetection = async () => {
        try {
          // Request permission to access the microphone
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

          // Create AudioContext and AnalyserNode
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;

          const microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const detectSound = () => {
            analyser.getByteFrequencyData(dataArray);

            // Calculate the average volume of the audio input
            const averageVolume =
              dataArray.reduce((sum, value) => sum + value, 0) /
              dataArray.length;

            // Log 'sound' if the volume is above a certain threshold
            if (averageVolume > 85) {
              // Adjust threshold as needed
              setBlowCandle(true);
            }

            requestAnimationFrame(detectSound);
          };

          detectSound();
        } catch (error) {
          console.error("Microphone access error:", error);
        }
      };

      handleSoundDetection();
    }
  }, [isOpen]);

  return (
    <div
      className={`cardContainer ${isOpen ? "open" : ""}`}
      onClick={toggleCard}
    >
      <div className="card">
        <div className="front">
          <div className="outside">
            <p>
              Greetings!
              <br />
              <br />
              <small>(Card's cover)</small>
            </p>
          </div>
          <div className="inside">
            <p>
              Hello xyz
              <br />
              <br />
              <small>(Card - inside, top half)</small>
            </p>
          </div>
        </div>
        <div className="back">
          <div className="inside">
            <h1>Happy Birthday!!!</h1>
            <div className="cake-comp">
              <Image
                className={`${blowCandle && "changeOpacity"} cake-candle`}
                src="/light.png" 
                alt="light"
                width={8} 
                height={31} 
                onTransitionEnd={handleTransitionEnd}
              />
              <Image
                src="/cake.png" 
                alt="cake"
                className="cake"
                width={223}
                height={238} 
              />
            </div>
          </div>
        </div>
      </div>


      <div className="christmas-sec">


      </div>
    </div>
  );
};

export default Card;
