'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { usePomodoroSync } from '@/hooks/usePomodoroSync';
import { getRoomTheme } from '@/app/rooms/page';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  ScreenShare,
  Users,
  Play,
  Coffee,
  Sparkles,
  Camera,
  Copy,
  Check,
  ArrowLeft,
  MessageSquare,
  PenTool,
  Hand,
  PhoneOff,
  Send,
  Trash2,
  Maximize2
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  hasVideo: boolean;
  hasAudio: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  avatar: string;
}

interface RaisedHand {
  id: string;
  studentName: string;
  topic: string;
  time: string;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

export default function VideoStudyRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const supabase = createClient();

  // Active Live Synchronized Pomodoro Timer
  const {
    timeLeft,
    pomodoroState,
    startFocusSprint,
    startBreak,
    isCompleted,
    claimReward
  } = usePomodoroSync(roomId);

  // Media Streams & Hardware Controls
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // WebRTC Peer Connections & Remote Streams Map
  const peerConnections = useRef<{ [peerId: string]: RTCPeerConnection }>({});
  const [remoteStreams, setRemoteStreams] = useState<{ [peerId: string]: MediaStream }>({});

  // Super Sidebar State: 'none' | 'chat' | 'whiteboard' | 'hands'
  const [activeSidebar, setActiveSidebar] = useState<'chat' | 'whiteboard' | 'hands' | 'none'>('chat');

  // Participants & Identity
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [userName, setUserName] = useState('LPU Student');
  const [userAvatar, setUserAvatar] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const channelRef = useRef<any>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#f97316');
  const [penWidth, setPenWidth] = useState(3);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  // Raised Hands State
  const [raisedHands, setRaisedHands] = useState<RaisedHand[]>([]);
  const [myHandRaised, setMyHandRaised] = useState(false);

  // Helper to create & wire WebRTC Peer Connection
  const createPeerConnection = useCallback((peerId: string, currentId: string, channel: any) => {
    if (peerConnections.current[peerId]) {
      return peerConnections.current[peerId];
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current[peerId] = pc;

    // Add local tracks if available
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        try {
          pc.addTrack(track, localStreamRef.current!);
        } catch (e) {
          console.warn('Track already added or failed', e);
        }
      });
    }

