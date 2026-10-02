/**
 * 应用错误分类体系：所有失败路径统一产出 AppError，
 * 用户可依据 kind 与 suggestion 自行判断与修复。
 */
export const ERR_NETWORK: string = 'NETWORK';
export const ERR_AUTH: string = 'AUTH';
export const ERR_DESKTOP_OFFLINE: string = 'DESKTOP_OFFLINE';
export const ERR_BRIDGE: string = 'BRIDGE';
export const ERR_WORKSPACE_CLOSED: string = 'WORKSPACE_CLOSED';
export const ERR_TIMEOUT: string = 'TIMEOUT';
export const ERR_PARSE: string = 'PARSE';
export const ERR_NOT_CONNECTED: string = 'NOT_CONNECTED';
export const ERR_INVALID_INPUT: string = 'INVALID_INPUT';

export class AppError extends Error {
  /** 错误分类（上述 ERR_* 常量） */
  kind: string;
  /** 面向用户的一句建议（如何修复） */
  suggestion: string;

  constructor(kind: string, detail: string, suggestion: string) {
    super(detail);
    this.kind = kind;
    this.suggestion = suggestion;
  }

  /** 一行完整描述：分类 + 细节 + 建议 */
  display(): string {
    return `[${this.kind}] ${this.message}${this.suggestion.length > 0 ? '（' + this.suggestion + '）' : ''}`;
  }

  /** 把任意抛出值归一化为 AppError（未知错误归 OTHER 语义，保留原始信息） */
  static from(e: Object | undefined, fallbackDetail: string): AppError {
    if (e instanceof AppError) {
      return e as AppError;
    }
    if (e instanceof Error) {
      const msg = (e as Error).message;
      return new AppError(ERR_PARSE, msg.length > 0 ? msg : fallbackDetail, '请重试；若持续出现请附日志反馈');
    }
    return new AppError(ERR_PARSE, fallbackDetail, '请重试');
  }
}

/** 依据中继 error 帧的 code 产出分类错误（terminal 侧语义） */
export function appErrorFromRelayCode(code: string, message: string): AppError {
  if (code === 'AUTH_FAILED' || code === 'WRONG_PARAM') {
    return new AppError(ERR_AUTH, `凭证被中继拒绝（${code}）`, '桌面端可能已重置配对，请重新扫码绑定');
  }
  if (code === 'KICKED') {
    return new AppError(ERR_AUTH, '会话被顶掉', '其他终端正在使用该配对，或桌面端已重置配对；请重新打开 APP 或重新扫码');
  }
  if (code === 'DEVICE_OFFLINE') {
    return new AppError(ERR_DESKTOP_OFFLINE, '桌面端离线', '请确认电脑已开机、ZCode 正在运行且远程控制开关已打开');
  }
  return new AppError(ERR_NETWORK, `中继错误 ${code}${message.length > 0 ? ': ' + message : ''}`, '通常为服务端临时问题，稍候自动恢复');
}
