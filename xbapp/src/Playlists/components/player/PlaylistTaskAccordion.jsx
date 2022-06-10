import {
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonRow,
} from "@ionic/react";
import { getTaskIcon } from "../util";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

/**
 *
 * @param tasks
 * @param currentTaskIdx
 * @param setCurrentTask
 * @returns {JSX.Element}
 * @constructor
 */
function PlaylistTaskAccordion({ tasks, currentTaskIdx, setCurrentTask }) {
  const taskItems = tasks.map((task, index) => {
    return (
      <IonRow className="ion-no-padding">
        <IonCol className="ion-no-padding">
          <IonItem
            button
            detail={false}
            key={index}
            color={
              index === tasks[currentTaskIdx] ? "secondary" : "transparent"
            }
            lines="none"
            onClick={() => {
              setCurrentTask(index);
            }}
          >
            <IonIcon icon={getTaskIcon(task.verb)} slot="start" />
            <IonLabel className="ion-text-wrap">{task.desc}</IonLabel>
          </IonItem>
        </IonCol>
      </IonRow>
    );
  });

  return (
    <MuiAccordion disableGutters className="AccordionBox">
      <MuiAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <IonCol>
          <Typography>
            <IonItem lines="none" color="primary">
              <IonIcon
                icon={getTaskIcon(tasks[currentTaskIdx].verb)}
                slot="start"
              />
              {tasks[currentTaskIdx].desc}
              <IonLabel slot="end">
                {currentTaskIdx + 1}/{tasks.length}
              </IonLabel>
            </IonItem>
          </Typography>
        </IonCol>
      </MuiAccordionSummary>
      <MuiAccordionDetails className="AccordionDetails">
        <IonGrid className="ion-no-padding ion-text-wrap">
          <IonItemGroup>{taskItems}</IonItemGroup>
        </IonGrid>
      </MuiAccordionDetails>
    </MuiAccordion>
  );
}

export default PlaylistTaskAccordion;
