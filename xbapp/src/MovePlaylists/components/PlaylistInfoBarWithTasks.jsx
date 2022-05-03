import {
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonGrid,
  IonText,
  IonIcon,
  IonItemGroup,
} from "@ionic/react";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

import "../PlaylistPlayer.css";
import getTaskIcon from "./taskIcons";

/**
 * Displays some useful information about the current playlist, and allows the
 * user to switch between tasks using an accordion style dropdown menu
 */
function PlaylistInfoBarWithTasks({
  module,
  currentPlaylist,
  tasks,
  currentTaskIdx,
  setCurrentTask,
}) {
  const currentTask = tasks[currentTaskIdx];
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

  const accordionTaskList = (
    <Accordion className="AccordionBox">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <IonCol>
          <Typography>
            <IonItem lines="none" color="primary">
              <IonIcon icon={getTaskIcon(currentTask.verb)} slot="start" />
              {currentTask.desc}
              <IonLabel slot="end">
                {currentTaskIdx + 1}/{tasks.length}
              </IonLabel>
            </IonItem>
          </Typography>
        </IonCol>
      </AccordionSummary>
      <AccordionDetails className="AccordionDetails">
        <IonGrid className="ion-no-padding ion-text-wrap">
          <IonItemGroup>{taskItems}</IonItemGroup>
        </IonGrid>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <>
      <IonItem lines="full">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonRow>
                <IonCol>
                  <IonItem lines="none">
                    <IonLabel>
                      <IonText className="ion-text-wrap ion-text-header">
                        {module.name}
                      </IonText>
                      <IonText className="ion-text-wrap">
                        <br /> Playlist {currentPlaylist + 1}/
                        {module.playlists.length}
                      </IonText>
                    </IonLabel>
                    <IonLabel slot="end">
                      <IonRow class="ion-text-center ion-text-header">
                        <IonText>
                          {module.playlists[currentPlaylist].desc}
                        </IonText>
                      </IonRow>
                      <IonRow>
                        <IonText>
                          {module.playlists[currentPlaylist].minutes} mins
                        </IonText>
                      </IonRow>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>{accordionTaskList}</IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  );
}

export default PlaylistInfoBarWithTasks;
