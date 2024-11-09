"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import ConfettiAnimation from './ConfettiAnimation.jsx'

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
            if (averageVolume > 60) {
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
    <div className="mainComp">
      <div className={`${isOpacityZero && "changeOpacity"}`}>
        <div
          className={`cardContainer ${isOpen ? "open" : ""}`}
          onClick={toggleCard}
        >
          <div className="card">
            <div className="front">
              <div className="outside">
                <div className={`${isOpen && "changeOpacity"}`}>
                <h1>Happy Birthday!!!</h1>
                <Image
                  src="/unicorn.png"
                  alt="light"
                  width={180}
                  height={180}
                  onTransitionEnd={handleTransitionEnd}
                />

                </div>
                <p className="footnote">click to open</p>
              </div>
              <div className="inside"></div>
            </div>
            <div className="back">
              <div className="inside">
                <div className="cake-comp">
                  <Image
                    className={`${blowCandle && "changeOpacity"} cake-candle`}
                    src="/light.png"
                    alt="light"
                    width={10}
                    height={34}
                    onTransitionEnd={handleTransitionEnd}
                  />
                  <Image
                    src="/cake.png"
                    alt="cake"
                    className="cake"
                    width={180}
                    height={191}
                  />
                <p onClick={() => setIsOpacityZero(true)} className="footnote">*Blow the candle or click here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`christmas-sec ${isOpacityZero ? "zoom-in" : ""}`}>
        <ConfettiAnimation />
        <div className="christmas-card">
          <h1 className="christmas-title">It's Time!!!!</h1>
          <Image
            src="/mariah.png"
            alt="mariah"
            className="mariah"
            width={250}
            height={333}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
