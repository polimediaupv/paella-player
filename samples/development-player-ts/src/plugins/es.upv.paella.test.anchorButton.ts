import { ButtonPlugin, PluginModule } from "@asicupv/paella-core";
import TestPlayerPluginModule from "./TestPlayerPluginModule";

export default class AnchorButtonTestPlugin extends ButtonPlugin {
    getPluginModuleInstance(): PluginModule {
        return TestPlayerPluginModule.get();
    }

    get name() {
        return "es.upv.paella.test.anchorButton";
    }

    async load() {
        this.icon = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M20.945 11a9 9 0 1 1 -3.284 -5.997l-2.655 2.392a5.5 5.5 0 1 0 2.119 6.605h-4.125v-3h7.945z" />
</svg>
`;
    }

    async getAnchorUrl() {
        return "https://www.google.com/es";
    }
}

