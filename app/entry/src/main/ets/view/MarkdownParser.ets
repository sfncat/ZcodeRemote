/**
 * 轻量 Markdown 结构化渲染（对齐 ZCode 网页端的表现）
 * 支持: 标题(h1-h4) / 无序+有序列表 / 代码块(围栏) / 行内代码 / 加粗 / 斜体 / 链接 / 引用块 / 分隔线 / 表格(等宽呈现)
 */

export class MdBlock {
  static readonly K_PARA: string = 'para';
  static readonly K_HEADING: string = 'heading';
  static readonly K_CODE: string = 'code';
  static readonly K_QUOTE: string = 'quote';
  static readonly K_UL: string = 'ul';
  static readonly K_OL: string = 'ol';
  static readonly K_HR: string = 'hr';
  static readonly K_TABLE: string = 'table';

  kind: string = MdBlock.K_PARA;
  /** 标题级别 1-4（K_HEADING 有效） */
  level: number = 0;
  /** 段落/标题/引用文本（行内标记待二次解析） */
  text: string = '';
  /** 代码块语言 */
  lang: string = '';
  /** 列表项（K_UL/K_OL）/ 表格行（K_TABLE，每行单元格以 \t 分隔） */
  items: Array<string> = new Array<string>();
}

/** ArkUI ForEach 分支判断用的块类型常量（类静态字段在比较表达式中受限） */
export const MdBlockKinds: Record<string, string> = {
  'PARA': 'para',
  'HEADING': 'heading',
  'CODE': 'code',
  'QUOTE': 'quote',
  'UL': 'ul',
  'OL': 'ol',
  'HR': 'hr',
  'TABLE': 'table'
};

export class MdSpan {
  text: string = '';
  bold: boolean = false;
  italic: boolean = false;
  code: boolean = false;
  link: boolean = false;
}

/** 解析 markdown 文本为块列表 */
export function parseMarkdown(src: string): Array<MdBlock> {
  const blocks: Array<MdBlock> = [];
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  let para = '';
  const flushPara = () => {
    if (para.trim().length > 0) {
      const b = new MdBlock();
      b.kind = MdBlock.K_PARA;
      b.text = para.trim();
      blocks.push(b);
    }
    para = '';
  };
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    // 代码围栏
    if (trimmed.startsWith('```')) {
      flushPara();
      const b = new MdBlock();
      b.kind = MdBlock.K_CODE;
      b.lang = trimmed.substring(3).trim();
      i += 1;
      const codeLines: Array<string> = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // 跳过闭合围栏
      b.text = codeLines.join('\n');
      blocks.push(b);
      continue;
    }
    // 表格: |a|b| 至少两行且第二行是分隔
    if (trimmed.startsWith('|') && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      flushPara();
      const b = new MdBlock();
      b.kind = MdBlock.K_TABLE;
      const rows: Array<string> = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i].trim();
        if (!/^\|[\s:|-]+\|$/.test(row)) {
          const cells = row.split('|').slice(1, -1).map(c => c.trim());
          rows.push(cells.join('\t'));
        }
        i += 1;
      }
      b.items = rows;
      blocks.push(b);
      continue;
    }
    // 标题
    const h = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (h !== null) {
      flushPara();
      const b = new MdBlock();
      b.kind = MdBlock.K_HEADING;
      b.level = Math.min(4, h[1].length);
      b.text = h[2];
      blocks.push(b);
      i += 1;
      continue;
    }
    // 分隔线
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushPara();
      const b = new MdBlock();
      b.kind = MdBlock.K_HR;
      blocks.push(b);
      i += 1;
      continue;
    }
    // 引用块
    if (trimmed.startsWith('>')) {
      flushPara();
      const b = new MdBlock();
      b.kind = MdBlock.K_QUOTE;
      const q: Array<string> = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        q.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      b.text = q.join('\n');
      blocks.push(b);
      continue;
    }
    // 无序列表
    if (/^[-*+]\s+/.test(trimmed)) {
      flushPara();
      const b = new MdBlock();
      b.kind = MdBlock.K_UL;
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        b.items.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
        i += 1;
      }
      blocks.push(b);
      continue;
    }
    // 有序列表
    if (/^\d+[.)]\s+/.test(trimmed)) {
      flushPara();
      const b = new MdBlock();
      b.kind = MdBlock.K_OL;
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        b.items.push(lines[i].trim());
        i += 1;
      }
      blocks.push(b);
      continue;
    }
    // 空行结束段落
    if (trimmed.length === 0) {
      flushPara();
      i += 1;
      continue;
    }
    para += (para.length > 0 ? '\n' : '') + line;
    i += 1;
  }
  flushPara();
  return blocks;
}

/**
 * 行内解析: `code`、**bold**、*italic*、[text](url)
 * 输出为顺序 span 列表
 */
export function parseInline(text: string): Array<MdSpan> {
  const spans: Array<MdSpan> = [];
  let plain = '';
  const pushPlain = () => {
    if (plain.length > 0) {
      const s = new MdSpan();
      s.text = plain;
      spans.push(s);
      plain = '';
    }
  };
  let i = 0;
  while (i < text.length) {
    // 行内代码
    if (text.charAt(i) === '`') {
      const end = text.indexOf('`', i + 1);
      if (end > i) {
        pushPlain();
        const s = new MdSpan();
        s.text = text.substring(i + 1, end);
        s.code = true;
        spans.push(s);
        i = end + 1;
        continue;
      }
    }
    // 加粗 **…**
    if (text.charAt(i) === '*' && i + 1 < text.length && text.charAt(i + 1) === '*') {
      const end = text.indexOf('**', i + 2);
      if (end > i + 1) {
        pushPlain();
        const s = new MdSpan();
        s.text = text.substring(i + 2, end);
        s.bold = true;
        spans.push(s);
        i = end + 2;
        continue;
      }
    }
    // 链接 [t](u)
    if (text.charAt(i) === '[') {
      const close = text.indexOf('](', i + 1);
      if (close > i) {
        const urlEnd = text.indexOf(')', close + 2);
        if (urlEnd > close) {
          pushPlain();
          const s = new MdSpan();
          s.text = text.substring(i + 1, close);
          s.link = true;
          spans.push(s);
          i = urlEnd + 1;
          continue;
        }
      }
    }
    // 斜体 *…*（不成对的 * 当普通字符）
    if (text.charAt(i) === '*') {
      const end = text.indexOf('*', i + 1);
      if (end > i && text.charAt(i + 1) !== '*' && text.charAt(end - 1) !== '*' && end !== i + 1) {
        pushPlain();
        const s = new MdSpan();
        s.text = text.substring(i + 1, end);
        s.italic = true;
        spans.push(s);
        i = end + 1;
        continue;
      }
    }
    plain += text.charAt(i);
    i += 1;
  }
  pushPlain();
  return spans;
}
