
import ArrowSlides from './plugins/es.upv.paella.arrowSlidesNavigator';
import FrameControlButton from './plugins/es.upv.paella.frameControlButtonPlugin';
import NextSlideNavigatorButton from './plugins/es.upv.paella.nextSlideNavigatorButton';
import PrevSlideNavigatorButton from './plugins/es.upv.paella.prevSlideNavigatorButton';

import { nextSlide, getFrames, previousSlide, checkSlides } from './js/SlideNavigation';

export const slidePlugins = [
    {
        plugin: ArrowSlides,
        config: {
            enabled: false
        }
    },
    {
        plugin: FrameControlButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: NextSlideNavigatorButton,
        config: {
            enabled: false
        }
    },
    {
        plugin: PrevSlideNavigatorButton,
        config: {
            enabled: false
        }
    }
];

export const allPlugins = slidePlugins;

export const ArrowSlidesPlugin = ArrowSlides
export const FrameControlButtonPlugin = FrameControlButton
export const NextSlideNavigatorButtonPlugin = NextSlideNavigatorButton;
export const PrevSlideNavigatorButtonPlugin = PrevSlideNavigatorButton

export const utils = {
    nextSlide,
    previousSlide,
    checkSlides,
    getFrames
}
