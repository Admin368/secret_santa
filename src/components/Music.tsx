import React, { useRef, useState } from "react";
import { Button } from "antd/lib";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import YouTube from "react-youtube";
import { useRecoilValue } from "recoil";
import { stateColor } from "~/states";

export const MusicButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef<YouTube>(null);
  const handleButtonClick = () => {
    setIsPlaying(!isPlaying);
  };
  const [isReady, setIsReady] = useState(false);
  const color = useRecoilValue(stateColor);
  const video_id = "sSBUL1INwYw";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        zIndex: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isReady ? (
        <Button
          //   type="primary"
          shape="circle"
          size="large"
          onClick={handleButtonClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isPlaying ? "transparent" : color,
            border: "0px solid white",
          }}
        >
          {isPlaying ? (
            <PauseCircleOutlined style={{ color: "white" }} />
          ) : (
            <PlayCircleOutlined style={{ color: "white" }} />
          )}
        </Button>
      ) : null}
      <YouTube
        videoId={video_id}
        opts={{
          height: "0",
          width: "0",
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            mute: 1,
            modestbranding: 1,
            showinfo: 0,
          },
        }}
        ref={player}
        onReady={() => {
          console.log("Is Ready");
          setIsReady(true);
        }}
        onError={() => {
          setIsReady(false);
        }}
      />
      {isPlaying ? (
        <YouTube
          videoId={video_id}
          opts={{
            height: "0",
            width: "0",
            playerVars: {
              autoplay: 1,
              controls: 0,
              loop: 1,
              mute: !isPlaying,
              modestbranding: 1,
              showinfo: 0,
            },
          }}
        />
      ) : null}
    </div>
  );
};

export default MusicButton;
