import {
    AgoraVideoPlayer,
    createClient,
    createMicrophoneAndCameraTracks,
    ClientConfig,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
  } from "agora-rtc-react";
const appid="9e4b87cc837448969b97b4301e2aca92";
export const config ={ mode:"rtc",codec:"vp8",appid:appid}
export const useClient=createClient(config);
export const useMicrophoneAndCameraTracks=createMicrophoneAndCameraTracks();