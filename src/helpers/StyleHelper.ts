
import type { ElementInterface, SectionInterface } from "./Interfaces";

export class StyleHelper {

  static getTextColor = (textColor:string, globalStyles:any, churchSettings:any) => {
    if (!textColor) textColor = "#FFF";
    if (textColor.indexOf("var(--") > -1) {
      if (globalStyles.palette) {
        const palette = JSON.parse(globalStyles.palette);
        textColor = textColor.replace("var(--", "").replace(")", "");
        textColor = palette[textColor];
      } else {
        textColor="light";
        if (textColor.indexOf("dark")>-1 || textColor.indexOf("darkAccent")>-1 || textColor.indexOf("accent")>-1) textColor="dark";
      }
      if (!textColor) textColor = "#FFF";
    }
    return textColor;
  };

  private static getStyle = (id:string, styles:any): string | undefined => {
    const result:string[] = [];
    Object.keys(styles).forEach((key:string) => {
      const val = styles[key];
      const noQuote = val.endsWith("px") || val.endsWith("em") || val.endsWith("pt") || val.startsWith("#") || val.startsWith("--");
      if (noQuote) result.push(`${key}: ${styles[key]};`);
      else result.push(`${key}: ${styles[key]};`);
    });
    if (result.length > 0) return `#${id} { ${result.join(" ")} }`;
    return undefined;
  };

  private static getSectionCss = (section:SectionInterface, all:string[], desktop:string[], mobile:string[]) => {
    const id = (section.answers?.sectionId) ? "section-" + section.answers?.sectionId : "section-" + section.id;
    if (id==="section-undefined") return;

    if (section.styles?.all) {
      const style = this.getStyle(id, section.styles.all);
      if (style) all.push(style);
    }
    if (section.styles?.desktop) {
      const style = this.getStyle(id, section.styles.desktop);
      if (style) desktop.push(style);
    }
    if (section.styles?.mobile) {
      const style = this.getStyle(id, section.styles.mobile);
      if (style) mobile.push(style);
    }
  };

  private static getElementCss = (element:ElementInterface, all:string[], desktop:string[], mobile:string[]) => {
    if (element.styles?.all) {
      const style = this.getStyle("el-" + element.id, element.styles.all);
      if (style) all.push(style);
    }
    if (element.styles?.desktop) {
      const style = this.getStyle("el-" + element.id, element.styles.desktop);
      if (style) desktop.push(style);
    }
    if (element.styles?.mobile) {
      const style = this.getStyle("el-" + element.id, element.styles.mobile);
      if (style) mobile.push(style);
    }
    if (element.elements?.length > 0) {
      element.elements.forEach((e:ElementInterface) => this.getElementCss(e, all, desktop, mobile));
    }
  };

  static getAllStyles = (sections: SectionInterface[]) => {
    const all:string[] = [];
    const desktop:string[] = [];
    const mobile:string[] = [];

    sections?.forEach((section:SectionInterface) => {
      this.getSectionCss(section, all, desktop, mobile);
      section.elements?.forEach((element:ElementInterface) => {
        this.getElementCss(element, all, desktop, mobile);
      });
    });

    return { all, desktop, mobile };
  };

  static getCss = (sections: SectionInterface[], forceDevice?:string) => {
    const { all, desktop, mobile } = this.getAllStyles(sections);
    if (forceDevice === "desktop") return all.join("\n") + "\n" + desktop.join("\n");
    else if (forceDevice === "mobile") return all.join("\n") + "\n" + mobile.join("\n");
    else {
      return `
      ${all.join("\n")}
      @media (min-width: 768px) {
        ${desktop.join("\n")}
      }
      @media (max-width: 767px) {
        ${mobile.join("\n")}
      }`;
    }
  };


  static getStyles = (element: ElementInterface | SectionInterface) => {
    const result:any = {};
    return result;
  };

}
