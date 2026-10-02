import { asset } from '@kit.AssetStoreKit';
import { common } from '@kit.AbilityKit';
import { preferences } from '@kit.ArkData';
import util from '@ohos.util';
import { BindingInfo } from '../model/Models';

/**
 * 绑定凭证存储:
 *  - passHash（配对密钥）存入系统加密资产库 AssetStoreKit
 *  - sid/mid/name 等非机密字段存 Preferences
 */
export class BindingStore {
  private static readonly PREF_NAME: string = 'zcode_binding';
  private static readonly KEY_SID: string = 'device_sid';
  private static readonly KEY_MID: string = 'device_mid';
  private static readonly KEY_NAME: string = 'device_name';
  private static readonly KEY_VER: string = 'app_version';
  private static readonly KEY_ORIGIN: string = 'endpoint_origin';
  private static readonly KEY_COLOR_MODE: string = 'color_mode_pref';
  private static readonly ASSET_ALIAS: string = 'zcode_pass_hash';

  private static enc(s: string): Uint8Array {
    return new util.TextEncoder().encodeInto(s);
  }

  private static dec(b: Uint8Array): string {
    return new util.TextDecoder('utf-8').decodeToString(b);
  }

  static async load(ctx: common.UIAbilityContext): Promise<BindingInfo | undefined> {
    const prefs = preferences.getPreferencesSync(ctx, { name: BindingStore.PREF_NAME });
    const sid = prefs.getSync(BindingStore.KEY_SID, '') as string;
    if (sid.length === 0) {
      return undefined;
    }
    const info = new BindingInfo();
    info.deviceSid = sid;
    info.deviceMid = prefs.getSync(BindingStore.KEY_MID, '') as string;
    info.deviceName = prefs.getSync(BindingStore.KEY_NAME, '我的电脑') as string;
    info.appVersion = prefs.getSync(BindingStore.KEY_VER, '3.14.4') as string;
    info.endpointOrigin = prefs.getSync(BindingStore.KEY_ORIGIN, 'https://zcode.z.ai') as string;
    try {
      const query: asset.AssetMap = new Map();
      query.set(asset.Tag.ALIAS, BindingStore.enc(BindingStore.ASSET_ALIAS));
      query.set(asset.Tag.RETURN_TYPE, asset.ReturnType.ALL);
      const results: Array<asset.AssetMap> = await asset.query(query);
      if (results.length === 0) {
        return undefined;
      }
      const secret = results[0].get(asset.Tag.SECRET);
      if (secret !== undefined && secret instanceof Uint8Array) {
        info.passHash = BindingStore.dec(secret as Uint8Array);
      }
    } catch (e) {
      // 资产不存在 → 未完整绑定
      return undefined;
    }
    if (info.passHash.length === 0) {
      return undefined;
    }
    return info;
  }

  static async save(ctx: common.UIAbilityContext, info: BindingInfo): Promise<void> {
    const prefs = preferences.getPreferencesSync(ctx, { name: BindingStore.PREF_NAME });
    prefs.putSync(BindingStore.KEY_SID, info.deviceSid);
    prefs.putSync(BindingStore.KEY_MID, info.deviceMid);
    prefs.putSync(BindingStore.KEY_NAME, info.deviceName);
    prefs.putSync(BindingStore.KEY_VER, info.appVersion);
    prefs.putSync(BindingStore.KEY_ORIGIN, info.endpointOrigin);
    await prefs.flush();
    // 覆盖旧密钥
    try {
      const rm: asset.AssetMap = new Map();
      rm.set(asset.Tag.ALIAS, BindingStore.enc(BindingStore.ASSET_ALIAS));
      await asset.remove(rm);
    } catch (e) {
      // 不存在则忽略
    }
    const attrs: asset.AssetMap = new Map();
    attrs.set(asset.Tag.SECRET, BindingStore.enc(info.passHash));
    attrs.set(asset.Tag.ALIAS, BindingStore.enc(BindingStore.ASSET_ALIAS));
    await asset.add(attrs);
  }

  static async clear(ctx: common.UIAbilityContext): Promise<void> {
    const prefs = preferences.getPreferencesSync(ctx, { name: BindingStore.PREF_NAME });
    await prefs.clear();
    try {
      const rm: asset.AssetMap = new Map();
      rm.set(asset.Tag.ALIAS, BindingStore.enc(BindingStore.ASSET_ALIAS));
      await asset.remove(rm);
    } catch (e) {
      // ignore
    }
  }

  /** 外观偏好: 'system' | 'light' | 'dark' */
  static getColorModePref(ctx: common.UIAbilityContext): string {
    const prefs = preferences.getPreferencesSync(ctx, { name: BindingStore.PREF_NAME });
    const v = prefs.getSync(BindingStore.KEY_COLOR_MODE, 'system') as string;
    return v.length > 0 ? v : 'system';
  }

  static setColorModePref(ctx: common.UIAbilityContext, pref: string): void {
    const prefs = preferences.getPreferencesSync(ctx, { name: BindingStore.PREF_NAME });
    prefs.putSync(BindingStore.KEY_COLOR_MODE, pref);
    prefs.flush();
  }
}
