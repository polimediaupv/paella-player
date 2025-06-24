import { EventLogPlugin, Events } from '@asicupv/paella-core';
import Shepherd, { type Tour } from 'shepherd.js';
import PackagePluginModule from './PackagePluginModule';

import 'shepherd.js/dist/css/shepherd.css';
import '../styles/OnBoardingPlugin.css';


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
            text: 'Back',
            action: function () { this.back(); }
          },
          {
            text: 'Next',
            action: function () { this.next(); }
          }
        ]
      }
    });

    await this.generateTourSteps(tour);

    return tour;
  }


  async generateTourSteps(tour: Tour) {
    // Tour: Introduction
    tour.addSteps([
      {
        title: 'Welcome to paella player tutorial',
        text: 'The player displays two videos - the presenter and the presentation - along with some control options on the lower menu bar. <p/>You can begin viewing the lecture by pressing the play button on top of the video window or in the control bar.',
        buttons: [
          {
            text: 'Don\'t show again',
            action: async () => {
              await this.player.preferences.set('onboarding_hideUI', true, { global: true });
              tour.cancel();
            }
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      }
    ]);

    // Tour: Paella player Timeline
    tour.addStep({
      title: 'Paella player: Video navigation',
      text: 'This is the timeline. You can navigate to any time in the video by clicking the timeline.',
      attachTo: {
        element: '.playback-bar .progress-indicator',
        on: 'top'
      }
    });

    // Tour: Paella player toolbar buttons
    const buttons = this.player.playbackBar.getVisibleButtonPlugins();
    for await (const button of buttons) {
      // if ( button instanceof ButtonGroupPlugin) {
      //   button.showPopUp();
      //   console.log('Showing popup for button', button.name);        
      // }
      const help = await button.getTranslatedHelp()
      if (help != null) {
        tour.addStep({
          title: help.title,
          text: help.description,
          attachTo: {
            element: `li:has(>  button[name="${button.name}"])`,
            on: 'top'
          }
        })
      }
    }

    // Tour: Paella player video layout buttons on multistream videos
    tour.addStep({
      title: 'Paella player: Changing the layout of the player',
      text: 'In multistream videos, the buttons on the video also affect the layout. Allowing you to make one video bigger than the other or even hide one of the vodeos.',
      attachTo: {
        element: '.video-canvas .button-area',
        on: 'bottom'
      }
    });

    // Tour: Goodbye
    tour.addSteps([
      {
        title: 'Welcome to paella player tutorial',
        text: 'That\'s All Folks',
        buttons: [
          {
            text: 'Don\'t show again',
            action: async () => {
              await this.player.preferences.set('onboarding_hideUI', true, { global: true });
              tour.complete();
            }
          },
          {
            text: 'Done',
            action: tour.complete
          }
        ]
      }
    ]);
  }

}