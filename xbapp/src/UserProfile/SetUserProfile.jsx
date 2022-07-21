import { connect } from "react-redux";
import {
  IonButton,
  IonContent,
  IonCard,
  IonRow,
  IonCol,
  IonSpinner,
  IonPage,
  IonIcon,
  IonCardSubtitle,
  IonCardHeader,
  IonCardTitle,
  IonList,
} from "@ionic/react";
import { saveOutline } from "ionicons/icons";

import { addControllersProp } from "../util_model/controllers";
import XBHeader from "../util/XBHeader";
import TextInputField from "./components/TextField";
import ChoiceInputField from "./components/ChoiceField";

const facultyMap = {
  "Health, Safety & Risk": [],
  "Research and Innovation Services": [],
  iSolutions: [],
  "Faculty of Arts and Humanities": [
    "Winchester School of Art",
    "Archaeology",
    "English",
    "Film",
    "History",
    "Modern Languages and Linguistics",
    "Music",
    "Philosophy",
  ],
  Library: [],
  "Faculty of Engineering and Physical Sciences": [
    "Chemisty",
    "Electronics and Computer Science",
    "Engineering",
    "FEPS Enterprise/nC2",
    "Physics and Astronomy",
    "Southampton Marine and Maritime Institute",
    "Web Science Institute",
    "Zepler Institute for Photonics and Nanoelectronics",
  ],
  "Health and Safety": [],
  "Faculty of Social Sciences": [
    "Southampton Law School",
    "Economic, Social and Political Sciences",
    "Southampton Business School",
    "Mathematical Sciences",
    "Southampton Education School",
  ],
  "Faculty of Medicine": [
    "Medicine",
    "Cancer Science",
    "Human Development and Health",
    "Clinical and Experimental Science",
    "Primary Care, Population Sci and Medical Education",
  ],
  "Health Sciences": [],
  "Faculty of Environmental and Life Sciences": [
    "Biological Sciences",
    "Health Sciences",
    "Geography and Environmental Sciences",
    "Ocean and Earth Science",
    "Psychology",
  ],
  Other: [],
};

const departmentMap = [
  "Winchester School of Art",
  "Archaeology",
  "English",
  "Film",
  "History",
  "Modern Languages and Linguistics",
  "Music",
  "Philosophy",
  "Chemistry",
  "Electronics and Computer Science",
  "Engineering",
  "FEPS Enterprise/nC2",
  "Physics and Astronomy",
  "Southampton Marine and Maritime Institute",
  "Web Science Institute",
  "Zepler Institute for Photonics and Nanoelectronics",
  "Southampton Law School",
  "Economic, Social and Political Sciences",
  "Southampton Business School",
  "Mathematical Sciences",
  "Southampton Education School",
  "Medicine",
  "Cancer Science",
  "Human Development and Health",
  "Clinical and Experimental Science",
  "Primary Care, Population Sci and Medical Education",
  "Biological Sciences",
  "Health Sciences",
  "Geography and Environmental Sciences",
  "Ocean and Earth Science",
  "Psychology",
  "Professional Services",
  "Other",
].sort();

const facultyList = Object.keys(facultyMap).sort();

/**
 * Create a user profile
 *
 */
function SetUserProfile(props) {
  let profileObj = {};

  function updateProfile(newKey, value) {
    profileObj[newKey] = value;
  }

  async function saveProfile() {
    await props.controllers.UPDATE_USER_PROFILE(profileObj);
    if (props.setSetUpProfile) {
      props.setSetUpProfile(true);
    }
    // history.goBack();
  }

  props.controllers.SET_USER_PROFILE_IF_REQD();
  if (!props.userProfile.loaded) {
    return <IonSpinner name="crescent" className="center-spin" />;
  } else {
    profileObj = { ...props.userProfile.userProfile };
  }

  /**
   * Questions which are being asked:
   * - Preferred name (username) - free text
   * - Unit of faculty - list
   * - School or department - list
   * - Campus - list
   * - Office/building - free text
   * - Career stage - list
   */

  const inputCard = (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Set Your User Profile</IonCardTitle>
        <IonCardSubtitle>Set as many of these as you want to</IonCardSubtitle>
      </IonCardHeader>
      <IonList>
        {/* Preferred name */}
        <TextInputField
          input={profileObj["prefName"]}
          inputLabel={"Your preferred name"}
          profileObjKey={"prefName"}
          updateProfileObj={updateProfile}
        />
        {/* Unit or faculty */}
        <ChoiceInputField
          input={profileObj["unit"]}
          inputLabel={"Unit or Faculty"}
          choices={facultyList}
          profileObjKey={"unit"}
          updateProfileObj={updateProfile}
        />
        {/*{pObj["unit"] === "Other" ? (*/}
        {/*  <TextField*/}
        {/*    inputLabel={"Please specify your unit or faculty"}*/}
        {/*    profileObjKey={"unit"}*/}
        {/*    updateProfileObj={updateProfile}*/}
        {/*  />*/}
        {/*) : (*/}
        {/*  ""*/}
        {/*)}*/}
        {/* School or department */}
        <ChoiceInputField
          input={profileObj["department"]}
          inputLabel={"School or Department"}
          choices={departmentMap}
          profileObjKey={"department"}
          updateProfileObj={updateProfile}
        />
        {/*{profileObj["unit"] === "Other" ? (*/}
        {/*  <TextField*/}
        {/*    inputLabel={"Please specify your school or department"}*/}
        {/*    profileObjKey={"department"}*/}
        {/*    updateProfileObj={updateProfile}*/}
        {/*  />*/}
        {/*) : (*/}
        {/*  ""*/}
        {/*)}*/}
        {/* Campus */}
        <ChoiceInputField
          input={profileObj["campus"]}
          inputLabel={"Campus"}
          choices={[
            "1 Guildhall Square",
            "Avenue",
            "Boldrewood",
            "Highfield",
            "Waterfront",
            "Winchester",
          ].sort()}
          profileObjKey={"campus"}
          updateProfileObj={updateProfile}
        />
        {/* Office/building */}
        {/* TODO: fix related issue somehow https://github.com/ionic-team/ionic-framework/issues/21658 */}
        <TextInputField
          input={profileObj["office"]}
          inputLabel={"Office or Building"}
          profileObjKey={"office"}
          updateProfileObj={updateProfile}
        />
        {/* Career stage */}
        <ChoiceInputField
          input={profileObj["careerStage"]}
          inputLabel={"Career stage"}
          choices={[3, 4, 5, 6, 7]}
          profileObjKey={"careerStage"}
          updateProfileObj={updateProfile}
        />
        {/* Submit button */}
        <IonRow>
          <IonCol>
            <br />
            <IonButton
              // routerLink={"/settings"}
              expand={"block"}
              onClick={saveProfile}
            >
              <IonIcon slot="start" icon={saveOutline} />
              Save
            </IonButton>
          </IonCol>
        </IonRow>
      </IonList>
    </IonCard>
  );

  // Sometimes this wants to be just a component, rather than an entire page.
  // For example, in Home.jsx it is just a component.
  let content;
  if (props.pageType === "move" || props.pageType === "settings") {
    content = inputCard;
  } else {
    content = (
      <IonPage>
        <XBHeader title="User Profile" />
        <IonContent>{inputCard}</IonContent>
      </IonPage>
    );
  }

  return <>{content}</>;
}

export default connect(
  (state, ownProps) => {
    return {
      userProfile: state.userProfile,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(SetUserProfile));
