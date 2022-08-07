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
const appid="YOUR AGORA APP ID";
export const config ={ mode:"rtc",codec:"vp8",appid:appid}
export const useClient=createClient(config);

export const useChannel=createChannel('test');
export const useMicrophoneAndCameraTracks=createMicrophoneAndCameraTracks();