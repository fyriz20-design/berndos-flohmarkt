'use client'
import React from 'react'

export default function RainbowWave() {
  return (
    <>
      <div className="wave-container" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        transform: 'rotate(180deg)',
        zIndex: 1
      }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{
          position: 'relative',
          display: 'block',
          width: 'calc(180% + 1.3px)',
          height: '120px'
        }}>
          <defs>
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="16%" stopColor="#f59e0b" />
              <stop offset="33%" stopColor="#facc15" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="66%" stopColor="#3b82f6" />
              <stop offset="83%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="rainbow-wave-path" />
        </svg>
      </div>

      <style jsx>{`
        .rainbow-wave-path {
          fill: url(#rainbowGrad);
          animation: rainbowFlow 8s linear infinite, waveMotion 12s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
        }
        
        @keyframes rainbowFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33%); }
        }
        
        @keyframes waveMotion {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(10px) scaleY(1.1); }
        }
      `}</style>
    </>
  )
}
