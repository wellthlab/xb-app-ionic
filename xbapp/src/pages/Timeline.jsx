import React, { Component, useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonDatetime,
  IonCheckbox,
  IonList,
  IonItemDivider,
  IonButton,
} from "@ionic/react";
import XBHeader from "../components/XBHeader";

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  GiChecklist,
  GiRead,
  GiCheckeredFlag,
  GiBiceps,
  GiArrowDunk,
  GiStrong,
  GiFinishLine,
} from "react-icons/gi";

const Timeline = (props) => {
  console.log(props.location);
  var week = props.location.weekNo;
  const goToWeek = () => {
    if (week > 17) {
      week = 17;
    }
    let y = document.getElementById("row-" + week.toString()).offsetTop;
    let content = document.querySelector("ion-content");
    content.scrollToPoint(0, y - 20);
  };

  useEffect(() => {
    goToWeek();
  });

  return (
    <IonPage>
      <XBHeader title="Timeline"></XBHeader>

      <IonContent
        id="about"
        fullscreen
        scrollEvents={true}
        onIonScrollStart={(_e) => {
          console.log(_e);
        }}
        onIonScroll={() => {}}
        onIonScrollEnd={() => {}}
      >
        <VerticalTimeline>
          {/* 
        WEEK -1 REGISTRATION
    */}
          <VerticalTimelineElement
            id={"row--1"}
            className="vertical-timeline-element--work"
            contentStyle={
              week != -1
                ? { background: "rgb(33, 150, 243)", color: "#fff" }
                : {
                    background: "rgb(33, 150, 243)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
            date="2011 - present"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<GiChecklist />}
          >
            <h3 className="vertical-timeline-element-title">WEEK -1</h3>
            <h4 className="vertical-timeline-element-subtitle">Pre-study</h4>
            <p>
              During this week you'll have registered for the study, joined the
              Microsoft Team, and download the XB Strength app.
            </p>
            <p>
              <strong>
                You may also need to aquire any workout material i.e. roap to
                complete some exercises.
              </strong>
            </p>
          </VerticalTimelineElement>

          {/* 
        WEEK 0 PREP WEEK
    */}
          <VerticalTimelineElement
            id={"row-0"}
            className="vertical-timeline-element--work"
            contentStyle={
              week != 0
                ? { background: "rgb(4, 145, 108)", color: "#fff" }
                : {
                    background: "rgb(4, 145, 108)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(4, 145, 108)" }}
            date="2011 - present"
            iconStyle={{ background: "rgb(4, 145, 108)", color: "#fff" }}
            icon={<GiRead />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 0</h3>
            <h4 className="vertical-timeline-element-subtitle">Prep week</h4>
            <p>
              This week you'll have read how to use the app, journey structure,
              how to do experiments.
            </p>
            <p>
              <strong>LEARN about DOMS, balance, contractions!</strong>
            </p>
          </VerticalTimelineElement>

          {/* 
        WEEKS 1-5 PRACTICE ESTABLISHMENT
    */}

          <VerticalTimelineElement
            id={"row-1"}
            className="vertical-timeline-element--work"
            contentStyle={
              week != 1
                ? { background: "rgb(28, 214, 65)", color: "#fff" }
                : {
                    background: "rgb(28, 214, 65)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(28, 214, 65)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(28, 214, 65)", color: "#fff" }}
            icon={<GiCheckeredFlag />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 1</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Practice Establishment
            </h4>
            <p>
              One week - one block! You'll practice with a PUSH move and a PULL
              move.
            </p>
            <p>+ Assessment!</p>
            <p>
              <strong>
                LEARN about blocks (our Move Tutorial) and about moves!
              </strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-2"}
            className="vertical-timeline-element--work"
            contentStyle={
              week != 2
                ? { background: "rgb(28, 214, 65)", color: "#fff" }
                : {
                    background: "rgb(28, 214, 65)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(28, 214, 65)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(28, 214, 65)", color: "#fff" }}
            icon={<GiBiceps />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 2</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Practice Establishment
            </h4>
            <p>2 blocks now! Same as week 1 though (push + pull)!</p>
            <p>
              <strong>LEARN about isometrics!</strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-3"}
            className="vertical-timeline-element--work"
            contentStyle={
              week != 3
                ? { background: "rgb(28, 214, 65)", color: "#fff" }
                : {
                    background: "rgb(28, 214, 65)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(28, 214, 65)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(28, 214, 65)", color: "#fff" }}
            icon={<GiBiceps />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 3</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Practice Establishment
            </h4>
            <p>
              Block 1: Lower push + pull; Block 2: Balance; Block 3: Upper push
              + pull
            </p>
            <p>+ Assessment!</p>
            <p>
              <strong>LEARN about balance and try an experiment!</strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-4"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 4
                ? { background: "rgb(28, 214, 65)", color: "#fff" }
                : {
                    background: "rgb(28, 214, 65)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(28, 214, 65)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(28, 214, 65)", color: "#fff" }}
            icon={<GiBiceps />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 4</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Practice Establishment
            </h4>
            <p>
              Block 1: Unilateral lower pull; Block 2: Unilateral lower push;
              Block 3: Loaded balance; Block 4: Upper push + pull
            </p>
            <p>
              <strong>LEARN about load and unlateral/bilateral!</strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-5"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 5
                ? { background: "rgb(28, 214, 65)", color: "#fff" }
                : {
                    background: "rgb(28, 214, 65)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(28, 214, 65)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(28, 214, 65)", color: "#fff" }}
            icon={<GiBiceps />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 5</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Practice Establishment
            </h4>
            <p>
              Block 1: Unilateral lower pull; Block 2: Unilateral lower push;
              Block 3: Loaded balance; Block 4: Upper push + pull; Block 5:
              phased iso upper/lower
            </p>
            <p>
              <strong>LEARN about discomfort!</strong>
            </p>
          </VerticalTimelineElement>

          {/* 
        WEEKS 6-8 TRANSITION
    */}

          <VerticalTimelineElement
            id={"row-6"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 6
                ? { background: "rgb(0, 143, 138)", color: "#fff" }
                : {
                    background: "rgb(0, 143, 138)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(0, 143, 138)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(0, 143, 138)", color: "#fff" }}
            icon={<GiArrowDunk />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 6</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Transition - Develop Independence
            </h4>
            <p>Practice 5 BLOCKS; Pick an experiment!</p>
            <p>Book a gym induction!</p>
            <p>
              <strong>
                LEARN about the 3/2 routine, breathing and intervals!
              </strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-7"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 7
                ? { background: "rgb(0, 143, 138)", color: "#fff" }
                : {
                    background: "rgb(0, 143, 138)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(0, 143, 138)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(0, 143, 138)", color: "#fff" }}
            icon={<GiArrowDunk />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 7</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Transition - Develop Independence
            </h4>
            <p>Practice 5 BLOCKS; Pick an experiment!</p>
            <p>+ Assessment!</p>
            <p>Do the gym induction! + Gym passes available</p>
            <p>
              <strong>LEARN about intensity, experiments, and MID!</strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-8"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 8
                ? { background: "rgb(0, 143, 138)", color: "#fff" }
                : {
                    background: "rgb(0, 143, 138)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(0, 143, 138)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(0, 143, 138)", color: "#fff" }}
            icon={<GiArrowDunk />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 8</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Transition - Develop Independence
            </h4>
            <p>Practice 5 BLOCKS; Pick an experiment!</p>
            <p>Do the gym induction! + Gym passes available</p>
            <p>
              <strong>Pick an experiment for the week ahead!</strong>
            </p>
          </VerticalTimelineElement>

          {/* 
        WEEKS 9-16 FLEXIBLE EXPERIMENTATION
    */}

          <VerticalTimelineElement
            id={"row-9"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 9
                ? { background: "rgb(71, 0, 186)", color: "#fff" }
                : {
                    background: "rgb(71, 0, 186)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(71, 0, 186)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(71, 0, 186)", color: "#fff" }}
            icon={<GiStrong />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 9</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Flexible Experimentation
            </h4>
            <p>Fitness, fat burn and strength: THE 3/2 PATTERN</p>
            <p>Do experiments! 2-weeks long or 1-week long!</p>
            <p>Gym passes available!</p>
            <p>
              <strong>
                Experiments: time of day (2 weeks); Visualising movements first;
                Standing in workplace etc.!
              </strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-10"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 10
                ? { background: "rgb(71, 0, 186)", color: "#fff" }
                : {
                    background: "rgb(71, 0, 186)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(71, 0, 186)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(71, 0, 186)", color: "#fff" }}
            icon={<GiStrong />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 10</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Flexible Experimentation
            </h4>
            <p>Fitness, fat burn and strength: THE 3/2 PATTERN</p>
            <p>Do experiments! 2-weeks long or 1-week long!</p>
            <p>Gym passes available!</p>
            <p>
              <strong>
                Experiments: time of day (2 weeks); Visualising movements first;
                Standing in workplace etc.!
              </strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-11"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 11
                ? { background: "rgb(71, 0, 186)", color: "#fff" }
                : {
                    background: "rgb(71, 0, 186)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(71, 0, 186)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(71, 0, 186)", color: "#fff" }}
            icon={<GiStrong />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 11</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Flexible Experimentation
            </h4>
            <p>Fitness, fat burn and strength: THE 3/2 PATTERN</p>
            <p>Do experiments! 2-weeks long or 1-week long!</p>
            <p>Gym passes available!</p>
            <p>
              <strong>
                Experiments: time of day (2 weeks); Visualising movements first;
                Standing in workplace etc.!
              </strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-12"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 12
                ? { background: "rgb(71, 0, 186)", color: "#fff" }
                : {
                    background: "rgb(71, 0, 186)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(71, 0, 186)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(71, 0, 186)", color: "#fff" }}
            icon={<GiStrong />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 12</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Flexible Experimentation
            </h4>
            <p>Fitness, fat burn and strength: THE 3/2 PATTERN</p>
            <p>Do experiments! 2-weeks long or 1-week long!</p>
            <p>Gym passes available!</p>
            <p>
              <strong>
                Experiments: time of day (2 weeks); Visualising movements first;
                Standing in workplace etc.!
              </strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-13"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 13
                ? { background: "rgb(71, 0, 186)", color: "#fff" }
                : {
                    background: "rgb(71, 0, 186)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(71, 0, 186)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(71, 0, 186)", color: "#fff" }}
            icon={<GiStrong />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 13</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Flexible Experimentation
            </h4>
            <p>Fitness, fat burn and strength: THE 3/2 PATTERN</p>
            <p>Do experiments! 2-weeks long or 1-week long!</p>
            <p>Gym passes available!</p>
            <p>
              <strong>
                Experiments: time of day (2 weeks); Visualising movements first;
                Standing in workplace etc.!
              </strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-14"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 14
                ? { background: "rgb(71, 0, 186)", color: "#fff" }
                : {
                    background: "rgb(71, 0, 186)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(71, 0, 186)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(71, 0, 186)", color: "#fff" }}
            icon={<GiStrong />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 14</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Flexible Experimentation
            </h4>
            <p>Fitness, fat burn and strength: THE 3/2 PATTERN</p>
            <p>Do experiments! 2-weeks long or 1-week long!</p>
            <p>Gym passes available!</p>
            <p>
              <strong>
                Experiments: time of day (2 weeks); Visualising movements first;
                Standing in workplace etc.!
              </strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-15"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 15
                ? { background: "rgb(71, 0, 186)", color: "#fff" }
                : {
                    background: "rgb(71, 0, 186)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(71, 0, 186)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(71, 0, 186)", color: "#fff" }}
            icon={<GiStrong />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 15</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Flexible Experimentation
            </h4>
            <p>Fitness, fat burn and strength: THE 3/2 PATTERN</p>
            <p>Do experiments! 2-weeks long or 1-week long!</p>
            <p>Gym passes available!</p>
            <p>
              <strong>
                Experiments: time of day (2 weeks); Visualising movements first;
                Standing in workplace etc.!
              </strong>
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            id={"row-16"}
            className="vertical-timeline-element--education"
            contentStyle={
              week != 16
                ? { background: "rgb(71, 0, 186)", color: "#fff" }
                : {
                    background: "rgb(71, 0, 186)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(71, 0, 186)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(71, 0, 186)", color: "#fff" }}
            icon={<GiStrong />}
          >
            <h3 className="vertical-timeline-element-title">WEEK 16</h3>
            <h4 className="vertical-timeline-element-subtitle">
              Flexible Experimentation
            </h4>
            <p>Fitness, fat burn and strength: THE 3/2 PATTERN</p>
            <p>Do experiments! 2-weeks long or 1-week long!</p>
            <p>Gym passes available!</p>
            <p>
              <strong>
                Experiments: time of day (2 weeks); Visualising movements first;
                Standing in workplace etc.!
              </strong>
            </p>
          </VerticalTimelineElement>

          {/*AND THAT'S A WRAP */}
          <VerticalTimelineElement
            id={"row-17"}
            className="vertical-timeline-element--education"
            contentStyle={
              week < 17
                ? { background: "rgb(186, 140, 0)", color: "#fff" }
                : {
                    background: "rgb(186, 140, 0)",
                    color: "#fff",
                    borderColor: "#fffdfd",
                    borderStyle: "outset",
                    borderWidth: "7px",
                  }
            }
            contentArrowStyle={{ borderRight: "7px solid  rgb(186, 140, 0)" }}
            date="2010 - 2011"
            iconStyle={{ background: "rgb(186, 140, 0)", color: "#fff" }}
            icon={<GiFinishLine />}
          >
            <h3 className="vertical-timeline-element-title">
              WEEK 17 AND BEYOND
            </h3>
            <h4 className="vertical-timeline-element-subtitle">Good luck!</h4>
            <p>
              And that's a wrap! Keep doing what you learned! Live healthier,
              happier, and better!
            </p>
            <p>
              <strong>See you soon!</strong>
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </IonContent>
    </IonPage>
  );
};

export default Timeline;
