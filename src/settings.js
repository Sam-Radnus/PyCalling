import {
    AgoraVideoPlayer,
    createClient,
    createMicrophoneAndCameraTracks,
    ClientConfig,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
  } from "agora-rtc-react";
import {
    createChannel,
  } from "agora-rtm-react";
const appid="9e4b87cc837448969b97b4301e2aca92";
export const config ={ mode:"rtc",codec:"vp8",appid:appid}
export const useClient=createClient(config);

export const useChannel=createChannel('test');
export const useMicrophoneAndCameraTracks=createMicrophoneAndCameraTracks();