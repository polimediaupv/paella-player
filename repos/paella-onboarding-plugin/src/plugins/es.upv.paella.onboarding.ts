import { ButtonGroupPlugin, ButtonPlugin, EventLogPlugin, Events } from '@asicupv/paella-core';
import Shepherd, { type Tour } from 'shepherd.js';
import PackagePluginModule from './PackagePluginModule';

import 'shepherd.js/dist/css/shepherd.css';
import '../css/OnBoardingPlugin.css';


export default class OnboardingPlugin extends EventLogPlugin {

  getPluginModuleInstance() {
    return PackagePluginModule.Get();
  }

  get name() {
    return super.name || 'es.upv.paella.onboarding';
  }

  get events() {
    return [
      Events.PLAYER_LOADED
    ];
  }

  async onEvent(_evt: any, _params: any) {
    const hideUI = await this.player.preferences.get('onboarding_hideUI', { global: true });
    this.player.log.info(`onboardinghelp hideUI=${hideUI === true}`);

    const tour = await this.buildTour();
    if (hideUI !== true) {
      setTimeout(() => { this.player.pause(); }, 100);
      tour.start();
    }
  }

  async buildTour() {
    const tour = new Shepherd.Tour({
      tourName: 'paella-onboarding',
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'paella-onboarding',
        scrollTo: true,
        highlightClass: 'paella-onboarding-highlight',
        canClickTarget: false,
        cancelIcon: {
          enabled: true
        },
        buttons: [
          {
            text: this.player.translate('Back'),
            action: function () { this.back(); }
          },
          {
            text: this.player.translate('Next'),
            action: function () { this.next(); }
          }
        ]
      }
    });

    await this.generateTourSteps(tour);

    return tour;
  }

  async generateTourStepsForButtons(tour: Tour, buttons: ButtonPlugin[]) {
    for await (const button of buttons) {
      const help = await button.getTranslatedHelp();

      if (button instanceof ButtonGroupPlugin) {
        tour.addStep({
          title: help?.title ?? this.player.translate(button.description),
          text: help?.description ?? this.player.translate('This button opens a menu with multiple additional tools designed to enhance your experience.'),
          attachTo: {
            element: `li:has(>  button[name="${button.name}"])`,
            on: 'top'
          },
          when: {        
            show: () => {
              button.showPopUp();
            }
          }
        });
        tour.addStep({
          title: help?.title ?? this.player.translate(button.description),
          text: this.player.translate(`Here you’ll find all the available tools grouped in one place. Take a moment to explore what's available.`),
          attachTo: {
            element: `.pop-up`,
            on: 'top'
          }          
        });        

        await this.generateTourStepsForButtons(tour, await button.getVisibleButtonPlugins());
      }
      else {        
        if (help != null) {
          tour.addStep({
            title: help.title,
            text: help.description,
            attachTo: {
              element: `li:has(>  button[name="${button.name}"])`,
              on: 'top'
            }
          });
        }
      }
    }    
  }

  async generateTourSteps(tour: Tour) {
    // Tour: Introduction
    const paellaDescription = this.player.translate('Paella Player is a multistream video player commonly used for lectures. It typically plays two synchronized streams: the presenter and the presentation.');
    const paellaOnTourDescription = this.player.translate('You\'re about to start a quick tour that will guide you through the main features of the player. You can skip it at any time, and optionally choose not to see this tour again.');
    tour.addSteps([
      {
        title: this.player.translate('Getting started with Paella Player'),
        text: `${paellaDescription}<br/><br/>${paellaOnTourDescription}`,
        buttons: [
          {
            text: this.player.translate("Don't show again"),
            action: async () => {
              await this.player.preferences.set('onboarding_hideUI', true, { global: true });
              tour.cancel();
            }
          },
          {
            text: this.player.translate('Next'),
            action: tour.next
          }
        ]
      }
    ]);

    // Tour: Paella player Timeline
    tour.addStep({
      title: this.player.translate('Video navigation'),
      text: this.player.translate('This is the timeline. You can navigate to any time in the video by clicking the timeline.'),
      attachTo: {
        element: '.playback-bar .progress-indicator',
        on: 'top'
      }
    });

    // Tour: Paella player toolbar buttons
    const buttons = this.player.playbackBar.getVisibleButtonPlugins();
    await this.generateTourStepsForButtons(tour, buttons);
    // for await (const button of buttons) {
    //   if (button instanceof ButtonGroupPlugin) {
    //     this.generateTourStepsForGroup(tour, button);
    //     //console.log('Showing popup for button', button.name);
    //   }
    //   else {
    //     // const help = await button.getTranslatedHelp()
    //     // if (help != null) {
    //     //   tour.addStep({
    //     //     title: help.title,
    //     //     text: help.description,
    //     //     attachTo: {
    //     //       element: `li:has(>  button[name="${button.name}"])`,
    //     //       on: 'top'
    //     //     }
    //     //   });
    //     // }
    //   }
    // }

    // Tour: Paella player video layout buttons on multistream videos
    tour.addStep({
      title: this.player.translate('Changing the layout of the player'),
      text: this.player.translate('In multistream videos, the buttons on the video also affect the layout. Allowing you to make one video bigger than the other or even hide one of the vodeos.'),
      attachTo: {
        element: '.video-canvas .button-area',
        on: 'bottom'
      }
    });

    // Tour: Goodbye
    tour.addSteps([
      {
        title: this.player.translate('You\'re all set!'),
        text: this.player.translate('You\'ve reached the end of the tour.<br/><br/>Now you\'re ready to explore and use the Paella Player on your own.'),
        buttons: [
          {
            text: this.player.translate("Don't show again"),
            action: async () => {
              await this.player.preferences.set('onboarding_hideUI', true, { global: true });
              tour.complete();
            }
          },
          {
            text: this.player.translate('Back'),
            action: function () { this.back(); }
          },
          {
            text: this.player.translate('Done'),
            action: tour.complete
          }
        ]
      }
    ]);
  }

}