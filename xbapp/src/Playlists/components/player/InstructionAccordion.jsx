import { IonCol, IonRow, IonText } from "@ionic/react";
import parse from "html-react-parser";

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

/**
 *
 * @param instructions
 * @returns {JSX.Element}
 * @constructor
 */
function InstructionsAccordion({ instructions }) {
  let textArr = instructions ? instructions.trim().split("\n") : [null];

  return (
    <MuiAccordion disableGutters className="InstructionBox">
      <MuiAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Task Instructions</Typography>
      </MuiAccordionSummary>
      <MuiAccordionDetails>
        <Typography className="ion-text-justify">
          {textArr.map((text) => {
            return (
              <IonRow>
                <IonCol>
                  <IonText>
                    {text !== null
                      ? parse(text)
                      : "No instructions are available for this task."}
                  </IonText>
                </IonCol>
              </IonRow>
            );
          })}
        </Typography>
      </MuiAccordionDetails>
    </MuiAccordion>
  );
}
export default InstructionsAccordion;
