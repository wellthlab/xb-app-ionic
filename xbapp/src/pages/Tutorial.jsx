import React, { Component } from "react";
import {
  IonSlides,
  IonSlide,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
} from "@ionic/react";
import "./Tutorial.css";
// Redux stuff
import { connect } from "react-redux";

// Optional parameters to pass to the swiper instance.
// See http://idangero.us/swiper/api/ for valid options.
const slideOpts = {
  initialSlide: 0,
  slidesPerView: 1,
  autoplay: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  },
};

const Tutorial = ({ account }) => {
  return (
    <div id="tutorial">
      <IonSlides pager={true} options={slideOpts} autoHeight="true">
        <IonSlide>
          <IonContent>
              <IonCard class="tutorial-card">
                <img
                  src="assets/xb_standard_logo.png"
                  alt="XB Logo"
                />
                <IonCardHeader>
                  <IonCardTitle>Welcome to Experiments in a Box</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2>What is XB?</h2>
                  <p>An experiment in a box (XB for short) helps you
                  build helpful health practices by letting you test them out - to
                  see what works for you.</p>
                  <h2>What is an experiment? </h2>
                  <p>An experiment is a way to test an
                  idea: does something you think will have a particular effect in a
                  particular condition have that effect? For example: if you are a
                  coffee drinker, you may wish to test the concept that not drinking
                  coffee after 1pm means feeling more refreshed the next morning.
                  For a week, you may commit to making sure you don’t drink any
                  coffee after 1pm. You may pay attention to how you feel over the
                  course of the week, and notice that by about day 4 you are feeling
                  more refreshed in the morning.</p>
                  <p>You now have some new, tested information about how coffee may be
                  affecting your sleep quality.</p>
                  <p>These are exactly the kinds of experiments an XB supports. The XB
                  provides you with tools to explore health practices, to figure out
                  how those practices can work for you: some may work better than
                  others; some may be easier to implement than others. The XB gives
                  you the space to find out.</p>
                  <h2>Experiments are short and specific!</h2>
                  <p>An XB only lasts a
                  short time - most are 5-7 days - just enough for your body to get
                  a sense of whether or not the approach is having a noticeable
                  effect. An experiment doesn’t ask you to commit to something
                  forever. It says: try it, check it out, and if it works, keep it!</p>
                  <h2>Experiments are not life!</h2>
                  <p>Some experiments may seem a bit
                  odd - we have one to help folks explore how vegetables affect
                  energy and mood where we suggest to have a green vegetable each
                  time you eat for a week. Now after the experiment, you may never
                  eat that way again - but that’s ok: an experiment is not “normal”
                  - it’s sometimes a little weird to be able to focus on the
                  particular effect of the new thing you’re trying. But after the
                  experiment, you have new knowledge that you can draw on when
                  shaping your own eating practices.</p>
                  <p>One of the comments we’ve had from folks carrying out the
                  Experiments in a Box is that it gives them permission to take the
                  time to explore something.</p>
                  <p>As one Experimenter said “I’ve heard that 8 hours of sleep a night
                  is good for you, but if I hadn’t tried that as an experiment in a
                  box, I would never have really found out. IT’s changed my life”</p>
                  <p>Not all experiment experiences may be that profound, but we hope
                  they do help to give yourself permission to try something in this
                  focused way, for just enough time to find out - how does it feel;
                  do you feel better?</p>
                </IonCardContent>
              </IonCard>
            </IonContent>
          </IonSlide>

          <IonSlide>
            <IonContent>
              <IonCard class="tutorial-card">
                <IonCardHeader>
                  <IonCardTitle>How does it work?</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>An Experiment in a Box has several features designed to make it as
                  useful for you as possible. It starts with the idea that YOU are
                  the scientist running this experiment, and the box gives you the
                  tools to carry out your study. The box has several features,
                  listed below:</p>
                  <h2>1. You choose</h2>
                  <p>An experiment in a box may have many ways to
                  explore a health practice. For instance, for sleep, it might help
                  you explore light and dark levels for a week, or noise, or killing
                  your alarm or many other practices tested to support better sleep.
                  It’s up to you: pick from the box the approach that feels
                  interesting to you.</p>
                  <h2>2. Guides to help you record your results</h2>
                  <p>A key part of a
                  scientist’s work, of course, is to create the evidence about
                  whether or not the thing being tested is having the effect
                  anticipated or not. The experiment in a box app provides tools to
                  capture key bits of data to build up your evidence for analysis. A
                  key question the XB will always ask each day is: how do you feel?
                  The same, better, much better; worse, much worse. All data is good
                  data. Other features may include daily short questionnaires to
                  help you reflect on the effect of what you’re currently testing.</p>
                  <h2>3. Visualise your evidence</h2>
                  <p>Once you have gathered some
                  results, there are tools to help you see what the data may be
                  telling you. For instance, in an XB exploring movement any time of
                  day, you may see in a graph that shows how you feel with movement
                  times, that you seem to feel better on days after you move in the
                  morning rather than the afternoon.</p>
                  <h2>4. Working together</h2>
                  <p>Sometimes it helps to work with others
                  on a Study to share experiences, build insights and develop
                  understanding. XBs support creating Teams where you can each carry
                  out the same study, and share your findings. For instance, in a
                  Move study, you may find that you are not alone: many other people
                  like to go for runs in the rain, too, and that morning rain runs
                  seem to feel better for more people.</p>
                </IonCardContent>
              </IonCard>
            </IonContent>
          </IonSlide>

          <IonSlide>
            <IonContent>
              <IonCard class="tutorial-card">
                <IonCardHeader>
                  <IonCardTitle>What is an XB Team?</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>When you start any XB you’ll get a number - that’s your own XB
                  code. If you’d like to invite someone else to run the same
                  experiment with you, you can share your code with them. When they
                  start up the XB app, they can choose to “Join a team.”</p>
                  <p>When they hit that button, they can enter the code you’ve given
                  them, and they’ll be automatically added to the team/the
                  experiment - and the team will show up on the list of experiments
                  they are part of!</p>
                </IonCardContent>
                {account.loggedin ? (
                  <IonButton routerLink="/about">
                    Back to About
                  </IonButton>
                ) : (
                  <IonButton routerLink="/">
                    Log-in
                  </IonButton>
                )}
              </IonCard>
          </IonContent>
        </IonSlide>
      </IonSlides>
    </div>
  );
};
export default connect(
  (state, ownProps) => {
    return { account: state.account };
  },
  {
    // Actions to include as props
    pure: false,
  }
)(Tutorial);
