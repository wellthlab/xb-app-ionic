import { useState, useEffect } from "react";
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
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from "@ionic/react";

import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";

const facultyList = [
  "Research and Innovation Services",
  "iSolutions",
  "Faculty of Arts and Humanities",
  "Library",
  "Faculty of Engineering and Physical Sciences",
  "Health and Safety",
  "Faculty of Social Sciences",
  "Medicine",
  "Health Sciences",
  "Faculty of Environmental and Life Sciences",
].sort();

const departmentList = [
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
  "Web Ccience Institute",
  "Zepler Institute for Photonics and Nanoelectronics",
  "Medicine",
  "Cancer Science",
  "Human Development and Health",
  "Clinical and Experimental Science",
  "Primary Care, Population Sci and Medical Education",
  "Southampton Law School",
  "Economic, Social and Political Sciences",
  "Southampton Business School",
  "Mathematical Sciences",
  "Southampton Education School",
  "HSR",
  "Biological Sciences",
  "Health Sciences",
  "Geography and Environmental Sciences",
  "Ocean and Earth Science",
  "Psychology",
].sort();

/**
 * Create a user profile
 *
 */
function UserProfile(props) {
  let profileObj = {};

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
      <>
        <IonItem>
          <IonLabel position="floating">{inputLabel}</IonLabel>
          <IonInput value={value} onIonChange={(e) => handleChange(e)} />
        </IonItem>
      </>
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
      updateProfileObj(profileObjKey, e.detail.value);
      setValue(e.detail.value);
    }

    const selections = choices.map((choice) => {
      return <IonSelectOption value={choice}>{choice}</IonSelectOption>;
    });

    return (
      <>
        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">{inputLabel}</IonLabel>
              <IonSelect
                multiple={false}
                value={value}
                onIonChange={(e) => {
                  handleChange(e);
                }}
              >
                {selections}
              </IonSelect>
            </IonItem>
          </IonCol>
        </IonRow>
      </>
    );
  }

  function updateProfile(newKey, value) {
    profileObj[newKey] = value;
  }

  function saveProfile() {
    console.log("Saving profile: ", profileObj);
    props.controllers.CREATE_USER_PROFILE(profileObj);
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

  return (
    <>
      <XBHeader title="User Profile" />
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Set your profile </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
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
              {/* School or department */}
              <ChoiceField
                inputLabel={"School or Department"}
                choices={departmentList}
                profileObjKey={"department"}
                updateProfileObj={updateProfile}
              />
              {/* Campus */}
              <ChoiceField
                inputLabel={"Campus"}
                choices={[
                  "Avenue",
                  "Boldrewood",
                  "Highfield",
                  "Waterfront",
                  "Winchester",
                ]}
                profileObjKey={"campus"}
                updateProfileObj={updateProfile}
              />
              {/* Office/building */}
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
                  <IonButton expand={"full"} onClick={saveProfile}>
                    Save Profile
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </>
  );
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
