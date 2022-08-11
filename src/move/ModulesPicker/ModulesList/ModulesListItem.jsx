import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { IonItem, IonThumbnail, IonLabel } from "@ionic/react";

import { selectModuleById } from "../../slice";

const ModulesListItem = function ({ id }) {
  const { url } = useRouteMatch();

  const { name, difficulty, playlists } = useSelector((state) =>
    selectModuleById(state, id)
  );

  return (
    <IonItem lines="none" routerLink={`${url}/${id}`}>
      <IonThumbnail slot="start">
        <img
          src={`https://avatars.dicebear.com/api/identicon/${id}.svg`}
          alt={`Thumbnail for module ${name}`}
        />
      </IonThumbnail>

      <IonLabel>
        <h2>{name}</h2>
        <p>
          Difficulty: {difficulty} - Playlists: {playlists.length}
        </p>
      </IonLabel>
    </IonItem>
  );
};

export default ModulesListItem;
