import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonProgressBar,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSearchbar,
  IonSpinner,
  IonChip,
} from "@ionic/react";
import {
  peopleOutline,
  todayOutline,
  barChart,
  arrowForwardOutline,
} from "ionicons/icons";

import { addControllersProp } from "../../util_model/controllers";

import "./GroupInfo.scss";
import Instructions from "./Instructions";
import DailyJournal from "../../Journal/DailyJournal";
import DailyActions from "./DailyActions";
import GenericModal from "../../Info/components/GenericModal";
import ActivityProgressBreakdownBar from "../../MovePlaylists/components/ActivityProgressBreakdownBar";

const GroupInfo = ({ group, modules, controllers, match }) => {
  // const [showAlert, setShowAlert] = useState(false);
  const [memberProfiles, setMemberProfiles] = useState([]);
  const [memberMinutes, setMemberMinutes] = useState([]);
  const [showMemberModal, setShowModal] = useState(false);
  const [view, setView] = useState(
    match.params.page ? match.params.page : "info"
  );
  // const [showMenu, setShowMenu] = useState(false);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  // const history = useHistory();

  // function toggleAlert() {
  //   setShowAlert(!showAlert);
  // }

  function toggleMemberModal() {
    setShowModal(!showMemberModal);
  }

  async function fetchTeamUserInfo() {
    setLoadingTeamMembers(true);
    const memberProfiles = await controllers.client.getTeamUserProfiles(
      group.code
    );

    const minutes = await controllers.client.getTeamMinutes(
      group,
      group.experiment.day
    );

    setMemberProfiles(memberProfiles);
    setMemberMinutes(minutes);
    setLoadingTeamMembers(false);
  }

  useEffect(() => {
    fetchTeamUserInfo();
  }, [group]);

  let content = "";
  const day = group.experiment.day;

  /**
   * Experiment info
   */
  if (view === "info") {
    var dayDescription =
      day === 0
        ? "Starts tomorrow"
        : day < 0
        ? "Starts in " + Math.abs(day) + " days"
        : day > 119
        ? "Finished"
        : "Today is day " + day + " of " + group.experiment.info.duration;

    const numberOfMembers =
      group.users.length > 1 ? group.users.length + " members" : "1 member";

    const memberNames = memberProfiles.map((profile, index) => {
      return (
        <IonItem lines="none" key={index}>
          <IonLabel slot="start">{profile.prefName}</IonLabel>
          {profile.prefName !== "Unknown" ? (
            <IonLabel slot="end">{memberMinutes[index]} minutes</IonLabel>
          ) : (
            ""
          )}
        </IonItem>
      );
    });

    const modalMemberList = loadingTeamMembers ? (
      <IonSpinner name="crescent" className="center-spin" />
    ) : (
      <>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Captain</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>{memberNames.slice(0, 1)}</IonCardContent>
        </IonCard>

        {memberNames.length > 1 ? (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Members</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItemGroup>{memberNames.slice(1)}</IonItemGroup>
                </IonList>
              </IonCardContent>
            </IonCard>
          </>
        ) : (
          ""
        )}
      </>
    );

    // Generates a breakdown of how many minutes a user has moved today, as well
    // as creates an array of objects used to display a multi-coloured progress
    // bar
    function getMinuteBreakdown() {
      let colorBarData = [];
      let totalMinutes = 0;

      // Loop though all the responses today and look for minutes contributed
      // from each module the user has done "movement" for
      for (const response of group.entries[group.experiment.day - 1]
        .responses) {
        if (response.minutes && response.minutes > 1e-10) {
          // the > 1e-10 is for tasks like quizzes which have minutes 1e-10
          totalMinutes += parseFloat(response.minutes);
          const module = modules.find((m) => m._id === response.moduleId);
          colorBarData.push({
            moduleId: response.moduleId,
            value: response.minutes,
            color: module.info.colour,
          });
        }
      }

      // Combine multiple entries for the same module into one entry by adding
      // the minute values together
      const combinedData = new Map();
      colorBarData.forEach((item) => {
        const moduleId = item["moduleId"];
        if (combinedData.has(moduleId)) {
          let totalMinutes =
            parseFloat(item.value) +
            parseFloat(combinedData.get(moduleId).value);
          combinedData.set(moduleId, { ...item, value: totalMinutes });
        } else {
          combinedData.set(moduleId, item);
        }
      });
      colorBarData = Array.from(combinedData.values());

      // Now we deed to calculate the percentage of the total minutes for the
      // colorbar component
      for (let i in colorBarData) {
        colorBarData[i].percentage = `${Math.round(
          (colorBarData[i].value / totalMinutes) * 100
        )}%`;
      }

      return {
        totalMinutes: totalMinutes,
        colorBarData: colorBarData,
      };
    }

    const minuteBreakDown = getMinuteBreakdown();

    //TODO: group.experiment.info.duration to retrieve the automatic duration of the studies
    content = (
      <>
        {/* DISPLAY EXPERIMENT TITLE */}
        <IonGrid>
          <IonRow>
            <IonCol>
              <h2 slot="start">{group.experiment.title}</h2>
            </IonCol>
          </IonRow>
          {/* DISPLAY WEEK INSTRUCTIONS */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <Instructions
                  html={group.experiment.current_stage.instructions}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          {/* DISPLAY DAY NUMBER */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonIcon icon={todayOutline} slot="start" /> {dayDescription}
              </IonItem>
              <IonProgressBar
                value={
                  day > group.experiment.info.duration
                    ? 1
                    : day / group.experiment.info.duration
                }
              />
            </IonCol>
          </IonRow>
          {/* DISPLAY TEAM NAME AND DETAILS */}
          <IonRow>
            <IonCol>
              <IonList>
                <IonRow>
                  <IonCol>
                    <IonItem lines="none" className="ion-text-center">
                      <IonLabel>
                        <IonText style={{ fontSize: "1.2em" }}>
                          {group.name}
                        </IonText>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem
                      lines="none"
                      style={{ fontSize: "14px" }}
                      button
                      onClick={() => {
                        toggleMemberModal();
                      }}
                      detail={true}
                      detailIcon={arrowForwardOutline}
                    >
                      <IonIcon icon={peopleOutline} slot="start" />
                      <IonLabel>{numberOfMembers}</IonLabel>
                      <GenericModal
                        showModal={showMemberModal}
                        toggleModal={toggleMemberModal}
                        title="Your Team Members"
                        body={modalMemberList}
                      />
                    </IonItem>
                  </IonCol>
                  <IonCol>
                    <IonItem lines="none" style={{ fontSize: "14px" }}>
                      <IonLabel>Team Code:</IonLabel>
                      <IonInput readonly={true} value={group.code}></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonList>
            </IonCol>
          </IonRow>
          {/* DISPLAY PATH */}
          {/* <IonRow>
            <IonCol>
              <IonItem lines="none" className="ion-text-center">
                <IonLabel>
                  <IonText>
                    You are on the{" "}
                    <strong>{group.s22path.path.toUpperCase()}</strong> path
                  </IonText>
                </IonLabel>
              </IonItem>
            </IonCol>
          </IonRow> */}
          {/* DISPLAY DAILY TASKS */}
          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonGrid>
                  <div
                    style={{ "padding-top": "10px", "padding-bottom": "0px" }}
                  >
                    <IonRow>
                      <IonCol className="ion-text-center">
                        {/* <IonItem> */}
                        <IonRow
                          style={{
                            "--padding-top": "100px",
                            fontSize: "1.1em",
                          }}
                        >
                          <IonCol>
                            <IonText>
                              {minuteBreakDown.totalMinutes > 0 ? (
                                <>
                                  You've moved for{" "}
                                  <strong>
                                    {minuteBreakDown.totalMinutes} minutes
                                  </strong>{" "}
                                  today!
                                </>
                              ) : (
                                <>You haven't done any movement today!</>
                              )}
                            </IonText>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol>
                            <ActivityProgressBreakdownBar
                              visualParts={minuteBreakDown.colorBarData}
                            />
                          </IonCol>
                        </IonRow>
                      </IonCol>
                    </IonRow>
                  </div>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem lines="none">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonText style={{ fontSize: "1.2em" }}>Actions</IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <DailyActions group={group} today={day} tabs={false} />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </>
    );
  } else if (view === "tasks") {
    /**
     * Task list
     */
    content = <DailyActions group={group} today={day} />;
  } else if (view === "journal") {
    /**
     * Journal & Charts
     */
    content = (
      <>
        <DailyJournal
          todayNumber={day}
          entries={group.entries}
          group={group}
        ></DailyJournal>
      </>
    );
  } else if (view === "charts") {
    content = (
      <>
        <IonList>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>View Data</IonLabel>
            </IonItemDivider>
            {/* <p>Charts will be available soon. Thank you for your patience.</p> */}
            <Link to={"/box/move/" + group._id + "/charts"}>
              <IonItem
                color="tertiary"
                style={{ cursor: "pointer" }}
                detail={true}
              >
                <IonIcon icon={barChart} slot="start" />
                View Charts
              </IonItem>
            </Link>
          </IonItemGroup>
        </IonList>
      </>
    );
  }

  var setSegment = (e) => {
    setView(e.detail.value);
  };

  return <>{content}</>;
};

export default connect(
  (state, ownProps) => {
    return {};
  },
  {
    pure: false,
  }
)(addControllersProp(GroupInfo));
