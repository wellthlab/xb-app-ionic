import { useState } from "react";
import { IonCol, IonGrid, IonText, IonIcon, IonRow } from "@ionic/react";

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "./VideoAccordion.css";
import Video from "../../Strength/Video";

import { linkOutline } from "ionicons/icons";

/**
 *
 * @param item
 * @param index
 * @returns {JSX.Element}
 * @constructor
 */
function LibraryAccordion({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const [imgSrc, setImgSrc] = useState(item.image);
  const [errorMsg, setErrorMsg] = useState(undefined);

  return (
    <div key={index}>
      <MuiAccordion
        disableGutters={true}
        expanded={expanded === "panel-" + index}
        onChange={handleChange("panel-" + index)}
        className="VideoAccordion"
      >
        <MuiAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <IonCol>
            <Typography>{item.title}</Typography>
          </IonCol>
        </MuiAccordionSummary>
        <MuiAccordionDetails className="VideoAccordionDetails">
          <IonGrid className="ion-no-padding">
            {item.desc ? (
              <IonRow className="ion-text-justify">
                <IonCol>
                  <IonText style={{ fontSize: "1.2em" }}>{item.desc}</IonText>
                </IonCol>
              </IonRow>
            ) : (
              ""
            )}

            {item.weblink ? (
              <IonRow>
                <IonCol>
                  <IonText>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.2em",
                        textAlign: "center",
                      }}
                    >
                      <a href={item.weblink} target="_blank" rel="noreferrer">
                        Find out more online <IonIcon icon={linkOutline} />
                      </a>
                    </p>
                  </IonText>
                </IonCol>
              </IonRow>
            ) : (
              ""
            )}

            {item.image ? (
              errorMsg ? (
                <div className="ion-text-center">
                  <img
                    src={imgSrc}
                    onError={() => {
                      setErrorMsg(
                        "an image is missing here because it couldn't be loaded"
                      );
                      setImgSrc("assets/strength_logo.png");
                    }}
                    alt="Task"
                  />
                </div>
              ) : (
                <div className="ion-text-center">
                  <h3>{errorMsg}</h3>
                </div>
              )
            ) : (
              ""
            )}

            {expanded === "panel-" + index && item.video ? (
              <IonRow>
                <IonCol>
                  <br />
                  <Video video={item.video} onSubmit={() => {}} />
                </IonCol>
              </IonRow>
            ) : (
              ""
            )}
          </IonGrid>
        </MuiAccordionDetails>
      </MuiAccordion>
    </div>
  );
}

export default LibraryAccordion;
