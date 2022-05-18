import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonRow,
  IonGrid,
  IonCol,
  IonIcon,
  IonText,
  IonCard,
} from "@ionic/react";

import { linkOutline } from "ionicons/icons";

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
                    <a href={link} target="_blank" rel="noreferrer">
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
