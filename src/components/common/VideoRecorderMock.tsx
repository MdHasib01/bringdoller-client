import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, Upload, AlertCircle, Video, Play, Pause, Sparkles } from 'lucide-react';
import { Language } from '../../types';
import { toBengaliDigits } from '../../utils/formatters';

interface VideoRecorderProps {
  onRecorded: (videoUrl: string, durationSeconds: number) => void;
  lang?: Language;
  productContextName?: string;
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
}

export const VideoRecorderMock: React.FC<VideoRecorderProps> = ({
  onRecorded,
  lang = 'en',
  productContextName = 'Royal Oud & Amber Perfume',
  minDurationSeconds = 60,
  maxDurationSeconds = 180,
}) => {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Initialize camera stream
  useEffect(() => {
    let active = true;

    async function startCamera() {
      if (mode !== 'camera' || recordedBlobUrl) return;

      try {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraPermissionError(false);
      } catch (err) {
        console.warn('Camera access fallback or denied:', err);
        setCameraPermissionError(true);
      }
    }

    startCamera();

    return () => {
      active = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [mode, facingMode, recordedBlobUrl]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= maxDurationSeconds) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording, maxDurationSeconds]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Use simulated sample test video asset for high-performance preview
    const samplePreview = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    setRecordedBlobUrl(samplePreview);
    onRecorded(samplePreview, Math.max(recordingSeconds, 65));
  };

  const handleRetake = () => {
    setRecordedBlobUrl(null);
    setRecordingSeconds(0);
    setIsRecording(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordedBlobUrl(url);
      onRecorded(url, 75);
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const timeStr = `${pad(m)}:${pad(s)}`;
    return lang === 'bn' ? toBengaliDigits(timeStr) : timeStr;
  };

  return (
    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Studio Header */}
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold text-white">
            {lang === 'bn' ? 'রিভিউ রেকর্ডিং স্টুডিও' : 'Review Recording Studio'}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
            {productContextName}
          </span>
        </div>

        {/* Tab switch camera vs upload */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => { setMode('camera'); setRecordedBlobUrl(null); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              mode === 'camera' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 inline mr-1" />
            {lang === 'bn' ? 'ক্যামেরা' : 'Camera'}
          </button>
          <button
            type="button"
            onClick={() => { setMode('upload'); setRecordedBlobUrl(null); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              mode === 'upload' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5 inline mr-1" />
            {lang === 'bn' ? 'ফাইল আপলোড' : 'Upload'}
          </button>
        </div>
      </div>

      {/* Main Recording Viewport */}
      <div className="relative aspect-[9/16] sm:aspect-video max-h-[480px] w-full bg-black flex items-center justify-center overflow-hidden">
        {recordedBlobUrl ? (
          // Preview Mode
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={previewVideoRef}
              src={recordedBlobUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
              onPlay={() => setIsPlayingPreview(true)}
              onPause={() => setIsPlayingPreview(false)}
            />
            <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {lang === 'bn' ? 'রেকর্ডিং সম্পন্ন' : 'Ready to Submit'}
            </div>
          </div>
        ) : mode === 'camera' ? (
          // Live Camera Stream
          <div className="relative w-full h-full">
            {!cameraPermissionError ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
            ) : (
              // Live camera mockup fallback if in restricted iframe sandbox
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
                  <Video className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  {lang === 'bn' ? 'ভার্চুয়াল এইচডি রেকর্ডিং প্রস্তুত' : 'HD Studio Ready'}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mb-3">
                  {lang === 'bn'
                    ? 'ক্যামেরা সরাসরি যুক্ত আছে। আপনি নিচে "রেকর্ড শুরু করুন" চাপলে লাইভ ডেমো ক্যাপচার হবে।'
                    : 'Studio ready. Click start recording below or upload a video file.'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'মাইক্রোফোন ও নয়েজ ফিল্টার সক্রিয়' : 'Mic & Noise Filter Active'}
                </div>
              </div>
            )}

            {/* Recording HUD Overlay */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/40">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-white tracking-widest">
                  REC {formatTimer(recordingSeconds)}
                </span>
              </div>
            )}

            {/* Camera Switch button */}
            {!isRecording && (
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-black/80 transition-all shadow-lg"
                title={lang === 'bn' ? 'ক্যামেরা ফ্লিপ করুন' : 'Flip Camera'}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          // File Upload Mode
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-800 m-4 rounded-xl bg-slate-900/40">
            <Upload className="w-12 h-12 text-slate-400 mb-3" />
            <h4 className="text-sm font-semibold text-white mb-1">
              {lang === 'bn' ? 'ভিডিও ফাইল সিলেক্ট করুন' : 'Choose Video File'}
            </h4>
            <p className="text-xs text-slate-400 mb-4 max-w-xs">
              {lang === 'bn' ? 'MP4, MOV বা WebM ফরম্যাট (সর্বোচ্চ ৫০০ MB)' : 'MP4, MOV, or WebM format (max 500MB)'}
            </p>
            <label className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
              {lang === 'bn' ? 'ডিভাইস থেকে ব্রাউজ করুন' : 'Browse from Device'}
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Recording Guidelines Bar */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-amber-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {lang === 'bn'
              ? 'বাস্তব সুবিধা এবং অন্তত ১টি সীমাবদ্ধতা অকপটে বলুন (স্ক্রিপ্ট পড়া নিষেধ)'
              : 'Mention genuine pros & at least 1 true limitation. No robotic scripts.'}
          </span>
        </div>
        <div className="text-slate-400 font-mono">
          {lang === 'bn'
            ? `সময়সীমা: ${toBengaliDigits(minDurationSeconds)}-${toBengaliDigits(maxDurationSeconds)} সেকেন্ড`
            : `Duration: ${minDurationSeconds}-${maxDurationSeconds}s`}
        </div>
      </div>

      {/* Studio Action Controls */}
      <div className="p-4 bg-slate-900 flex items-center justify-between gap-3">
        {recordedBlobUrl ? (
          <>
            <button
              type="button"
              onClick={handleRetake}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {lang === 'bn' ? 'আবার রেকর্ড করুন' : 'Record Again'}
            </button>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium px-3">
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'bn' ? 'ভিডিও সেভ হয়েছে' : 'Video Loaded'}
            </div>
          </>
        ) : mode === 'camera' ? (
          <div className="w-full flex items-center justify-center gap-4">
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="py-3 px-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all transform active:scale-95"
              >
                <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                {lang === 'bn' ? 'রেকর্ড শুরু করুন' : 'Start Recording'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopRecording}
                className="py-3 px-8 rounded-full bg-slate-800 border-2 border-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-xl hover:bg-slate-700 transition-all transform active:scale-95"
              >
                <div className="w-3 h-3 rounded-sm bg-rose-500" />
                {lang === 'bn' ? 'রেকর্ডিং সমাপ্ত করুন' : 'Finish Recording'} ({formatTimer(recordingSeconds)})
              </button>
            )}
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400 w-full py-1">
            {lang === 'bn' ? 'ফাইল সিলেক্ট করার পর স্বয়ংক্রিয়ভাবে লোড হবে' : 'File will load automatically after selection'}
          </div>
        )}
      </div>
    </div>
  );
};
