import React, { Component } from 'react';
import {
  IonSlides, IonSlide, IonContent,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonItem, IonButton,
  IonGrid, IonRow, IonCol
} from '@ionic/react';
import './Tutorial.css';

// Optional parameters to pass to the swiper instance.
// See http://idangero.us/swiper/api/ for valid options.
const slideOpts = {
  grabCursor: true,
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94,
  },
  on: {
    beforeInit: function () {
      const swiper = this;
      swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

      const overwriteParams = {
        slidesPerView: 1,
        slidesPerColumn: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        resistanceRatio: 0,
        spaceBetween: 0,
        centeredSlides: false,
        virtualTranslate: true,
      };

      this.params = Object.assign(this.params, overwriteParams);
      this.originalParams = Object.assign(this.originalParams, overwriteParams);
    },
    setTranslate: function () {
      const swiper = this;
      const {
        $el, $wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize,
      } = swiper;
      const params = swiper.params.cubeEffect;
      const isHorizontal = swiper.isHorizontal();
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let wrapperRotate = 0;
      let $cubeShadowEl;
      if (params.shadow) {
        if (isHorizontal) {
          $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
          if ($cubeShadowEl.length === 0) {
            $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
            $wrapperEl.append($cubeShadowEl);
          }
          $cubeShadowEl.css({ height: `${swiperWidth}px` });
        } else {
          $cubeShadowEl = $el.find('.swiper-cube-shadow');
          if ($cubeShadowEl.length === 0) {
            $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
            $el.append($cubeShadowEl);
          }
        }
      }

      for (let i = 0; i < slides.length; i += 1) {
        const $slideEl = slides.eq(i);
        let slideIndex = i;
        if (isVirtual) {
          slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
        }
        let slideAngle = slideIndex * 90;
        let round = Math.floor(slideAngle / 360);
        if (rtl) {
          slideAngle = -slideAngle;
          round = Math.floor(-slideAngle / 360);
        }
        const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
        let tx = 0;
        let ty = 0;
        let tz = 0;
        if (slideIndex % 4 === 0) {
          tx = -round * 4 * swiperSize;
          tz = 0;
        } else if ((slideIndex - 1) % 4 === 0) {
          tx = 0;
          tz = -round * 4 * swiperSize;
        } else if ((slideIndex - 2) % 4 === 0) {
          tx = swiperSize + (round * 4 * swiperSize);
          tz = swiperSize;
        } else if ((slideIndex - 3) % 4 === 0) {
          tx = -swiperSize;
          tz = (3 * swiperSize) + (swiperSize * 4 * round);
        }
        if (rtl) {
          tx = -tx;
        }

        if (!isHorizontal) {
          ty = tx;
          tx = 0;
        }

        const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
        if (progress <= 1 && progress > -1) {
          wrapperRotate = (slideIndex * 90) + (progress * 90);
          if (rtl) wrapperRotate = (-slideIndex * 90) - (progress * 90);
        }
        $slideEl.transform(transform$$1);
        if (params.slideShadows) {
          // Set shadows
          let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
          let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
          if (shadowBefore.length === 0) {
            shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
            $slideEl.append(shadowBefore);
          }
          if (shadowAfter.length === 0) {
            shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
            $slideEl.append(shadowAfter);
          }
          if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
          if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
        }
      }
      $wrapperEl.css({
        '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
        '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
        '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
        'transform-origin': `50% 50% -${swiperSize / 2}px`,
      });

      if (params.shadow) {
        if (isHorizontal) {
          $cubeShadowEl.transform(`translate3d(0px, ${(swiperWidth / 2) + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
        } else {
          const shadowAngle = Math.abs(wrapperRotate) - (Math.floor(Math.abs(wrapperRotate) / 90) * 90);
          const multiplier = 1.5 - (
            (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2)
            + (Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2)
          );
          const scale1 = params.shadowScale;
          const scale2 = params.shadowScale / multiplier;
          const offset$$1 = params.shadowOffset;
          $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${(swiperHeight / 2) + offset$$1}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
        }
      }

      const zFactor = (swiper.browser.isSafari || swiper.browser.isUiWebView) ? (-swiperSize / 2) : 0;
      $wrapperEl
        .transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
    },
    setTransition: function (duration) {
      const swiper = this;
      const { $el, slides } = swiper;
      slides
        .transition(duration)
        .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
        .transition(duration);
      if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
        $el.find('.swiper-cube-shadow').transition(duration);
      }
    },
  }
}

class Tutorial extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <IonContent>
        <IonSlides pager={true} options={slideOpts}>
          <IonSlide>
            <IonCard>
              <IonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol><img style={{width: "100px", resize: "both"}} src="assets/move.png" alt="XB Logo" /></IonCol>
                    <IonCol><img style={{width: "100px", resize: "both"}} src="assets/eat.png" alt="XB Logo" /></IonCol>
                    <IonCol><img style={{width: "100px", resize: "both"}} src="assets/engage.png" alt="XB Logo" /></IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol><img style={{width: "100px", resize: "both"}} src="assets/cogitate.png" alt="XB Logo" /></IonCol>
                    <IonCol><img style={{width: "100px", resize: "both"}} src="assets/sleep.png" alt="XB Logo" /></IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
              <IonCardHeader>
                <IonCardTitle>Experiments in a Box.</IonCardTitle>
                <IonCardSubtitle>What is it?</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
              Welcome to an Experiment in a Box -  Here to Tune in what can help you feel better.<br></br>
              The idea of an experiment in a box - or XB for short - is to help you build helpful health practices by letting you test them out - to see what works for you.<br></br>
              WHAT IS AN EXPERIMENT? An experiment is a way to test an idea: does something you think will have a particular effect in a particular condition have that effect? For example: if you are a coffee drinker, you may wish to test the concept that not drinking coffee after 1pm means feeling more refreshed the next morning. For a week, you may commit to making sure you don’t drink any coffee after 1pm. You may pay attention to how you feel over the course of the week, and notice that by about day 4 you are feeling more refreshed in the morning.  <br></br>
              You now have some new, tested information about how coffee may be affecting your sleep quality. 
<br></br>
These are exactly the kinds of experiments an XB supports. The XB provides you with tools to explore health practices, to figure out how those practices can work for you: some may work better than others; some may be easier to implement than others. The XB gives you the space to find out. 
<br></br>
<b>Experiments are Short and Specific:</b> An XB only lasts a short time - most are 5-7 days - just enough for your body to get a sense of whether or not the approach is having a noticeableeffect. An experiment doesn’t ask you to commit to something forever. It says: try it; check it out, and if it works, keep it!
<br></br>
<b>Experiments are Not Life:</b> Some experiments may seem a bit odd - we have one to help folks explore how vegetables affect energy and mood where we suggest have a green vegetable each time you eat for a week. Now after the experiment, you may never eat that way again - but that’s ok: an experiment is not “normal” - it’s sometimes a little weird to be able to focus on the particular effect of the new thing you’re trying. But after the experiment, you have new knowledge that you can draw on when shaping your own eating practices. <br>
</br>
One of the comments we’ve had from folks carrying out the Experiments in a Box is that it gives them permission to take the time to explore something. <br>
</br>
As one Experimenter said “i’ve heard that 8 hours of sleep a night is good for you, but if i hadn’t tried that as an experiment in a box, i would never have really found out. IT’s changed my life” - 
<br></br>    
Not all experiment experiences may be that profound, but we hope they do help you give yourself permission to try something in this focused way, for just enough time to find out - how does it feel; do you feel better? <br></br>
                
                </IonCardContent>
            </IonCard>
          </IonSlide>
          <IonSlide>
          <IonCard>
              <IonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol><img style={{width: "100px", resize: "both"}} src="assets/box.png" alt="XB Logo" /></IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
              <IonCardHeader>
                <IonCardTitle>An Experiment in a Box.</IonCardTitle>
                <IonCardSubtitle>How does it work?</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
              An Experiment in a Box has several features designed to make it as useful for you as possible. It starts with the idea that YOU are the scientist running this experiment, and the box gives you the tools to carry out your study. The box has several features, listed below:<br>
              </br>
              <b>1. You Choose:</b> An experiment in a box may have many ways to explore a health practice. For instance, for sleep, it might help you explore light and dark levels for a week, or noise, or killing your alarm or many other practices tested to support better sleep. It’s up to you: pick from the box the approach that feels interesting to you. <br>
              </br>
              <b>2. Guides to Help you record your results:</b> A key part of a scientist’s work, of course, is to create the evidence about whether or not the thing being tested is having the effect anticipated or not. The experiment in a box app provides tools to capture key bits of data to build up your evidence for analysis. A key question the XB will always ask each day is: how do you feel: the same, better, much better; worse, much worse. All data is good data. Other features may include daily short questionnaires to help you reflect on the effect of what you’re currently testing.<br></br>
              <b>3. Visualise your Evidence:</b> Once you have gathered some results, there are tools to help you see what the data may be telling you. For instance, in an XB exploring movement and time of day, you may see in a graph that shows how you feel with movement times, that you seem to feel better on days after you move in the morning rather than the afternoon. <br></br>
              <b>4.Working Together:</b> Sometimes it helps to work with others on a Study to share experiences, build insights and develop understanding. XBs support creating Teams where you can each carry out the same study, and share your findings. For instance, in a Move study, you may find that you are not alone: many other people like to go for runs in the rain, too, and that morning rain runs seem to feel better for more people. <br></br>
                </IonCardContent>
            </IonCard>
          </IonSlide>
          <IonSlide>
          <IonCard>
              <IonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol><img style={{width: "100px", resize: "both"}} src="assets/visualise.png" alt="XB Logo" /></IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
              <IonCardHeader>
                <IonCardTitle>An XB Team.</IonCardTitle>
                <IonCardSubtitle>What is a team?</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
              When you start any XB you’ll get a number - that’s your own XB code. 
If you’d like to invite someone else to run the same experiment with you, you can share your code with them. When they start up the XB app, they can choose “join a team.” 
<br></br>
When they hit that button, they can enter the code you’ve given them, and they’ll be automatically added to the team/the experiment - and the team will show up on the list of experiments they are part of!<br></br>
                </IonCardContent>
            </IonCard>
          </IonSlide>

        </IonSlides>
      </IonContent>
    );
  }
}

export default Tutorial;