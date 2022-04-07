import { useState } from "react";
import {
  IonCol,
  IonGrid,
  IonRow,
  IonItemGroup,
  IonItem,
  IonLabel,
} from "@ionic/react";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

import "../PlaylistSubscriber.css";

function ModuleDisplay({ subTopic, colour, items }) {
  // const [expanded, setExpanded] = useState(false);
  // return (
  //   <IonGrid className="ion-no-padding">
  //     <IonRow>
  //       <IonCol>
  //         <Accordion
  //           expanded={expanded}
  //           className="AccordionModuleTitle"
  //           style={{ "background-color": colour }}
  //           onChange={() => {
  //             setExpanded(!expanded);
  //           }}
  //         >
  //           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
  //             <IonCol className="ion-text-center">
  //               <Typography>
  //                 <h4>{subTopic.toUpperCase()}</h4>
  //               </Typography>
  //             </IonCol>
  //           </AccordionSummary>
  //           <AccordionDetails className="AccordionModuleDetails">
  //             <IonGrid>
  //               <IonItemGroup>{items}</IonItemGroup>
  //             </IonGrid>
  //           </AccordionDetails>
  //         </Accordion>
  //       </IonCol>
  //     </IonRow>
  //   </IonGrid>
  // );

  return (
    <>
      <IonItem lines="none" style={{ "--ion-item-background": colour }}>
        <IonLabel>
          <div className="ion-text-center ion-text-header">
            {subTopic.toUpperCase()}
          </div>
        </IonLabel>
      </IonItem>
      <IonItemGroup>{items}</IonItemGroup>
    </>
  );
}

export default ModuleDisplay;
