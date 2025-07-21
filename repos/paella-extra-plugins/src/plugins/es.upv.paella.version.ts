import PackagePluginModule from './PackagePluginModule';
import TableInfoPopUpPlugin, { type ContentTableInfo } from '../utils/TableInfoPopUpPlugin';
import TagIcon from '../icons/tag.svg?raw';



export default class VersionPlugin extends TableInfoPopUpPlugin {
  getPluginModuleInstance() {
    return PackagePluginModule.Get();
  }

  get name() {
    return super.name || 'es.upv.paella.version';
  }

  getAriaLabel() {
    return this.player.translate('Paella player version');
  }

  getDescription() {
    return this.getAriaLabel();
  }

  async getHelp() {
    return {
      title: this.player.translate('Version Information'),
      description: this.player.translate('View the version details of the player and its components.')
    };
  }

  async load() {
    this.icon = this.player.getCustomPluginIcon(this.name, 'buttonIcon') || TagIcon;
  }

  async getContentTableInfo(): Promise<ContentTableInfo> {
    const coreVersion = this.player.pluginModules.find((p) => p.moduleName.startsWith('paella-core'))?.moduleVersion || this.player.translate('unknown');
    const modulesVersions = this.player.pluginModules
      .filter((p) => !p.moduleName.startsWith('paella-core'))
      .sort((a,b) => a.moduleName.localeCompare(b.moduleName))
      .map((p) => ({
        key: p.moduleName, value: p.moduleVersion
      }))

    return {      
      table: [
        {
          category: this.player.translate('Paella Player'),
          rows: [
            { key: this.player.translate('Player'), value: this.player.version },
            { key: this.player.translate('Paella core'), value: coreVersion },
          ],
        },
        {
          category: this.player.translate('Paella Modules'),
          rows: [            
            ...modulesVersions,
          ],
        },
      ],
    };
  }
}
