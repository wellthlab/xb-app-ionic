import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonRow,
  IonGrid,
  IonCol,
  IonIcon,
} from "@ionic/react";

import { addCircleOutline, alert, removeCircleOutline } from "ionicons/icons";
import "./SetCounter.css";

/**
 * Show a video
 * Immediately fires onSubmit to provide a video response; so only suitable for use in the timer
 * video should be a youtube ID
 */
const Video = ({video, onSubmit}) => {

  const [subbed, setSubbed] = useState(false);

  useEffect(() => {
    if (!subbed && onSubmit) {
      setSubbed(true);
      onSubmit({video: video});
    }
  });

  var src = "https://www.youtube-nocookie.com/embed/" + video + "?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0"

  return (
    <div>
      <iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" style={{width: "100%", height: "300px"}} type="text/html"
      src={src}></iframe>
    </div>
  );


};

export default Video;
