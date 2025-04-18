'use client'

import { useEffect, useRef } from 'react'

import clsx from 'clsx'
import createGlobe, { Marker } from 'cobe'

export default function GlobeBall({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const markersRef = useRef([
    { location: [37.7595, -122.4367], size: 0.03 },
    { location: [40.7128, -74.006], size: 0.1 },
  ] as Marker[]) // Use a ref to store markers without triggering re-renders

  useEffect(() => {
    let phi = 0

    // Initialize the globe
    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: canvasRef.current!.offsetWidth * 2, // Dynamically set width
      height: canvasRef.current!.offsetWidth * 2, // Maintain aspect ratio
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: markersRef.current, // Use markers from the ref
      onRender: (state) => {
        // Dynamically update markers
        state.markers = markersRef.current.map((marker) => ({
          location: marker.location,
          size: marker.size,
        }))
        state.phi = phi
        phi += 0.004
      },
    })

    const handleResize = () => {
      if (canvasRef.current) {
        const newWidth = canvasRef.current.offsetWidth * 2
        const newHeight = canvasRef.current.offsetWidth * 2 // Maintain aspect ratio
        canvasRef.current.width = newWidth
        canvasRef.current.height = newHeight
      }
    }

    // Set initial size and add resize listener
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      globe.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }, []) // Initialize the globe only once

  const addMarker = () => {
    const newMarker = {
      location: [Math.random() * 180 - 90, Math.random() * 360 - 180],
      size: Math.random() * 0.1 + 0.01,
    }

    // Update the markers in the ref
    markersRef.current = [...markersRef.current, newMarker]
  }

  return (
    <div
      className={clsx(
        className,
        'flex h-full w-full items-center justify-center bg-amber-200',
      )}
      // style={{ width: '100%', position: 'relative' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%', // Take up the full width of the container
          height: 'auto', // Maintain aspect ratio
          aspectRatio: '1 / 1', // Ensure the globe remains a perfect circle
        }}
      />
    </div>
  )
}
