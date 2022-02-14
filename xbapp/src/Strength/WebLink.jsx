import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonRow,
  IonGrid,
  IonCol,
  IonIcon,
  IonLabel
} from "@ionic/react";

import { linkOutline } from "ionicons/icons";
import "./SetCounter.css";

/**
 * Show a video
 * Immediately fires onSubmit to provide a video response; so only suitable for use in the timer
 * video should be a youtube ID
 */
const Video = ({link, info, onSubmit}) => {

  const [subbed, setSubbed] = useState(false);

  useEffect(() => {
    if (!subbed && onSubmit) {
      setSubbed(true);
      onSubmit({link: link});
    }
  });

  return (
        <div>
          <p>View this content on the Web</p>
          <p style={{fontWeight: "bold", textAlign: "center"}}><a href={link} target="_blank">{info.desc} <IonIcon icon={linkOutline} /></a></p>
        </div>
  );


};

export default Video;
