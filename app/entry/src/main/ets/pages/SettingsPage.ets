import { promptAction, router } from '@kit.ArkUI';
import { ConfigurationConstant } from '@kit.AbilityKit';
import { common } from '@kit.AbilityKit';
import { ZcodeService } from '../service/ZcodeService';
import { BindingStore } from '../store/BindingStore';

@Entry
@Component
struct SettingsPage {
  @State deviceName: string = '';
  @State sidSuffix: string = '';
  @State desktopVersion: string = '';
  @State connState: string = '';
  @State colorModePref: string = 'system';
  @State endpoint: string = 'wss://zcode.z.ai/ws';
  private service: ZcodeService = ZcodeService.getInstance();
  private listener: (() => void) | undefined = undefined;
  @StorageProp('statusBarHeight') statusBarHeight: number = 0;
  @StorageProp('navBarHeight') navBarHeight: number = 0;

  aboutToAppear(): void {
    this.refresh();
    this.colorModePref = BindingStore.getColorModePref(getContext(this) as common.UIAbilityContext);
    const b = this.service.binding;
    this.endpoint = b !== undefined ? b.relayWsUrl : 'wss://zcode.z.ai/ws';
    this.listener = () => {
      this.refresh();
    };
    this.service.addListener(this.listener);
  }

  aboutToDisappear(): void {
    if (this.listener !== undefined) {
      this.service.removeListener(this.listener);
      this.listener = undefined;
    }
  }

  private refresh(): void {
    const b = this.service.binding;
    this.deviceName = b !== undefined ? b.deviceName : '';
    this.sidSuffix = b !== undefined && b.deviceSid.length > 6
      ? b.deviceSid.substring(b.deviceSid.length - 6) : '';
    this.desktopVersion = this.service.desktopAppVersion;
    this.connState = this.service.connState;
  }

  private applyColorMode(pref: string): void {
    this.colorModePref = pref;
    BindingStore.setColorModePref(getContext(this) as common.UIAbilityContext, pref);
    const appCtx = (getContext(this) as common.UIAbilityContext).getApplicationContext();
    if (pref === 'light') {
      appCtx.setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT);
    } else if (pref === 'dark') {
      appCtx.setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_DARK);
    } else {
      appCtx.setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
    }
    promptAction.showToast({ message: this.modeLabel(pref), duration: 1200 });
  }

  private modeLabel(pref: string): string {
    if (pref === 'light') {
      return '日间模式';
    }
    if (pref === 'dark') {
      return '夜间模式';
    }
    return '跟随系统';
  }

  build() {
    Column() {
      Row({ space: 10 }) {
        Button() {
          Text('‹')
            .fontSize(20)
            .fontColor($r('app.color.text_primary'))
        }
        .width(40)
        .height(36)
        .backgroundColor($r('app.color.btn_secondary_bg'))
        .onClick(() => {
          router.back();
        })
        Text('设置')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
          .layoutWeight(1)
      }
      .width('100%')
      .padding({ left: 12, right: 16, top: this.statusBarHeight + 10, bottom: 14 })

      Scroll() {
        Column({ space: 12 }) {
          // 绑定信息卡片
          Column({ space: 10 }) {
            Text('绑定信息')
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .width('100%')
            this.infoRow('设备名称', this.deviceName)
            this.infoRow('配对 ID 尾号', this.sidSuffix)
            this.infoRow('中继端点', this.endpoint)
            this.infoRow('桌面端版本', this.desktopVersion.length > 0 ? this.desktopVersion : '未知')
            this.infoRow('连接状态', this.stateLabel())
          }
          .padding(14)
          .borderRadius(12)
          .backgroundColor($r('app.color.bg_card'))
          .width('100%')

          // 外观卡片
          Column({ space: 10 }) {
            Text('外观')
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .width('100%')
            Row({ space: 8 }) {
              this.modeButton('system', '跟随系统')
              this.modeButton('light', '日间')
              this.modeButton('dark', '夜间')
            }
            .width('100%')
          }
          .padding(14)
          .borderRadius(12)
          .backgroundColor($r('app.color.bg_card'))
          .width('100%')

          Button('重新连接')
            .width('100%')
            .height(44)
            .backgroundColor($r('app.color.btn_secondary_bg'))
            .fontColor($r('app.color.text_primary'))
            .onClick(() => {
              this.service.startConnect();
              promptAction.showToast({ message: '正在重新连接', duration: 1500 });
            })

          Button('解绑此设备（重新扫码）')
            .width('100%')
            .height(44)
            .backgroundColor($r('app.color.btn_danger_bg'))
            .fontColor($r('app.color.btn_danger_text'))
            .onClick(() => {
              this.confirmUnbind();
            })

          Text('说明\n· 凭证保存在本机加密存储中，卸载应用后自动失效\n· 若桌面端"重置配对"，需重新扫码绑定\n· 数据经云端中继加密握手（HMAC 挑战-应答）转发')
            .fontSize(11)
            .fontColor($r('app.color.text_tertiary'))
            .width('100%')
            .lineHeight(18)
        }
        .padding(16)
      }
      .layoutWeight(1)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.bg_page'))

  }

  @Builder
  modeButton(pref: string, label: string) {
    Text(label)
      .fontSize(13)
      .fontColor(this.colorModePref === pref ? Color.White : $r('app.color.text_secondary'))
      .textAlign(TextAlign.Center)
      .height(34)
      .layoutWeight(1)
      .borderRadius(8)
      .backgroundColor(this.colorModePref === pref ? $r('app.color.accent') : $r('app.color.btn_secondary_bg'))
      .onClick(() => {
        this.applyColorMode(pref);
      })
  }

  private stateLabel(): string {
    if (this.connState === 'paired') {
      return '已连接';
    }
    if (this.connState === 'waiting') {
      return '等待桌面端开启远程控制';
    }
    if (this.connState === 'error') {
      return '错误（凭证可能已失效）';
    }
    return this.connState;
  }

  @Builder
  infoRow(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(13)
        .fontColor($r('app.color.text_secondary'))
        .width(110)
      Text(value.length > 0 ? value : '-')
        .fontSize(13)
        .fontColor($r('app.color.text_primary'))
        .layoutWeight(1)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
    }
    .width('100%')
  }

  private confirmUnbind(): void {
    promptAction.showDialog({
      title: '解绑确认',
      message: '解绑后需要重新扫码才能连接此电脑。确定解绑？',
      buttons: [
        { text: '取消', color: '#9AA1B5' },
        { text: '确定解绑', color: '#E5697A' }
      ]
    }).then((result) => {
      if (result.index === 1) {
        this.service.unbind().then(() => {
          router.back();
        }).catch((e: Error) => {
          promptAction.showToast({ message: '解绑失败: ' + e.message, duration: 2500 });
        });
      }
    });
  }
}
