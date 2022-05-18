import {
  IonCard,
  IonItem,
  IonList,
  IonItemGroup,
  IonText,
  IonLabel,
  IonCol,
  IonRow,
} from "@ionic/react";

function PlaylistList({ module, toggleListView }) {
  const playlists = module.playlists;
  const isSnack = module.topic.includes("snack/");
  const playlistItems = playlists.map((playlist, index) => {
    const week = Math.floor(index / 5) + 1;
    const day = index + 1 - (week - 1) * 5;

    return (
      <>
        {!isSnack && day === 1 ? (
          <IonItem lines={"none"}>
            <IonLabel
              className={"ion-text-center"}
              style={{ fontSize: "1.2em" }}
            >
              <IonText>
                <strong>Week {week}</strong>
              </IonText>
            </IonLabel>
          </IonItem>
        ) : (
          ""
        )}
        <IonItem
          button
          key={index}
          detail={true}
          onClick={() => {
            toggleListView(index);
          }}
        >
          <IonLabel>
            <IonText className="ion-text-wrap">
              <strong>Day {day}</strong>: {playlist.desc}
            </IonText>
            <IonText style={{ fontSize: "0.7em" }}>
              <br />
              {playlist.minutes ? playlist.minutes : "N/A"} mins
            </IonText>
          </IonLabel>
        </IonItem>
      </>
    );
  });

  return (
    <IonCard>
      <IonItem
        lines="none"
        style={{ "--padding-top": "15px" }}
        className="task-padding"
      >
        <IonCol className="ion-text-center">
          <IonList>
            <IonItemGroup>{playlistItems}</IonItemGroup>
          </IonList>
        </IonCol>
      </IonItem>
    </IonCard>
  );
}

export default PlaylistList;
