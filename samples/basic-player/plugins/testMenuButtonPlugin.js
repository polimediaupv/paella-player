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

const chikenIcon = `
<svg width="100%" height="100%" viewBox="0 0 44 44" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <g transform="matrix(1.15246,0,0,1.21348,-5.89881,-0.469805)">
        <path d="M17.431,18.327L23.139,24.337C23.139,24.337 25.643,22.076 29.341,21.328C37.098,19.758 42.627,15.883 41.745,10.252C40.932,5.059 37.039,0.893 29.883,2.234C24.177,3.302 21.868,9.835 20.508,12.871C19.147,15.907 17.431,18.327 17.431,18.327Z" style="fill:none;stroke-width:2.11px;"/>
    </g>
    <g transform="matrix(1.15246,0,0,1.21348,-5.51104,0.377499)">
        <path d="M18.681,19.759C18.681,19.759 12.813,25.016 11.758,25.523C10.702,26.03 7.233,24.239 6.363,26.626C5.492,29.014 9.63,29.581 9.63,29.581C9.63,29.581 7.975,32.238 9.321,33.166C12.01,35.022 13.425,29.553 13.762,28.541C14.099,27.53 21.015,22 21.015,22" style="fill:none;stroke-width:2.11px;"/>
    </g>
</svg>
`;

const rabbitIcon = `
<svg width="100%" height="100%" viewBox="0 0 44 44" version="1.1" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <g transform="matrix(1.36572,0,0,1.36572,-9.48465,-2.77029)">
        <path d="M23.971,14.274C23.971,14.274 21.352,12.896 18.647,13.051C14.622,13.282 9.704,17.817 9.074,20.397C8.485,22.81 8.852,24.755 10.725,26.047C13.341,27.852 17.436,27.799 19.856,27.237C22.277,26.675 24.41,24.308 24.764,22.751C25.118,21.194 25.06,18.973 25.06,18.973C25.06,18.973 28.885,18.529 31.509,17.466C34.791,16.137 37.808,14.252 37.216,12.226C36.556,9.967 31.911,10.531 29.885,11.392C27.859,12.253 23.971,14.274 23.971,14.274Z" style="fill:none;stroke-width:1.83px;"/>
    </g>
    <g transform="matrix(1.36572,0,0,1.36572,-9.48465,-2.77029)">
        <path d="M23.289,13.477C22.083,12.939 28.505,7.889 31.292,8.801C33.357,9.477 33.484,10.637 33.484,10.637" style="fill:none;stroke-width:1.46px;"/>
    </g>
    <g transform="matrix(1.36572,0,0,1.36572,-9.48465,-2.77029)">
        <ellipse cx="16.505" cy="19.48" rx="0.924" ry="0.918" style="fill:rgb(235,235,235);stroke-width:1.1px;"/>
    </g>
</svg>
`;

const FishStates = Object.freeze({
    Fish: "fish",
    Shrimp: "shrimp"
});

const getStateIcon = state => state === FishStates.Fish ? fishIcon : shrimpIcon;
const getStateText = state => state === FishStates.Fish ? "Fish" : "Shrimp";

const MeatStates = Object.freeze({
    Chicken: "chicken",
    Rabbit: "rabbit"
});

const getMeatStateIcon = state => state === MeatStates.Chicken ? chikenIcon : rabbitIcon;
const getMeatStateText = state => state === MeatStates.Chicken ? "Chicken" : "Rabbit";

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
            { id: 0, title: "Paella Valenciana", icon: paellaIcon, state: MeatStates.Chicken, stateIcon: getMeatStateIcon(MeatStates.Chicken), stateText: getMeatStateText(MeatStates.Chicken) },
            { id: 1, title: "Arroz Senyoret", icon: fishIcon, state: FishStates.Fish, stateIcon: getStateIcon(FishStates.Fish) },
            { id: 2, title: "Arroz al Horno", icon: ovenIcon, state: MeatStates.Chicken, stateIcon: getMeatStateIcon(MeatStates.Chicken) },
            { id: 3, title: "Arroz Meloso con Bogavante", icon: bowlIcon, state: FishStates.Fish, stateText: getStateText(FishStates.Fish) },
            { id: 4, title: "Arroz a Banda", icon: shrimpIcon, state: FishStates.Shrimp, stateText: getStateText(FishStates.Shrimp) }
        ]
    }

    buttonType() {
        return "button";
    }

    get menuTitle() {
        return super.menuTitle || "Test Menu";
    }

    async getMenu() {
        return this._items;
    }

    itemSelected(itemData, menuItems) {
        if ([0, 2].includes(itemData.id)) {
            // Meat
            itemData.state = itemData.state === MeatStates.Rabbit ? MeatStates.Chicken : MeatStates.Rabbit;
            if (itemData.id === 0) {
                itemData.stateText = getMeatStateText(itemData.state);
                itemData.stateIcon = getMeatStateIcon(itemData.state);
            }
            else {
                itemData.stateIcon = getMeatStateIcon(itemData.state);
            }
        }
        else {
            // Fish
            itemData.state = itemData.state === FishStates.Fish ? FishStates.Shrimp : FishStates.Fish;
            if ([0, 3, 4].includes(itemData.id)) {
                itemData.stateText = getStateText(itemData.state);
            }
            if ([0, 1, 2].includes(itemData.id)) {
                itemData.stateIcon = getStateIcon(itemData.state);
            }
        }
        this.refreshContent = true;
    }
}

