import MenuButtonPlugin from 'paella-core/core/MenuButtonPlugin';
import TestPluginModule from './TestPluginModule';

const ovenIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M3 6m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" />
  <path d="M15 6v12" />
  <path d="M18 12h.01" />
  <path d="M18 15h.01" />
  <path d="M18 9h.01" />
  <path d="M6.5 10.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0" />
  <path d="M6.5 13.5c1 -.667 1.5 -.667 2.5 0c.833 .347 1.667 .926 2.5 0" />
</svg>`;

const fishIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571" />
  <path d="M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504" />
  <path d="M18 11v.01" />
  <path d="M11.5 10.5c-.667 1 -.667 2 0 3" />
</svg>`;

const shrimpIcon = 
`<svg width="44" height="44" viewBox="0 0 44 44" version="1.1" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"  stroke-width="2.5" fill="none">
    <path d="M25.597,30.079L20.981,35.055C20.981,35.055 20.239,37.223 22,39.961C23.761,42.698 24.009,42.032 24.009,42.032C24.009,42.032 28.947,37.594 29.602,36.609C30.257,35.624 30.435,34.324 30.335,32.917C30.236,31.511 30.092,31.469 30.092,31.469" />
    <path d="M5.131,1.737C5.131,1.737 5.028,6.587 11.368,6.422C17.707,6.256 19.704,6.194 22,6.346C24.296,6.497 27.984,6.849 31.926,10.469C35.867,14.089 36.744,19.682 36,23.33C35.257,26.977 33.66,30.371 30.212,31.31C27.59,32.024 25.369,30.243 24.896,28.35C24.424,26.456 25.413,23.577 24.792,21.68C24.153,19.727 23.171,19.26 20.981,19.226C18.791,19.193 17.065,19.449 14.905,19.038C12.745,18.628 11.134,16.921 10.652,15.891C10.17,14.86 9.616,13.059 9.893,11.712C10.169,10.366 10.66,9.121 12.009,8.019C13.358,6.918 14.725,6.239 16.199,6.3" />
    <path d="M5.131,12.423L9.521,12.423" />
    <ellipse cx="16.176" cy="12.406" rx="1.598" ry="1.611" />
    <path d="M27.401,7.469C27.401,7.469 28.301,10.357 27.322,14.053C26.343,17.748 23.416,19.444 23.416,19.444" />
    <g transform="matrix(0.556914,0.83057,-0.83057,0.556914,27.0362,-7.94886)">
        <path d="M27.795,7.733C27.795,7.733 28.089,9.65 27.11,13.345C26.131,17.041 24.156,18.461 24.156,18.461" />
    </g>
    <path d="M24.75,25.644C24.75,25.644 22.716,25.349 21.576,25.63C20.436,25.912 19.149,26.579 17.674,28.011C16.198,29.443 14.09,31.978 14.09,31.978C14.09,31.978 15.623,34.053 17.725,34.617C19.449,35.079 21.366,34.653 21.366,34.653" />
</svg>`;

const bowlIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1z" />
  <path d="M12 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M16 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
  <path d="M8 4a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
