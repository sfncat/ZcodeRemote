/**
 * JSON 防御式读取助手（对齐 ZCode 中继/快照的可选字段）
 */

export function asRec(v: Object | undefined | null): Record<string, Object> | undefined {
  if (v === undefined || v === null) {
    return undefined;
  }
  if (typeof v !== 'object' || Array.isArray(v)) {
    return undefined;
  }
  return v as Record<string, Object>;
}

export function parseObj(text: string): Record<string, Object> | undefined {
  try {
    return asRec(JSON.parse(text) as Object);
  } catch (e) {
    return undefined;
  }
}

export function jStr(o: Record<string, Object> | undefined, k: string): string {
  if (o === undefined) {
    return '';
  }
  const v: Object | undefined = o[k];
  return typeof v === 'string' ? v as string : '';
}

export function jNum(o: Record<string, Object> | undefined, k: string): number {
  if (o === undefined) {
    return 0;
  }
  const v: Object | undefined = o[k];
  return typeof v === 'number' ? v as number : 0;
}

export function jBool(o: Record<string, Object> | undefined, k: string): boolean {
  if (o === undefined) {
    return false;
  }
  const v: Object | undefined = o[k];
  return typeof v === 'boolean' ? v as boolean : false;
}

export function jArr(o: Record<string, Object> | undefined, k: string): Array<Object> {
  if (o === undefined) {
    return [];
  }
  const v: Object | undefined = o[k];
  if (Array.isArray(v)) {
    return v as Array<Object>;
  }
  return [];
}

export function jRec(o: Record<string, Object> | undefined, k: string): Record<string, Object> | undefined {
  if (o === undefined) {
    return undefined;
  }
  return asRec(o[k]);
}
