import { useState } from "react";
import { connect } from "react-redux";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSelectOption,
  IonSelect,
  IonCard,
  IonGrid,
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

import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";
import { useHistory } from "react-router";
import { saveOutline } from "ionicons/icons";

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
  "Chemisty",
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
function UserProfile(props) {
  let history = useHistory();
  let profileObj = {};
  const [pObj, setPObj] = useState(profileObj);

  /**
   * Component for free text input
   *
   * @param {string} label - label for input
   * @param {string} profileObjKey - unique identifier for input
   * @param {function} updateProfileObj - function to update profile object
   */
  function TextField({ inputLabel, profileObjKey, updateProfileObj }) {
    const [value, setValue] = useState(
      profileObj[profileObjKey] ? profileObj[profileObjKey] : ""
    );

    function handleChange(e) {
      updateProfileObj(profileObjKey, e.detail.value);
      setValue(e.detail.value);
    }

    return (
      <IonItem>
        <IonLabel position="floating">{inputLabel}</IonLabel>
        <IonInput
          // style={{ "--placeholder-opacity": "0.35" }}
          // placeholder={inputLabel}
          value={value}
          onIonChange={(e) => handleChange(e)}
        />
      </IonItem>
    );
  }

  /**
   * Component for multiple choice input
   *
   * @param {string} label - label for input
   * @param {array} choices - the choices to be presented
   * @param {string} profileObjKey - unique identifier for input
   * @param {function} updateProfileObj - function to update profile object
   */
  function ChoiceField({
    inputLabel,
    choices,
    profileObjKey,
    updateProfileObj,
  }) {
    const [value, setValue] = useState(profileObj[profileObjKey]);

    function handleChange(e) {
      setValue(e.detail.value);
      updateProfileObj(profileObjKey, e.detail.value);
    }

    const selections = choices.map((choice) => {
      return <IonSelectOption value={choice}>{choice}</IonSelectOption>;
    });

    return (
      <IonItem>
        <IonLabel position="floating">{inputLabel}</IonLabel>
        <IonSelect
          // placeholder={inputLabel}
          interface="action-sheet"
          multiple={false}
          value={value}
          onIonChange={(e) => {
            handleChange(e);
          }}
        >
          {selections}
        </IonSelect>
      </IonItem>
    );
  }

  function updateProfile(newKey, value) {
    profileObj[newKey] = value;
  }

  async function saveProfile() {
    await props.controllers.UPDATE_USER_PROFILE(profileObj);
    history.goBack();
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
        <TextField
          inputLabel={"Your preferred name"}
          profileObjKey={"prefName"}
          updateProfileObj={updateProfile}
        />
        {/* Unit or faculty */}
        <ChoiceField
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
        <ChoiceField
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
        <ChoiceField
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
        <TextField
          inputLabel={"Office or Building"}
          profileObjKey={"office"}
          updateProfileObj={updateProfile}
        />
        {/* Career stage */}
        <ChoiceField
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
              routerLink={"/settings"}
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

  let content;
  if (props.pageType === "move" || props.pageType === "settings") {
    content = inputCard;
  } else {
    content = (
      <>
        <IonPage>
          <XBHeader title="User Profile" />
          <IonContent>{inputCard}</IonContent>
        </IonPage>
      </>
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
)(addControllersProp(UserProfile));
