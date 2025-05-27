'use client'

import { useEffect, useRef } from 'react'

import clsx from 'clsx'

const PixelGridCanvas = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('Canvas not found')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('Failed to get 2D context')
      return
    }

    // Set initial canvas size
    // let width = (canvas.width = window.innerWidth)
    // let height = (canvas.height = window.innerHeight)

    const spacing = 4 // Distance between grid points
    const radius = 2 // Radius of each point

    // Handle window resize
    // const handleResize = () => {
    //   width = canvas.width = window.innerWidth
    //   height = canvas.height = window.innerHeight
    // }
    let pixelColor = 'rgba(255, 0, 0, 1)' // Default pixel color

    const handleMouseEnter = () => {
      console.log('Mouse entered canvas')
      pixelColor = 'rgba(0, 255, 0, 1)' // Change to green on mouse enter
    }

    const handleMouseLeave = () => {
      console.log('Mouse left canvas')
      pixelColor = 'rgba(0, 255, 0, 1)' // Reset to white on mouse leave
    }

    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    // window.addEventListener('resize', handleResize)

    // Draw function for the twinkling effect
    const draw = (time: number) => {
      console.log('Drawing frame', time)
      if (!canvasRef.current) {
        return
      }
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      for (let y = 0; y < canvasRef.current.height; y += spacing) {
        for (let x = 0; x < canvasRef.current.width; x += spacing) {
          ctx.beginPath()
          ctx.rect(x, y, radius, radius)
          const twinkle = Math.random() * 0.5 + 0.5 // Random twinkle effect
          // if (Math.random() < 0.5) {
          //   ctx.fillStyle = `rgba(255, 255, 255, 0.2)` // Twinkling effect
          // } else {
          //   ctx.fillStyle = `rgba(255, 255, 255, 1)` // Twinkling effect
          // }
          ctx.fillStyle = `rgba(${pixelColor.match(/\d+/g)?.join(', ')}, ${twinkle})` // Use dynamic color
          ctx.fill()
          // const twinkle = 0.4 + 0.6 * Math.sin((x + y + time * 0.002) / 10)
          // ctx.arc(x, y, radius, 0, Math.PI * 2)
          // ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})` // Twinkling effect
          // ctx.fill()
        }
      }
      setTimeout(() => {
        requestAnimationFrame(draw)
      }, 1000 / 1) // 6 FPS
    }

    // Start the animation
    draw(0)

    return () => {
      // window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className={clsx(className, 'relative isolate flex overflow-hidden')}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          // pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default PixelGridCanvas
