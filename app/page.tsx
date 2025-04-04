"use client"

const response_test = {
  downloads: {
    instrumental:
      "https://rendered-stem-bucket.s3.us-west-2.amazonaws.com/stems/instrumental_Smino_-_Polynesian_Official_Music_Video.mp3",
    vocals:
      "https://rendered-stem-bucket.s3.us-west-2.amazonaws.com/stems/vocals_Smino_-_Polynesian_Official_Music_Video.mp3",
  },
  message: "Separation complete",
  original_file:
    "https://rendered-stem-bucket.s3.us-west-2.amazonaws.com/originals/Smino_-_Polynesian_Official_Music_Video.mp3",
  processing_time: 149.065119561,
  separation_time: 146.897797809,
};

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioPlayer = () => {
  const waveformRef1 = useRef<HTMLDivElement>(null);
  const waveformRef2 = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [response, setResponse] = useState<any>(response_test);
  
  const resLinks = Object.entries(response['downloads']); 
  console.log('resLinks', resLinks)
  const wavesurferRef = useRef<{ wavesurfer1: WaveSurfer | null, wavesurfer2: WaveSurfer | null }>({
    wavesurfer1: null,
    wavesurfer2: null
  });

  // const handleMute1 = () => {
  //   if (wavesurferRef.current.wavesurfer1) {
  //     wavesurferRef.current.wavesurfer1.setMuted(!isMuted1);
  //     setIsMuted1(!isMuted1);
  //   }
  // };

  // const handleMute2 = () => {
  //   if (wavesurferRef.current.wavesurfer2) {
  //     wavesurferRef.current.wavesurfer2.setMuted(!isMuted2);
  //     setIsMuted2(!isMuted2);
  //   }
  // };

  const handlePlayPause = () => {
    if (wavesurferRef.current.wavesurfer1 && wavesurferRef.current.wavesurfer2) {
      if (isPlaying) {
        wavesurferRef.current.wavesurfer1.pause();
        wavesurferRef.current.wavesurfer2.pause();
      } else {
        wavesurferRef.current.wavesurfer1.play();
        wavesurferRef.current.wavesurfer2.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (position: number) => {
    console.log('Seeking to position:', position);
    if (wavesurferRef.current.wavesurfer1 && wavesurferRef.current.wavesurfer2) {
      wavesurferRef.current.wavesurfer1.seekTo(position);
      wavesurferRef.current.wavesurfer2.seekTo(position);
      setCurrentTime(position);
    }
  };


  useEffect(() => {
    if (!waveformRef1.current || !waveformRef2.current) return;
    
    const wavesurfer1 = WaveSurfer.create({
      container: waveformRef1.current,
      waveColor: '#4F4A85',
      progressColor: '#383351',
      height: 100,
      cursorWidth: 1,
      interact: true
    });

    const wavesurfer2 = WaveSurfer.create({
      container: waveformRef2.current,
      waveColor: '#4F4A85',
      progressColor: '#383351',
      height: 100,
      cursorWidth: 1,
      interact: true
    });

    wavesurferRef.current = { wavesurfer1, wavesurfer2 };

    // Add click handlers for seeking
    wavesurfer1.on('click', handleSeek);
    wavesurfer2.on('click', handleSeek);

    // Update time state
    wavesurfer1.on('audioprocess', (time: number) => {
      setCurrentTime(time);
    });

    // Load audio files
    wavesurfer1.load('https://rendered-stem-bucket.s3.us-west-2.amazonaws.com/stems/vocals_Smino_-_Polynesian_Official_Music_Video.mp3');
    wavesurfer2.load('https://rendered-stem-bucket.s3.us-west-2.amazonaws.com/stems/instrumental_Smino_-_Polynesian_Official_Music_Video.mp3');

    // Cleanup on unmount
    return () => {
      if (wavesurfer1) {
        wavesurfer1.destroy();
      }
      if (wavesurfer2) {
        wavesurfer2.destroy();
      }
    }
  }, []);

  return (
    <div>
      <div>
        <div className='flex flex-row items-center gap-2 justify-between'>
          <div ref={waveformRef1} className="max-w-[30rem] flex-1"></div>
          <button 
            // onClick={handleMute1}
            style={{
              padding: '5px 10px',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
          </button>
        </div>
        <div className='flex flex-row items-center gap-2 justify-between'>
          <div ref={waveformRef2} className="max-w-[30rem] flex-1"></div>
          <button 
            // onClick={handleMute2}
            style={{
              padding: '5px 10px',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
          </button>
        </div>
      </div>
      <div>Current Time: {Math.floor(currentTime)}s</div>
      <button 
        onClick={handlePlayPause}
        style={{
          padding: '10px 20px',
          margin: '10px 0',
          backgroundColor: '#4F4A85',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default AudioPlayer;