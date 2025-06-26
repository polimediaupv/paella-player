import OnBoarding from './plugins/es.upv.paella.onboarding.js';

export const onboardingPlugins = [
    {
        plugin: OnBoarding,
        config: {
            enabled: true
        },
    }
];


export const OnBoardingPlugin = OnBoarding;