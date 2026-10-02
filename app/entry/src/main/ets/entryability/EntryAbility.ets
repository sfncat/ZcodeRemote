import { UIAbility, Configuration, ConfigurationConstant, errorManager } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { ZcodeService } from '../service/ZcodeService';
import { BindingStore } from '../store/BindingStore';

const TAG: string = 'ZCRemote';

export default class EntryAbility extends UIAbility {
  private errorListenerId: number = -1;

  onCreate(): void {
    hilog.info(0x0000, TAG, 'onCreate');
    ZcodeService.getInstance().setContext(this.context);
    // 全局未捕获异常兜底：记录日志，避免静默崩溃无从排查
    try {
      const observer: errorManager.ErrorObserver = {
        onUnhandledException(errMsg: string) {
          hilog.error(0x0000, TAG, '[global] uncaught exception: %{public}s', errMsg);
        }
      };
      this.errorListenerId = errorManager.on('error', observer);
    } catch (e) {
      hilog.warn(0x0000, TAG, 'register error observer failed');
    }
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent('pages/Index', (err) => {
      if (err.code !== 0) {
        hilog.error(0x0000, TAG, 'loadContent failed: %{public}s', JSON.stringify(err));
        return;
      }
      this.applyColorModePreference();
      this.updateSystemBar();
      ZcodeService.getInstance().initialize().catch((e: Error) => {
        hilog.error(0x0000, TAG, 'initialize failed: %{public}s', e.message);
      });
    });
  }

  onConfigurationUpdate(newConfig: Configuration): void {
    hilog.info(0x0000, TAG, 'onConfigurationUpdate colorMode=%{public}d', newConfig.colorMode as number);
    this.updateSystemBar();
  }

  /** 应用保存的外观偏好（system/light/dark） */
  private applyColorModePreference(): void {
    const pref = BindingStore.getColorModePref(this.context);
    const appCtx = this.context.getApplicationContext();
    if (pref === 'light') {
      appCtx.setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT);
    } else if (pref === 'dark') {
      appCtx.setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_DARK);
    } else {
      appCtx.setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
    }
  }

  /** 系统栏（状态栏/导航条）前景色跟随当前生效的深浅模式 */
  private updateSystemBar(): void {
    try {
      const win = window.getLastWindow(this.context);
      win.then((w: window.Window) => {
        const isDark = this.currentEffectiveDark();
        w.setWindowSystemBarProperties({
          statusBarContentColor: isDark ? '#FFFFFF' : '#1A1C24',
          navigationBarContentColor: isDark ? '#FFFFFF' : '#1A1C24'
        });
      }).catch((e: Error) => {
        hilog.warn(0x0000, TAG, 'getLastWindow failed: %{public}s', (e as Error).message);
      });
    } catch (e) {
      hilog.warn(0x0000, TAG, 'updateSystemBar exception');
    }
  }

  private currentEffectiveDark(): boolean {
    const config = this.context.resourceManager.getConfigurationSync();
    return (config.colorMode as number) === (ConfigurationConstant.ColorMode.COLOR_MODE_DARK as number);
  }
}
