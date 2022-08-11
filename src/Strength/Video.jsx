import { IonCard, IonText, IonCardContent } from "@ionic/react";
import React, { useState, useEffect } from "react";

/**
 * Show a video
 * Immediately fires onSubmit to provide a video response; so only suitable for use in the timer
 * video should be a youtube ID
 */
const Video = ({ videoKey, video, onSubmit }) => {
  const [subbed, setSubbed] = useState(false);

  useEffect(() => {
    if (!subbed && onSubmit) {
      setSubbed(true);
      onSubmit({ video: video });
    }
  });

  if (!video) {
    return (
      <IonCard>
        <br />
        <div className="ion-text-center">
          <img src={"assets/strength_logo.png"} alt="Error" />
        </div>
        <IonCardContent>
          <IonText className="ion-text-center">
            <h1>No video could be found</h1>
          </IonText>
        </IonCardContent>
      </IonCard>
    );
  }

  var src =
    "https://www.youtube-nocookie.com/embed/" +
    video.trim() +
    "?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0";

  return (
    <div>
      <iframe
        key={videoKey}
        title="playlist-videoplayer"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        style={{ width: "100%", height: "300px" }}
        type="text/html"
        src={src}
      ></iframe>
    </div>
  );
};

export default Video;
