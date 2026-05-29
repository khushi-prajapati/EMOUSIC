import { useCallback, useEffect, useRef, useState } from 'react'
import LoadingSpinner from '../LoadingSpinner'

function WebcamEmotionDetector({ onDetected, isRecommending, scanIntervalMs = 3000 }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const isDetectingRef = useRef(false)
  const [cameraState, setCameraState] = useState('idle')
  const [error, setError] = useState('')
  const [isAutoScanning, setIsAutoScanning] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [lastDetection, setLastDetection] = useState(null)
  const [scanCount, setScanCount] = useState(0)

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      throw new Error('Camera is not ready yet.')
    }

    const maxWidth = 640
    const scale = Math.min(1, maxWidth / video.videoWidth)
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL('image/jpeg', 0.72)
  }, [])

  const runDetection = useCallback(async () => {
    if (isDetectingRef.current || isRecommending || cameraState !== 'ready') {
      return
    }

    setError('')
    isDetectingRef.current = true
    setIsDetecting(true)

    try {
      const image = captureFrame()
      const detection = await onDetected(image)
      setLastDetection(detection)
      setScanCount((current) => current + 1)
    } catch (scanError) {
      const detail = scanError.response?.data?.detail || scanError.message
      setError(detail || 'Unable to detect emotion from this frame.')
    } finally {
      isDetectingRef.current = false
      setIsDetecting(false)
    }
  }, [cameraState, captureFrame, isRecommending, onDetected])

  useEffect(() => {
    if (!isAutoScanning || cameraState !== 'ready') {
      return undefined
    }

    const firstScanId = window.setTimeout(runDetection, 0)
    const intervalId = window.setInterval(runDetection, scanIntervalMs)

    return () => {
      window.clearTimeout(firstScanId)
      window.clearInterval(intervalId)
    }
  }, [cameraState, isAutoScanning, runDetection, scanIntervalMs])

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setIsAutoScanning(false)
    setCameraState('idle')
  }

  const startCamera = async () => {
    setError('')

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is not supported in this browser.')
      return
    }

    try {
      setCameraState('starting')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 960 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraState('ready')
      setIsAutoScanning(true)
    } catch (cameraError) {
      setCameraState('idle')
      setError(
        cameraError.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access and try again.'
          : 'Unable to open the camera.',
      )
    }
  }

  const isBusy = isDetecting || isRecommending
  const canScan = cameraState === 'ready' && !isBusy
  const statusLabel = isAutoScanning ? 'Live scanning' : 'Paused'

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm dark:border-slate-800">
        <div className="relative aspect-video bg-slate-950">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          {cameraState !== 'ready' && (
            <div className="absolute inset-0 grid place-items-center bg-slate-950 text-center text-slate-300">
              <div>
                <p className="text-lg font-semibold text-white">Camera preview</p>
                <p className="mt-2 text-sm text-slate-400">Open your camera to scan your mood.</p>
              </div>
            </div>
          )}
          {isBusy && (
            <div className="absolute inset-0 grid place-items-center bg-slate-950/70 backdrop-blur-sm">
              <LoadingSpinner label={isDetecting ? 'Analyzing frame...' : 'Refreshing songs...'} />
            </div>
          )}
          {cameraState === 'ready' && (
            <div className="absolute left-4 top-4 rounded-md bg-slate-950/80 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white">
              {statusLabel}
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
          AI mood scan
        </p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
          Real-time emotion intelligence
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">
          {cameraState === 'ready' ? (
            <button
              type="button"
              onClick={stopCamera}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Close camera
            </button>
          ) : (
            <button
              type="button"
              onClick={startCamera}
              disabled={cameraState === 'starting'}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {cameraState === 'starting' ? 'Opening...' : 'Open camera'}
            </button>
          )}
          <button
            type="button"
            onClick={runDetection}
            disabled={!canScan}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            Scan now
          </button>
          <button
            type="button"
            onClick={() => setIsAutoScanning((current) => !current)}
            disabled={cameraState !== 'ready'}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isAutoScanning ? 'Pause live scan' : 'Resume live scan'}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">Interval</p>
            <p className="mt-1 font-semibold text-slate-950 dark:text-white">
              {Math.round(scanIntervalMs / 1000)}s
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">Scans</p>
            <p className="mt-1 font-semibold text-slate-950 dark:text-white">{scanCount}</p>
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        {lastDetection && (
          <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/40">
            <p className="text-sm text-teal-800 dark:text-teal-200">Detected emotion</p>
            <p className="mt-1 text-2xl font-bold capitalize text-slate-950 dark:text-white">
              {lastDetection.emotion}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Confidence</dt>
                <dd className="font-semibold text-slate-950 dark:text-white">
                  {Math.round(Number(lastDetection.confidence) * 100)}%
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Music mood</dt>
                <dd className="font-semibold capitalize text-slate-950 dark:text-white">
                  {lastDetection.mapped_mood}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </aside>
    </div>
  )
}

export default WebcamEmotionDetector