    // ICE Candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate && channel) {
        channel.send({
          type: 'broadcast',
          event: 'webrtc_ice',
          payload: {
            senderId: currentId,
            targetId: peerId,
            candidate: event.candidate,
          },
        });
      }
    };

    // Remote Track Handler (When incoming video/audio arrives from other device)
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        const incomingStream = event.streams[0];
        setRemoteStreams((prev) => ({
          ...prev,
          [peerId]: incomingStream,
        }));
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        delete peerConnections.current[peerId];
        setRemoteStreams((prev) => {
          const updated = { ...prev };
          delete updated[peerId];
          return updated;
        });
      }
    };

    return pc;
  }, []);

  // 1. Initialize Camera & Mic
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      setIsVideoOn(true);
      setIsMicOn(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add newly acquired tracks to all existing peer connections
      Object.values(peerConnections.current).forEach((pc) => {
        stream.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, stream);
          } catch (e) {
            console.warn('Track add error', e);
          }
        });
      });
    } catch (err) {
      console.warn('Camera/Mic permission denied or not found:', err);
    }
  };

  useEffect(() => {
    startMedia();
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      Object.values(peerConnections.current).forEach((pc) => pc.close());
    };
  }, []);

  // 2. Realtime Multi-User Presence & Broadcast Channel with WebRTC Signaling
  useEffect(() => {
    let activeChannel: any;

    async function initPresence() {
      const { data: { user } } = await supabase.auth.getUser();
      const tabUniqueId = `user_${Math.random().toString(36).substring(2, 9)}`;
      const currentId = user ? `${user.id}_${tabUniqueId.substring(0, 4)}` : tabUniqueId;
      setCurrentSessionId(currentId);

      let displayName = user ? 'LPU Student' : `Student #${tabUniqueId.substring(5)}`;
      let displayAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${currentId}`;

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        if (profile) {
          displayName = profile.full_name;
          displayAvatar = profile.avatar_url || displayAvatar;
        }
      }
      setUserName(displayName);
      setUserAvatar(displayAvatar);

      activeChannel = supabase.channel(`room_sync:${roomId}`, {
        config: { presence: { key: currentId } },
      });

      // PRESENCE SYNC & Auto-Connect WebRTC Peers
      activeChannel.on('presence', { event: 'sync' }, async () => {
        const state = activeChannel.presenceState();
        const list: Participant[] = [];

        for (const key in state) {
          const entry: any = state[key][0];
          if (entry) {
            list.push({
              id: key,
              name: entry.name || 'Student',
              avatar: entry.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${key}`,
              hasVideo: entry.hasVideo ?? true,
              hasAudio: entry.hasAudio ?? true,
            });

            // If a peer is found and we haven't connected yet, the newer peer initiates offer
            if (key !== currentId && !peerConnections.current[key]) {
              const pc = createPeerConnection(key, currentId, activeChannel);

              // If our currentId is lexicographically greater, initiate the offer to avoid collision
              if (currentId > key) {
                try {
                  const offer = await pc.createOffer();
                  await pc.setLocalDescription(offer);
                  activeChannel.send({
                    type: 'broadcast',
                    event: 'webrtc_offer',
                    payload: {
                      senderId: currentId,
                      targetId: key,
                      sdp: offer,
                    },
                  });
                } catch (err) {
                  console.warn('Error creating WebRTC offer:', err);
                }
              }
            }
          }
        }
        setParticipants(list);
      });

      // WEBRTC SIGNALING: Handle Incoming Offer
      activeChannel.on('broadcast', { event: 'webrtc_offer' }, async ({ payload }: any) => {
        if (payload.targetId !== currentId) return;
        try {
          const pc = createPeerConnection(payload.senderId, currentId, activeChannel);
          await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          activeChannel.send({
            type: 'broadcast',
            event: 'webrtc_answer',
            payload: {
              senderId: currentId,
              targetId: payload.senderId,
              sdp: answer,
            },
          });
        } catch (err) {
          console.warn('Error handling WebRTC offer:', err);
        }
      });

      // WEBRTC SIGNALING: Handle Incoming Answer
      activeChannel.on('broadcast', { event: 'webrtc_answer' }, async ({ payload }: any) => {
        if (payload.targetId !== currentId) return;
        try {
          const pc = peerConnections.current[payload.senderId];
          if (pc && pc.signalingState !== 'stable') {
            await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
          }
        } catch (err) {
          console.warn('Error handling WebRTC answer:', err);
        }
      });

      // WEBRTC SIGNALING: Handle ICE Candidate
      activeChannel.on('broadcast', { event: 'webrtc_ice' }, async ({ payload }: any) => {
        if (payload.targetId !== currentId) return;
        try {
          const pc = peerConnections.current[payload.senderId];
          if (pc && payload.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
          }
        } catch (err) {
          console.warn('Error adding ICE candidate:', err);
        }
      });

      // Chat Messages
      activeChannel.on('broadcast', { event: 'chat_msg' }, ({ payload }: any) => {
        setMessages((prev) => [...prev, payload]);
      });

      // Raised Hands
      activeChannel.on('broadcast', { event: 'hand_raise' }, ({ payload }: any) => {
        setRaisedHands((prev) => [payload, ...prev]);
      });
      activeChannel.on('broadcast', { event: 'hand_lower' }, ({ payload }: any) => {
        setRaisedHands((prev) => prev.filter((h) => h.id !== payload.id));
      });

      // Whiteboard Sync
      activeChannel.on('broadcast', { event: 'wb_draw' }, ({ payload }: any) => {
        drawOnCanvas(payload.x0, payload.y0, payload.x1, payload.y1, payload.color, payload.width);
      });
      activeChannel.on('broadcast', { event: 'wb_clear' }, () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      });

      activeChannel.subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await activeChannel.track({
            name: displayName,
            hasVideo: true,
            hasAudio: true,
            avatar: displayAvatar,
          });
        }
      });

      channelRef.current = activeChannel;
    }

    initPresence();

    return () => {
      if (activeChannel) {
        supabase.removeChannel(activeChannel);
      }
    };
  }, [roomId, createPeerConnection]);

  // Whiteboard drawing helper
  const drawOnCanvas = (x0: number, y0: number, x1: number, y1: number, color: string, width: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  // Toggle Mic Mute
  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  // Toggle Camera
  const toggleCamera = async () => {
    if (!localStreamRef.current) {
      await startMedia();
      return;
    }

    const videoTracks = localStreamRef.current.getVideoTracks();
    if (videoTracks.length > 0) {
      videoTracks.forEach((track) => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    } else {
      await startMedia();
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await startMedia();
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setLocalStream(screenStream);
        localStreamRef.current = screenStream;
        setIsScreenSharing(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        // Replace video track on all peer connections
        const screenTrack = screenStream.getVideoTracks()[0];
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        screenTrack.onended = () => {
          startMedia();
          setIsScreenSharing(false);
        };
      } catch (err) {
        console.warn('Screen share canceled or denied', err);
      }
    }
  };

  // Chat Send Action
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgPayload: ChatMessage = {
      id: Math.random().toString(),
      sender: userName,
      text: newMessage.trim(),
      avatar: userAvatar,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, msgPayload]);
    channelRef.current?.send({
      type: 'broadcast',
      event: 'chat_msg',
      payload: msgPayload,
    });
    setNewMessage('');
  };

  // Whiteboard Canvas Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    lastPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    drawOnCanvas(lastPoint.current.x, lastPoint.current.y, currentPoint.x, currentPoint.y, penColor, penWidth);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'wb_draw',
      payload: {
        x0: lastPoint.current.x,
        y0: lastPoint.current.y,
        x1: currentPoint.x,
        y1: currentPoint.y,
        color: penColor,
        width: penWidth,
      },
    });

    lastPoint.current = currentPoint;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPoint.current = null;
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      channelRef.current?.send({
        type: 'broadcast',
        event: 'wb_clear',
      });
    }
  };

  // Raise Hand
  const toggleRaiseHand = () => {
    if (myHandRaised) {
      const myHand = raisedHands.find((h) => h.studentName === userName);
      if (myHand) {
        setRaisedHands((prev) => prev.filter((h) => h.id !== myHand.id));
        channelRef.current?.send({
          type: 'broadcast',
          event: 'hand_lower',
          payload: { id: myHand.id },
        });
      }
      setMyHandRaised(false);
    } else {
      const newHand: RaisedHand = {
        id: Math.random().toString(),
        studentName: userName,
        topic: 'Question regarding current sprint problem',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setRaisedHands((prev) => [newHand, ...prev]);
      channelRef.current?.send({
        type: 'broadcast',
        event: 'hand_raise',
        payload: newHand,
      });
      setMyHandRaised(true);
    }
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const theme = getRoomTheme(roomId);
  const themeWatermark = theme?.watermarkPattern;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-[calc(100vh-4.5rem)] flex flex-col bg-[#04060a] text-white relative overflow-hidden select-none">
      
      {/* Background Subject Watermark */}
      {themeWatermark && (
        <div
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: themeWatermark }}
        />
      )}

      {/* Top Header Bar */}
      <div className="relative z-20 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Room Badge & Back */}
        <div className="flex items-center gap-3">
          <Link
            href="/rooms"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white uppercase font-mono">
                #{roomId}
              </h1>
              {theme?.badgeText && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
                  {theme.badgeText}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-2">
              <span>{participants.length} Peer{participants.length === 1 ? '' : 's'} in Room</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live WebRTC Mesh Active
              </span>
            </p>
          </div>
        </div>

        {/* Center: Synchronized Pomodoro Timer */}
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-1.5 rounded-2xl shadow-inner">
          <div className="text-center">
            <div className="text-xl font-mono font-black text-amber-400 tracking-wider">
              {formatTime(timeLeft)}
            </div>
            <div className="text-[9px] uppercase font-mono text-zinc-400 -mt-1 font-bold">
              {pomodoroState === 'FOCUS' ? '⚡ Focus Sprint' : pomodoroState === 'BREAK' ? '☕ Rest Break' : 'Idle'}
            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
            {pomodoroState !== 'FOCUS' && (
              <button
                onClick={startFocusSprint}
                className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition"
                title="Start 25m Focus Sprint"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
            )}
            {pomodoroState !== 'BREAK' && (
              <button
                onClick={startBreak}
                className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition"
                title="Start 5m Break"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Media Controls & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isMicOn
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                : 'bg-red-500/20 border-red-500/40 text-red-400'
            }`}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isVideoOn
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                : 'bg-red-500/20 border-red-500/40 text-red-400'
            }`}
            title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isVideoOn ? <VideoIcon className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-2.5 rounded-xl border text-xs font-bold transition hidden sm:flex items-center gap-1.5 ${
              isScreenSharing
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
            }`}
            title="Share Screen"
          >
            <ScreenShare className="w-4 h-4" />
          </button>

          <button
            onClick={toggleRaiseHand}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              myHandRaised
                ? 'bg-amber-500 border-amber-400 text-slate-950 font-black animate-bounce'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
            }`}
            title="Raise Hand to Ask Doubt"
          >
            <Hand className="w-4 h-4" />
          </button>

          <button
            onClick={copyRoomLink}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              copiedLink
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-white/[0.04] border-white/10 text-zinc-200 hover:bg-white/10'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Invite'}</span>
          </button>

          <Link
            href="/rooms"
            className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition"
            title="Leave Room"
          >
            <PhoneOff className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Body: Video Tiles Grid + Super Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Area: Dynamic Video Grid */}
        <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto bg-[#04060a]">
          
          {/* Local User Tile (Your Camera / Screen) */}
          <div className="relative rounded-3xl bg-zinc-900/60 border border-white/10 overflow-hidden flex items-center justify-center min-h-[260px] shadow-2xl group">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${!isVideoOn && !isScreenSharing ? 'hidden' : ''}`}
            />
            {!isVideoOn && !isScreenSharing && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-orange-600/30">
                  {userName.charAt(0)}
                </div>
                <button
                  onClick={startMedia}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold border border-white/10 transition"
                >
                  <Camera className="w-3.5 h-3.5 text-orange-400" />
                  Turn On Camera
                </button>
              </div>
            )}

            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/10">
              <span>{userName} (You)</span>
              {!isMicOn && <MicOff className="w-3.5 h-3.5 text-red-400" />}
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md text-amber-300 text-[11px] font-black px-3 py-1 rounded-full border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              +5 🪙 on sprint
            </div>
          </div>

          {/* Remote Connected Peers (Real WebRTC Live Camera Stream) */}
          {participants.filter((p) => p.id !== currentSessionId).map((p) => {
            const hasRemoteVideo = !!remoteStreams[p.id];

            return (
              <div
                key={p.id}
                className="relative rounded-3xl bg-zinc-900/40 border border-white/10 overflow-hidden flex items-center justify-center min-h-[260px] shadow-2xl animate-in fade-in zoom-in-95 duration-300"
              >
                {/* Live Remote Video Stream */}
                <video
                  ref={(el) => {
                    if (el && remoteStreams[p.id]) {
                      el.srcObject = remoteStreams[p.id];
                    }
                  }}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover ${!hasRemoteVideo ? 'hidden' : ''}`}
                />

                {/* Fallback Avatar when camera is connecting or off */}
                {!hasRemoteVideo && (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-orange-500/30 shadow-lg"
                    />
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-xs text-emerald-400 flex items-center justify-center gap-1.5 mt-0.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Studying on Call
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">
                  <span>{p.name}</span>
                  {hasRemoteVideo && <span className="w-2 h-2 rounded-full bg-emerald-400" title="Live Video" />}
                </div>
              </div>
            );
          })}

        </div>

        {/* Right Super Sidebar */}
        {activeSidebar !== 'none' && (
          <div className="w-80 sm:w-96 border-l border-white/10 bg-[#07090e] flex flex-col h-full shrink-0">
            
            {/* Sidebar Tab Selector */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between gap-1 bg-white/[0.02]">
              <button
                onClick={() => setActiveSidebar('chat')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeSidebar === 'chat'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat ({messages.length})
              </button>

              <button
                onClick={() => setActiveSidebar('whiteboard')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeSidebar === 'whiteboard'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                Whiteboard
              </button>

              <button
                onClick={() => setActiveSidebar('hands')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeSidebar === 'hands'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                Hands ({raisedHands.length})
              </button>
            </div>

            {/* TAB 1: LIVE CHAT */}
            {activeSidebar === 'chat' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center py-12 text-zinc-500 text-xs space-y-1">
                      <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto" />
                      <p className="font-semibold text-zinc-400">Room Chat</p>
                      <p>Send messages, paste code snippets, or share notes with studiers.</p>
                    </div>
                  )}

                  {messages.map((m) => (
                    <div key={m.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="font-bold text-zinc-300">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-xs text-zinc-200 break-words">
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-zinc-950/60 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type study message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-500 transition shadow-md shadow-orange-600/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: COLLABORATIVE WHITEBOARD */}
            {activeSidebar === 'whiteboard' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {['#f97316', '#10b981', '#3b82f6', '#ec4899', '#ffffff'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setPenColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          penColor === c ? 'scale-125 border-white' : 'border-transparent opacity-60'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={clearWhiteboard}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs font-bold border border-white/10 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>

                <div className="flex-1 rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden relative">
                  <canvas
                    ref={canvasRef}
                    width={340}
                    height={460}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className="w-full h-full cursor-crosshair touch-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: RAISED HANDS QUEUE */}
            {activeSidebar === 'hands' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {raisedHands.length === 0 && (
                  <div className="text-center py-12 text-zinc-500 text-xs space-y-1">
                    <Hand className="w-8 h-8 text-zinc-700 mx-auto" />
                    <p className="font-semibold text-zinc-400">No Raised Hands</p>
                    <p>Click the Hand icon in the header to ask a doubt politely without interrupting.</p>
                  </div>
                )}

                {raisedHands.map((h) => (
                  <div key={h.id} className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Hand className="w-3.5 h-3.5 animate-bounce" />
                        {h.studentName}
                      </span>
                      <span className="text-[10px] text-zinc-400">{h.time}</span>
                    </div>
                    <p className="text-zinc-200 text-[11px]">{h.topic}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
