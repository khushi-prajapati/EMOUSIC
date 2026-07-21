import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Pause, ScanFace, Square, Zap } from 'lucide-react'
import LoadingSpinner from '../LoadingSpinner'
import Button from '../ui/Button'
import Surface from '../ui/Surface'

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
      <Surface className="overflow-hidden border-cyan-300/20 bg-slate-950/70">
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
                <Camera className="mx-auto mb-4 text-cyan-200" size={42} />
                <p className="text-lg font-bold text-white">Camera preview</p>
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
            <>
              <div className="absolute inset-6 rounded-[2rem] border border-cyan-300/40 shadow-[0_0_45px_rgba(34,211,238,0.24)]" />
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 animate-pulse bg-cyan-300/50 shadow-[0_0_24px_rgba(34,211,238,0.8)]" />
              <div className="absolute left-4 top-4 rounded-full border border-cyan-300/30 bg-slate-950/80 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
              {statusLabel}
              </div>
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </Surface>

      <Surface as="aside" className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
          AI mood scan
        </p>
        <h2 className="mt-3 text-2xl font-black text-white">
          Real-time emotion intelligence
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">
          {cameraState === 'ready' ? (
            <Button
              type="button"
              onClick={stopCamera}
              variant="secondary"
            >
              <Square size={16} />
              Close camera
            </Button>
          ) : (
            <Button
              type="button"
              onClick={startCamera}
              disabled={cameraState === 'starting'}
            >
              <Camera size={16} />
              {cameraState === 'starting' ? 'Opening...' : 'Open camera'}
            </Button>
          )}
          <Button
            type="button"
            onClick={runDetection}
            disabled={!canScan}
            variant="secondary"
          >
            <ScanFace size={16} />
            Scan now
          </Button>
          <Button
            type="button"
            onClick={() => setIsAutoScanning((current) => !current)}
            disabled={cameraState !== 'ready'}
            variant="ghost"
          >
            <Pause size={16} />
            {isAutoScanning ? 'Pause live scan' : 'Resume live scan'}
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
            <p className="text-slate-400">Interval</p>
            <p className="mt-1 font-bold text-white">
              {Math.round(scanIntervalMs / 1000)}s
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
            <p className="text-slate-400">Scans</p>
            <p className="mt-1 font-bold text-white">{scanCount}</p>
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        )}

        {lastDetection && (
          <div className="mt-5 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4">
            <p className="inline-flex items-center gap-2 text-sm text-cyan-100"><Zap size={15} /> Detected emotion</p>
            <p className="mt-1 text-3xl font-black capitalize text-white">
              {lastDetection.emotion}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-400">Confidence</dt>
                <dd className="font-bold text-white">
                  {Math.round(Number(lastDetection.confidence) * 100)}%
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Music mood</dt>
                <dd className="font-bold capitalize text-white">
                  {lastDetection.mapped_mood}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Surface>
    </div>
  )
}

export default WebcamEmotionDetector
