import React, { useState, useEffect } from "react";
import { IonButton, IonItem, IonInput, IonIcon } from "@ionic/react";

import { addCircleOutline, removeCircleOutline } from "ionicons/icons";


/**
 * Count Sets
 */
const MovementTimer = ({ onChange, start }) => {
  const [sets, setSets] = useState(start ? start : 0);

  function save() {
    if (onChange) {
      onChange(sets);
    }
  }

  // TODO
  return (
			<>
				<span>{sets}</span>
				<div slot="end">
					<IonButton onClick={
						() => {
							setSets(sets + 1);
							save();
						}
					}><IonIcon icon={addCircleOutline} /></IonButton>
					<IonButton onClick={
						() => {
							setSets(sets - 1);
							save();
						}
					}><IonIcon icon={removeCircleOutline} /></IonButton>
				</div>
			</>
  );
};

export default MovementTimer;
