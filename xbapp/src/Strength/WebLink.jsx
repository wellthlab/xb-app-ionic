import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonRow,
  IonGrid,
  IonCol,
  IonIcon,
  IonLabel,
  IonText,
  IonCard,
  IonCardContent,
} from "@ionic/react";

import { linkOutline } from "ionicons/icons";
import "./SetCounter.css";

/**
 * Show a video
 * Immediately fires onSubmit to provide a video response; so only suitable for use in the timer
 * video should be a youtube ID
 */
const Video = ({ link, info, onSubmit }) => {
  const [subbed, setSubbed] = useState(false);

  useEffect(() => {
    if (!subbed && onSubmit) {
      setSubbed(true);
      onSubmit({ link: link });
    }
  });

  return (
    <IonCard>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonText>
                <div>
                  <p style={{ textAlign: "center" }}>
                    View this content on the Web
                  </p>
                  <p style={{ fontWeight: "bold", textAlign: "center" }}>
                    <a href={link} target="_blank">
                      {info.desc} <IonIcon icon={linkOutline} />
                    </a>
                  </p>
                </div>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </IonCard>
  );
};

export default Video;
