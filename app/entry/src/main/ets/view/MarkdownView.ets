import { MdBlock, MdSpan, MdBlockKinds, parseMarkdown, parseInline } from './MarkdownParser';

/**
 * Markdown 结构化渲染组件:
 * 标题分级 / 列表 / 代码块(深底等宽) / 行内代码 / 加粗斜体 / 链接 / 引用块(左侧蓝条) / 分隔线 / 表格
 */
@Component
export struct MarkdownView {
  @Prop @Watch('onTextChange') text: string;
  @State private blocks: Array<MdBlock> = new Array<MdBlock>();

  aboutToAppear(): void {
    this.blocks = parseMarkdown(this.text);
  }

  onTextChange(): void {
    this.blocks = parseMarkdown(this.text);
  }

  private headingSize(level: number): number {
    if (level <= 1) {
      return 20;
    }
    if (level === 2) {
      return 17;
    }
    if (level === 3) {
      return 15;
    }
    return 14;
  }

  @Builder
  inlineText(body: string, baseSize: number, baseColor: ResourceColor, boldAll: boolean) {
    Text() {
      ForEach(parseInline(body), (sp: MdSpan) => {
        Span(sp.text)
          .fontSize(baseSize)
          .fontColor(sp.link ? $r('app.color.accent') : (sp.code ? $r('app.color.code_text') : baseColor))
          .fontWeight((sp.bold || boldAll) ? FontWeight.Bold : FontWeight.Normal)
          .fontStyle(sp.italic ? FontStyle.Italic : FontStyle.Normal)
          .decoration(sp.link ? { type: TextDecorationType.Underline } : { type: TextDecorationType.None })
      }, (sp: MdSpan, idx: number) => idx.toString() + '-' + sp.text.substring(0, 12))
    }
    .width('100%')
  }

  build() {
    Column({ space: 5 }) {
      ForEach(this.blocks, (b: MdBlock, idx: number) => {
        if (b.kind === MdBlockKinds.HEADING) {
          this.inlineText(b.text, this.headingSize(b.level), $r('app.color.text_primary'), true)
        } else if (b.kind === MdBlockKinds.PARA) {
          this.inlineText(b.text, 14, $r('app.color.text_primary'), false)
        } else if (b.kind === MdBlockKinds.QUOTE) {
          Row({ space: 8 }) {
            Rect({ width: 3, height: '100%' })
              .fill($r('app.color.accent'))
              .borderRadius(2)
            Column({ space: 6 }) {
              ForEach(b.text.split('\n'), (ln: string) => {
                this.inlineText(ln, 13, $r('app.color.text_secondary'), false)
              }, (ln: string, i: number) => i.toString() + ln.substring(0, 10))
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
          }
          .width('100%')
          .alignItems(VerticalAlign.Top)
          .padding({ left: 2, right: 8, top: 6, bottom: 6 })
          .borderRadius(6)
          .backgroundColor($r('app.color.bg_input'))
        } else if (b.kind === MdBlockKinds.CODE) {
          Column({ space: 4 }) {
            if (b.lang.length > 0) {
              Text(b.lang)
                .fontSize(10)
                .fontColor($r('app.color.text_tertiary'))
                .width('100%')
                .padding({ left: 10, top: 6 })
            }
            Text(b.text)
              .fontSize(12)
              .fontFamily('monospace')
              .fontColor($r('app.color.code_text'))
              .width('100%')
              .padding(10)
          }
          .borderRadius(8)
          .backgroundColor($r('app.color.bg_code'))
          .width('100%')
          .alignItems(HorizontalAlign.Start)
        } else if (b.kind === MdBlockKinds.UL || b.kind === MdBlockKinds.OL) {
          Column({ space: 4 }) {
            ForEach(b.items, (item: string, i: number) => {
              Row({ space: 6 }) {
                Text(b.kind === MdBlockKinds.UL ? '•' : `${i + 1}.`)
                  .fontSize(14)
                  .fontColor($r('app.color.accent'))
                  .width(b.kind === MdBlockKinds.UL ? 14 : 26)
                this.inlineText(item, 14, $r('app.color.text_primary'), false)
              }
              .width('100%')
              .alignItems(VerticalAlign.Top)
            }, (item: string, i: number) => i.toString() + '-' + item.substring(0, 12))
          }
          .width('100%')
          .alignItems(HorizontalAlign.Start)
          .padding({ left: 6 })
        } else if (b.kind === MdBlockKinds.HR) {
          Divider()
            .strokeWidth(1)
            .color($r('app.color.divider'))
            .width('100%')
        } else if (b.kind === MdBlockKinds.TABLE) {
          Column({ space: 2 }) {
            ForEach(b.items, (row: string, ri: number) => {
              Text(row.replace(/\t/g, '  |  '))
                .fontSize(12)
                .fontFamily('monospace')
                .fontColor(ri === 0 ? $r('app.color.text_primary') : $r('app.color.text_secondary'))
                .width('100%')
            }, (row: string, ri: number) => ri.toString() + row.substring(0, 10))
          }
          .width('100%')
          .padding(8)
          .borderRadius(8)
          .backgroundColor($r('app.color.bg_input'))
        }
      }, (b: MdBlock, idx: number) => idx.toString() + '-' + b.kind + '-' + b.text.substring(0, 16))
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }
}
