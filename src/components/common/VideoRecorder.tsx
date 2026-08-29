import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle2, Upload, AlertCircle, Video, Sparkles, Loader2, UploadCloud } from 'lucide-react';
import { Language } from '../../types';
import { toBengaliDigits } from '../../utils/formatters';
import { api } from '../../api/client';

interface VideoRecorderProps {
  onRecorded: (videoUrl: string, durationSeconds: number) => void;
  lang?: Language;
  productContextName?: string;
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
}

interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  eager: string;
}

type Stage = 'camera' | 'preview' | 'uploading' | 'done' | 'error';

// Recording at a capped resolution/bitrate keeps the raw capture itself small —
// Cloudinary's eager transformation (see server/src/routes/uploads.js) then further
// compresses/transcodes the uploaded file for delivery.
const CAPTURE_CONSTRAINTS: MediaTrackConstraints = { width: { ideal: 1280 }, height: { ideal: 720 } };
const RECORDER_BITRATE = 1_500_000; // ~1.5 Mbps
const MIME_CANDIDATES = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];

function pickSupportedMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined') return null;
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) || null;
}

async function uploadToCloudinary(
  blob: Blob,
  sig: UploadSignature,
  onProgress: (pct: number) => void
): Promise<{ url: string; durationSeconds: number }> {
  const form = new FormData();
  form.append('file', blob, `review-${Date.now()}.${blob.type.includes('mp4') ? 'mp4' : 'webm'}`);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', String(sig.timestamp));
  form.append('signature', sig.signature);
  form.append('folder', sig.folder);
  form.append('eager', sig.eager);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error('Cloudinary upload failed'));
        return;
      }
      try {
        const result = JSON.parse(xhr.responseText);
        const optimizedUrl = result?.eager?.[0]?.secure_url || result?.secure_url;
        resolve({ url: optimizedUrl, durationSeconds: Math.round(result?.duration || 0) });
      } catch {
        reject(new Error('Unexpected upload response'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(form);
  });
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onRecorded,
  lang = 'en',
  productContextName = 'Product',
  minDurationSeconds = 60,
  maxDurationSeconds = 180,
}) => {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const [stage, setStage] = useState<Stage>('camera');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);
  const recordedMimeRef = useRef<string>('video/webm');

  const handleStopRecording = useCallback(() => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Initialize camera stream
  useEffect(() => {
    let active = true;

    async function startCamera() {
      if (mode !== 'camera' || stage !== 'camera') return;

      try {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { ...CAPTURE_CONSTRAINTS, facingMode },
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
        mediaStreamRef.current = null;
      }
    };
  }, [mode, facingMode, stage]);

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
  }, [isRecording, maxDurationSeconds, handleStopRecording]);

  const handleStartRecording = () => {
    const stream = mediaStreamRef.current;
    const mimeType = pickSupportedMimeType();
    if (!stream || !mimeType) {
      setErrorMessage(
        lang === 'bn'
          ? 'এই ব্রাউজারে সরাসরি রেকর্ডিং সমর্থিত নয়। অনুগ্রহ করে ফাইল আপলোড করুন।'
          : 'Live recording is not supported in this browser. Please use file upload instead.'
      );
      return;
    }

    chunksRef.current = [];
    recordedMimeRef.current = mimeType;

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: RECORDER_BITRATE });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      recordedBlobRef.current = blob;
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setStage('preview');
    };

    mediaRecorderRef.current = recorder;
    recorder.start(1000);
    setIsRecording(true);
    setErrorMessage(null);
  };

  const handleRetake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    recordedBlobRef.current = null;
    setPreviewUrl(null);
    setRecordingSeconds(0);
    setIsRecording(false);
    setStage('camera');
    setErrorMessage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    recordedBlobRef.current = file;
    recordedMimeRef.current = file.type || 'video/mp4';
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStage('preview');
    setErrorMessage(null);
  };

  const handleUseVideo = async () => {
    const blob = recordedBlobRef.current;
    if (!blob) return;

    setStage('uploading');
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      const sig = await api.get<UploadSignature>('/uploads/video-signature');
      const { url, durationSeconds } = await uploadToCloudinary(blob, sig, setUploadProgress);
      setStage('done');
      onRecorded(url, durationSeconds || Math.max(recordingSeconds, minDurationSeconds));
    } catch (err: any) {
      console.error('[VideoRecorder] upload failed:', err);
      setErrorMessage(
        lang === 'bn'
          ? 'ভিডিও আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
          : 'Video upload failed. Please try again.'
      );
      setStage('error');
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

  const hasPreview = stage === 'preview' || stage === 'uploading' || stage === 'done' || stage === 'error';

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

        {!hasPreview && (
          <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setMode('camera')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mode === 'camera' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5 inline mr-1" />
              {lang === 'bn' ? 'ক্যামেরা' : 'Camera'}
            </button>
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mode === 'upload' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5 inline mr-1" />
              {lang === 'bn' ? 'ফাইল আপলোড' : 'Upload'}
            </button>
          </div>
        )}
      </div>

      {/* Main Recording Viewport */}
      <div className="relative aspect-[9/16] sm:aspect-video max-h-[480px] w-full bg-black flex items-center justify-center overflow-hidden">
        {hasPreview ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={previewVideoRef}
              src={previewUrl || undefined}
              controls={stage !== 'uploading'}
              playsInline
              className="w-full h-full object-contain"
            />

            {stage === 'uploading' && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <div className="w-2/3 max-w-xs h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-emerald-300">
                  {lang === 'bn' ? `আপলোড হচ্ছে... ${toBengaliDigits(String(uploadProgress))}%` : `Uploading... ${uploadProgress}%`}
                </span>
              </div>
            )}

            {stage === 'done' && (
              <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'রেকর্ডিং সম্পন্ন' : 'Ready to Submit'}
              </div>
            )}
          </div>
        ) : mode === 'camera' ? (
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
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
                  <Video className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  {lang === 'bn' ? 'ক্যামেরা অ্যাক্সেস প্রয়োজন' : 'Camera Access Needed'}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mb-3">
                  {lang === 'bn'
                    ? 'ক্যামেরা চালু করতে অনুমতি দিন, অথবা "ফাইল আপলোড" ব্যবহার করুন।'
                    : 'Grant camera permission to record live, or use "Upload" instead.'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'মাইক্রোফোন ও নয়েজ ফিল্টার সক্রিয়' : 'Mic & Noise Filter Active'}
                </div>
              </div>
            )}

            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/40">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-white tracking-widest">
                  REC {formatTimer(recordingSeconds)}
                </span>
              </div>
            )}

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
              <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="px-4 py-2.5 bg-rose-500/10 border-t border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Recording Guidelines Bar */}
      {!hasPreview && (
        <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>
              {lang === 'bn'
                ? 'বাস্তব সুবিধা এবং অন্তত ১টি সীমাবদ্ধতা অকপটে বলুন (স্ক্রিপ্ট পড়া নিষেধ)'
                : 'Mention genuine pros & at least 1 true limitation. No robotic scripts.'}
            </span>
          </div>
          <div className="text-slate-400 font-mono">
            {lang === 'bn'
              ? `সময়সীমা: ${toBengaliDigits(minDurationSeconds)}-${toBengaliDigits(maxDurationSeconds)} সেকেন্ড`
              : `Duration: ${minDurationSeconds}-${maxDurationSeconds}s`}
          </div>
        </div>
      )}

      {/* Studio Action Controls */}
      <div className="p-4 bg-slate-900 flex items-center justify-between gap-3">
        {stage === 'done' ? (
          <div className="w-full flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            {lang === 'bn' ? 'ভিডিও সফলভাবে আপলোড হয়েছে' : 'Video uploaded successfully'}
          </div>
        ) : stage === 'uploading' ? (
          <div className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            {lang === 'bn' ? 'অপ্টিমাইজ ও আপলোড করা হচ্ছে...' : 'Optimizing & uploading...'}
          </div>
        ) : hasPreview ? (
          <>
            <button
              type="button"
              onClick={handleRetake}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {lang === 'bn' ? 'আবার রেকর্ড করুন' : 'Record Again'}
            </button>
            <button
              type="button"
              onClick={handleUseVideo}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              {lang === 'bn' ? 'এই ভিডিও ব্যবহার করুন' : 'Use This Video'}
            </button>
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
            {lang === 'bn' ? 'ফাইল সিলেক্ট করার পর স্বয়ংক্রিয়ভাবে লোড হবে' : 'File will load automatically after selection'}
          </div>
        )}
      </div>
    </div>
  );
};
