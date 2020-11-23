import React, { Component } from 'react';
import {
  IonSlides, IonSlide, IonContent,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonItem, IonIcon, IonLabel, IonButton,
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
                <IonCardSubtitle>What is our approach?</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                You already have a lot of practice Eating. Sleeping. Moving. And that's great! But the question is, is there more to it? Is there something which works for YOU and doesn't work for others?<br></br>
                A practice? A skill? A piece of knowledge? A habit? Our answer is: An experiment! Experiments-In-A-Box is our approach to make YOU Move better! Eat better! Engage Better! Cogitate Better! And Sleep Better! Our plan is to make you FEEL better!<br></br>
                How? By offering you a variety of "BOXES" - sets of different experiments which can work for you and your daily habits, and we give you the opportunity of experimenting with them to see.. which one brings you more skills, which one improves your lifestyle.. and which one improves your WELLBEING!<br></br>
                And the best thing.. You can even create your own! </IonCardContent>
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
                The good aspect to our approach is that we do not tell you what to do.<br></br>
                We simply give you a few health habits you can try out to see if they work FOR YOU?<br></br>
                Why? Because EVERYONE IS DIFFERENT. So why not just try out some wellbeing practices to see which one is most beneficial for you?<br></br>
                WE give you the options of experimentation.<br></br>
                YOU get the power to choose what experiment you are doing.<br></br>
                YOU feed YOUR DATA back into the app.<br></br>
                YOU reflect on the experiment's effect on your wellbeing.<br></br>
                YOU decide whether you wish to incorporate this into your daily life.<br></br>
                And that's it! Simple as that! We give you the options, and you control your experience!
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
                <IonCardTitle>XB: Visualise.</IonCardTitle>
                <IonCardSubtitle>What do we mean by "feed your data"?</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                You have total control over your data. We are just giving you some helpers to help MANAGE your data, ANALYSE it, and VISUALISE it.<br></br>
                Amongst the features in the app of editing your profile, choosing an experiment and trying out a new health practice, you will be able to (1) record your experience and (2) reflect on your experience.<br></br>
                We are doing that by prompting you with questions about your experiment, your experiment, your daily mood and health, which is later going to help you understand how these health practices impact you!<br></br>
                And that's not everything! These are not only adjustable, but also optional! YOU decide what data you want to feed back to the app.<br></br>
                And while browsing all of our features, you may find the "Goal Diary" (personal notebook), the "Calendar" (record of all your data), and the "Visualise" (graphs to understand your progress) sections be of great help in your journey!
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
                <IonCardTitle>An XB Group.</IonCardTitle>
                <IonCardSubtitle>What's a group?</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                And there's more!<br></br>
                We understand you may want to experience these health practices by yourself. You can look at YOUR own data.<br></br>
                BUT: what is you want to (1) compare with your friends, or even (2) compare with other individuals?<br></br>
                Well, XB Groups is a function which lets you join your XB experiment as part of a group, and work through the experiments together - OR - compare your data/your group's data with other groups/individuals!<br></br>
                This shall be well fun!
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
                <IonCardTitle>XB.</IonCardTitle>
                <IonCardSubtitle>Join today!</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                1) CHOOSE.<br></br>
                2) EXPERIMENT.<br></br>
                3) RECORD.<br></br>
                4) VISUALISE.<br></br>
                5) REFLECT.<br></br>
                6) IMPROVE.<br></br>
                </IonCardContent>
                <IonButton routerLink="/login" expand="full">Back to the Log In page -&gt;</IonButton>
            </IonCard>
          </IonSlide>
        </IonSlides>
      </IonContent>
    );
  }
}

export default Tutorial;