</svg>`;

const paellaIcon = `
<svg width="100%" height="100%" viewBox="0 0 44 44" version="1.1" stroke-width="2.0" fill="none">
    <g transform="matrix(0.983164,0,0,0.995663,0.255715,0.023346)" stroke-width="2.0">
        <circle cx="22.132" cy="22.072" r="15.929" />
    </g>
    <g transform="matrix(1,0,0,1,-0.23504,-0.817034)">
        <path d="M7.022,19.035C7.022,19.035 2.232,17.866 2.211,22.886C2.193,27.13 6.966,26.251 6.966,26.251" />
    </g>
    <g transform="matrix(-1,-1.22465e-16,1.22465e-16,-1,44.235,44.6905)">
        <path d="M7.022,19.035C7.022,19.035 2.232,17.866 2.211,22.886C2.193,27.13 6.966,26.251 6.966,26.251" stroke-width="2.0"/>
    </g>
    <g transform="matrix(1.72144,-0.500494,0.500494,1.72144,-17.236,-1.91969)">
        <path d="M18.488,16.121C18.488,16.121 19.008,17.111 19.13,18.418C19.252,19.725 20.131,20.589 20.888,20.583C21.646,20.576 23.378,19.965 23.272,18.405C23.166,16.844 22.105,16.719 21.26,16.152C20.416,15.584 19.77,15.207 19.77,15.207L18.488,16.121Z" stroke-width="0.8" />
    </g>
    <g transform="matrix(1.72144,-0.500494,0.500494,1.72144,-17.236,-1.91969)">
        <path d="M17.596,13.237C17.596,13.237 17.642,12.656 18.215,12.665C18.788,12.674 18.71,13.357 18.653,13.876C18.602,14.337 19.404,15.468 19.404,15.468L18.845,15.867C18.845,15.867 18.044,14.572 17.334,14.446C16.623,14.319 15.871,14.268 16.268,13.596C16.665,12.925 17.596,13.237 17.596,13.237Z" stroke-width="0.8"/>
    </g>
    <g transform="matrix(1,0,0,1,1.06785,-0.949096)">
        <path d="M14.4,21.048C14.235,20.382 15.138,19.979 14.668,18.726C14.348,17.872 12.465,17.991 12.074,19.181C11.684,20.371 11.569,22.26 12.781,23.21C13.969,24.14 15.042,23.399 15.191,22.886C15.454,21.984 14.558,21.874 14.4,21.048Z" stroke-width="1.0" />
    </g>
    <g transform="matrix(0.0828765,-0.99656,0.99656,0.0828765,2.89575,42.2445)">
        <path d="M14.4,21.048C14.235,20.382 15.138,19.979 14.668,18.726C14.348,17.872 12.465,17.991 12.074,19.181C11.684,20.371 11.569,22.26 12.781,23.21C13.969,24.14 15.042,23.399 15.191,22.886C15.454,21.984 14.558,21.874 14.4,21.048Z" stroke-width="1.0" />
    </g>
    <g transform="matrix(1,0,0,1,-0.208628,0.607723)">
        <path d="M13.082,26.591L13.522,28.785L18.509,27.875L18.189,25.494L13.082,26.591Z" stroke-width="1.0"/>
    </g>
</svg>`;

const States = Object.freeze({
    Fish: "fish",
    Shrimp: "shrimp"
});

const getStateIcon = state => state === States.Fish ? fishIcon : shrimpIcon;
const getStateText = state => state === States.Fish ? "Fish" : "Shrimp";

export default class TestMenuButtonPlugin extends MenuButtonPlugin {
    getPluginModuleInstance() {
        return TestPluginModule.Get();
    }

    get name() {
        return 'es.upv.paella.testMenuButtonPlugin';
    }

    async load() {
        this.icon = `
        <svg width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
            <polyline points="12 12 12 16 14 16" />
        </svg>`;

        this._items = [
            { id: 0, title: "Paella Valenciana", icon: paellaIcon, state: States.Fish, stateIcon: getStateIcon(States.Fish), stateText: getStateText(States.Fish) },
            { id: 1, title: "Arroz Senyoret", icon: fishIcon, state: States.Fish, stateIcon: getStateIcon(States.Fish) },
            { id: 2, title: "Arroz al Horno", icon: ovenIcon, state: States.Shrimp, stateIcon: getStateIcon(States.Shrimp) },
            { id: 3, title: "Arroz Meloso con Bogavante", icon: bowlIcon, state: States.Fish, stateText: getStateText(States.Fish) },
            { id: 4, title: "Arroz a Banda", icon: shrimpIcon, state: States.Shrimp, stateText: getStateText(States.Shrimp) }
        ]
    }

    buttonType() {
        return "button";
    }

    get menuTitle() {
        return "Test Menu";
    }

    async getMenu() {
        return this._items;
    }

    itemSelected(itemData, menuItems) {
        itemData.state = itemData.state === States.Fish ? States.Shrimp : States.Fish;
        if ([0, 3, 4].includes(itemData.id)) {
            itemData.stateText = getStateText(itemData.state);
        }
        if ([0, 1, 2].includes(itemData.id)) {
            itemData.stateIcon = getStateIcon(itemData.state);
        }
        this.refreshContent = true;
    }
}

