import { IonCard, IonCardContent, IonImg } from "@ionic/react";
import { useState } from "react";

function Image({ imgSrc }) {
  const [src, setSrc] = useState(imgSrc);
  const [errorMsg, setErrorMsg] = useState(undefined);
  return (
    <IonCard>
      <br />
      <div className="ion-text-center">
        <img
          src={src}
          onError={() => {
            setErrorMsg("No image could be found");
            setSrc("assets/strength_logo.png");
          }}
          alt="Task"
        />
      </div>
      <IonCardContent className="ion-text-center">
        <h1>{errorMsg}</h1>
      </IonCardContent>
    </IonCard>
  );
}

export default Image;
