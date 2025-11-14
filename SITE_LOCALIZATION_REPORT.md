# Site Module Localization Report
## Date: 2025-11-13

## Summary
**Total Files Checked:** 51 TSX files
**Files with Hardcoded Strings:** 28 files
**Total Hardcoded Strings Found:** 150+
**Status:** Many hardcoded English strings need localization

---

## Files Requiring Localization

### 1. **D:\Code\ChurchApps\B1Admin\src\site\admin\ColorPicker.tsx**
**Hardcoded Strings:**
- Line 58: `label="Color"`

**Recommended Fix:**
```tsx
label={Locale.label("site.colorPicker.color")}
```

---

### 2. **D:\Code\ChurchApps\B1Admin\src\site\admin\ContentEditor.tsx**
**Hardcoded Strings:**
- Line 115: `text="Drop here to add section"`
- Line 303: `text={"Scroll Down"}`
- Line 306: `text={"Scroll Up"}`

**Recommended Fixes:**
```tsx
text={Locale.label("site.contentEditor.dropToAddSection")}
text={Locale.label("site.contentEditor.scrollDown")}
text={Locale.label("site.contentEditor.scrollUp")}
```

---

### 3. **D:\Code\ChurchApps\B1Admin\src\site\admin\EditorToolbar.tsx**
**Hardcoded Strings:**
- Line 53: `text="Done"`
- Line 57: `"Page: "` and `"Block: "`
- Line 69: `title="Help"`
- Line 82: `title="Add Content"`
- Line 96: `title="Switch to Desktop View"`
- Line 99: `"Desktop"`
- Line 104: `title="Switch to Mobile View"`
- Line 107: `"Mobile"`

**Recommended Fixes:**
```tsx
text={Locale.label("common.done")}
{isPageMode && Locale.label("site.editor.page") + ": " + (container as PageInterface)?.title}
{!isPageMode && Locale.label("site.editor.block") + ": " + (container as BlockInterface)?.name}
title={Locale.label("common.help")}
title={Locale.label("site.editor.addContent")}
title={Locale.label("site.editor.switchToDesktop")}
{Locale.label("site.editor.desktop")}
title={Locale.label("site.editor.switchToMobile")}
{Locale.label("site.editor.mobile")}
```

---

### 4. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\AnimationsEdit.tsx**
**Hardcoded Strings:**
- Line 61: `<InputLabel>On Show Speed</InputLabel>`
- Line 62: `label="On Show Speed"`

**Recommended Fixes:**
```tsx
<InputLabel>{Locale.label("site.animations.onShowSpeed")}</InputLabel>
label={Locale.label("site.animations.onShowSpeed")}
```

---

### 5. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\CalendarElementEdit.tsx**
**Hardcoded Strings:**
- Line 29: `<InputLabel>Select</InputLabel>`
- Line 30: `label="Select"`
- Line 31: `"Group Calendar"`
- Line 32: `"Curated Calendar"`
- Line 36: `<InputLabel>Select Calendar</InputLabel>`
- Line 36: `label="Select Calendar"`

**Recommended Fixes:**
```tsx
<InputLabel>{Locale.label("common.select")}</InputLabel>
label={Locale.label("common.select")}
{Locale.label("site.calendar.groupCalendar")}
{Locale.label("site.calendar.curatedCalendar")}
<InputLabel>{Locale.label("site.calendar.selectCalendar")}</InputLabel>
label={Locale.label("site.calendar.selectCalendar")}
```

---

### 6. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\DonateLinkEdit.tsx**
**Hardcoded Strings:**
- Line 94: `<InputLabel>Funds</InputLabel>`
- Line 95: `label="Funds"`
- Line 104: `"Donation Amounts"`
- Line 106: `"You can suggest some donation amounts like $5, $10, $20, etc.."`
- Line 111: `label="Amount"`

**Recommended Fixes:**
```tsx
<InputLabel>{Locale.label("site.donateLink.funds")}</InputLabel>
label={Locale.label("site.donateLink.funds")}
{Locale.label("site.donateLink.donationAmounts")}
{Locale.label("site.donateLink.donationAmountsHelper")}
label={Locale.label("site.donateLink.amount")}
```

---

### 7. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\ElementAdd.tsx**
**Hardcoded Strings:**
- Line 27: `<p>No blocks found</p>`
- Line 36: `"Drag and drop onto page<br />"`
- Line 40: `"Simple Elements"`
- Line 42: `"Church Specific"`
- Line 46: `"Blocks"`
- Line 55-83: All element labels like `"Text"`, `"Text with Photo"`, `"Image"`, `"Video"`, `"Card"`, `"Location"`, `"Table"`, `"Row"`, `"Box"`, `"Carousel"`, `"Expandable"`, `"HTML"`, `"Embed Page"`, `"Logo"`, `"Stream"`, `"Donation"`, `"Donate Link"`, `"Form"`, `"Calendar"`, `"Group List"`

**Recommended Fixes:**
```tsx
<p>{Locale.label("site.elementAdd.noBlocks")}</p>
{Locale.label("site.elementAdd.dragDropInstructions")}<br />
{Locale.label("site.elementAdd.simpleElements")}
{Locale.label("site.elementAdd.churchSpecific")}
{Locale.label("site.elementAdd.blocks")}
label={Locale.label("site.elementAdd.text")}
label={Locale.label("site.elementAdd.textWithPhoto")}
// ... etc for all elements
```

---

### 8. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\ElementEdit.tsx**
**Hardcoded Strings:**
- Line 127: `label="Text Alignment"`
- Line 157: `"Rounded Corners"`
- Line 158: `"Translucent"`
- Line 185: `"Select photo"`
- Line 186: `label="Photo Label"`
- Line 188: `<InputLabel>Photo Position</InputLabel>`
- Line 189: `label="Photo Position"`
- Line 214: `label="Link Url (optional)"`
- Line 215: `"Title Alignment"`
- Line 216: `label="Title"`
- Line 231: `label="Link Url (optional)"`
- Line 240: `<InputLabel>Block</InputLabel>`
- Line 241: `label="Block"`
- Line 250: `<InputLabel>Mode</InputLabel>`
- Line 251: `label="Mode"`
- Line 252: `"Video Only"`
- Line 253: `"Video and Interaction"`
- Line 257: `<InputLabel>Offline Content</InputLabel>`
- Line 258: `label="Offline Content"`
- Line 259: `"Next Service Time"`
- Line 260: `"Hide"`
- Line 261: `"Block"`
- Line 272: `label="Source"`
- Line 283: `<InputLabel>Variant</InputLabel>`
- Line 284: `label="Button Type"`
- Line 285: `"Contained"`
- Line 286: `"Outlined"`
- Line 289: `<InputLabel>Color</InputLabel>`
- Line 290: `label="Button Type"`
- Line 291-296: Color options
- Line 300: `"Open in new Tab"`
- Line 301: `"Full width"`
- Line 310: `<InputLabel>Type</InputLabel>`
- Line 311: `label="Type"`
- Line 312: `"Youtube"`
- Line 313: `"Vimeo"`
- Line 316: `label="Id"`
- Line 318-325: Help text
- Line 334: `label="HTML Content"`
- Line 335: `label="Javascript (exlude <script> tag)"`
- Line 343: `"Zoom-level"`
- Line 345: `"Ex: 0(the whole world) & 21(individual buildings)"`
- Line 357: `label="Height(Px)"`
- Line 358: `label="Slides"`
- Line 360: `<InputLabel>Animation Options</InputLabel>`
- Line 361: `label="Animation Options"`
- Line 362: `"Fade"`
- Line 363: `"Slide"`
- Line 367: `"Autoplay"`
- Line 370: `label="Slides Interval (seconds)"`
- Line 379: `"Select photo"`
- Line 380: `label="Photo Label"`
- Line 381: `label="Link Url (optional)"`
- Line 382: `"Open link in new tab"`
- Line 383: `"Do not resize image"`
- Line 386: `<InputLabel>Image Alignment</InputLabel>`
- Line 387: `label="Image Alignment"`
- Line 399: `label="Height(Px)"`
- Line 478: `<InputLabel>Block</InputLabel>`
- Line 483: `label="Block"`

**Recommended Fixes:** Too many to list individually, but pattern is:
```tsx
label={Locale.label("site.elementEdit.textAlignment")}
{Locale.label("site.elementEdit.roundedCorners")}
// etc.
```

---

### 9. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\FaqEdit.tsx**
**Hardcoded Strings:**
- Line 16: `<InputLabel>Heading Type</InputLabel>`
- Line 17: `label="Heading Type"`
- Line 18: `"Heading"`
- Line 19: `"Link"`
- Line 22: `label="Title"`
- Line 31: `<InputLabel>Icon Color</InputLabel>`

**Recommended Fixes:**
```tsx
<InputLabel>{Locale.label("site.faq.headingType")}</InputLabel>
label={Locale.label("site.faq.headingType")}
{Locale.label("site.faq.heading")}
{Locale.label("site.faq.link")}
label={Locale.label("site.faq.title")}
<InputLabel>{Locale.label("site.faq.iconColor")}</InputLabel>
```

---

### 10. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\FormEdit.tsx**
**Hardcoded Strings:**
- Line 28: `"No forms available!"`
- Line 31: `"Create a new form"`
- Line 39: `<InputLabel>Select</InputLabel>`
- Line 40: `label="Select"`

**Recommended Fixes:**
```tsx
{Locale.label("site.formEdit.noForms")}
{Locale.label("site.formEdit.createNew")}
<InputLabel>{Locale.label("common.select")}</InputLabel>
label={Locale.label("common.select")}
```

---

### 11. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\PickColors.tsx**
**Hardcoded Strings:**
- Line 102: `<InputLabel>Background Type</InputLabel>`
- Line 103: `label="Background Type"`
- Line 104: `"Color"`
- Line 105: `"Image"`
- Line 106: `"Youtube Video"`
- Line 116: `label="Background"`
- Line 121: `label="Youtube ID"`
- Line 126: `"Select photo"`
- Line 214: `"Background"`
- Line 219: `"Content"`
- Line 236: `"Current Colors"`
- Line 237: `"Sample Text"`
- Line 239: `"Suggested"`

**Recommended Fixes:**
```tsx
<InputLabel>{Locale.label("site.pickColors.backgroundType")}</InputLabel>
label={Locale.label("site.pickColors.backgroundType")}
{Locale.label("site.pickColors.color")}
{Locale.label("site.pickColors.image")}
{Locale.label("site.pickColors.youtubeVideo")}
// etc.
```

---

### 12. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\RowEdit.tsx**
**Hardcoded Strings:**
- Line 51: `"Columns must add up to 12"`
- Line 84-95: Column width options like `"1 - 1/12th"`, `"2 - 1/6th"`, etc.
- Line 98: `"Remove"`
- Line 103: `"Total: 12/12"`
- Line 104: `"Total: {total}/12"`
- Line 112: `"Width"`
- Line 113: `"Add Column"`
- Line 123: `"Show Mobile Sizes"`
- Line 126: `"Hide Mobile Sizes"`
- Line 133: `"Show Mobile Order"`
- Line 136: `"Hide Mobile Order"`
- Line 147: `<InputLabel>Common Options</InputLabel>`
- Line 148: `label={"Common Options"}`
- Line 149: `"Halves"`
- Line 150: `"Thirds"`
- Line 151: `"Quarters"`
- Line 156: `"Preview"`, `"Numbers represent twelfths of page."`

**Recommended Fixes:**
```tsx
{Locale.label("site.row.columnsMustAddTo12")}
{Locale.label("site.row.width1")}
{Locale.label("site.row.remove")}
// etc.
```

---

### 13. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\RowMobileOrder.tsx**
**Hardcoded Strings:**
- Line 55: `"Customize Mobile Order"`
- Line 59: `"Desktop Order"`
- Line 60: `"Mobile Order"`

**Recommended Fixes:**
```tsx
{Locale.label("site.rowMobileOrder.customizeOrder")}
{Locale.label("site.rowMobileOrder.desktopOrder")}
{Locale.label("site.rowMobileOrder.mobileOrder")}
```

---

### 14. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\RowMobileSizes.tsx**
**Hardcoded Strings:**
- Line 37-48: Column size options
- Line 55: `"Customize Mobile Layout"`
- Line 56: `"Mobile widths do not need to add up to 12. Values that add up to 24 will span two rows."`
- Line 60: `"Desktop Width"`
- Line 61: `"Mobile Width"`

**Recommended Fixes:**
```tsx
{Locale.label("site.rowMobileSizes.customizeLayout")}
{Locale.label("site.rowMobileSizes.helper")}
{Locale.label("site.rowMobileSizes.desktopWidth")}
{Locale.label("site.rowMobileSizes.mobileWidth")}
```

---

### 15. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\StyleTextShadow.tsx**
**Hardcoded Strings:**
- Line 47: `label="Offset X - px"`
- Line 48: `label="Offset X - px"` (should be Y)
- Line 49: `label="Blur Radius - px"`

**Recommended Fixes:**
```tsx
label={Locale.label("site.styleTextShadow.offsetX")}
label={Locale.label("site.styleTextShadow.offsetY")}
label={Locale.label("site.styleTextShadow.blurRadius")}
```

---

### 16. **D:\Code\ChurchApps\B1Admin\src\site\admin\elements\TableEdit.tsx**
**Hardcoded Strings:**
- Line 91: `label="Rows"`
- Line 94: `label="Columns"`
- Line 98: `<InputLabel>First Row is Header</InputLabel>`
- Line 99: `label="First Row is Header"`
- Line 100: `"Yes"`
- Line 101: `"No"`
- Line 108: `<InputLabel>Allow Markdown</InputLabel>`
- Line 109: `label="Allow Markdown"`
- Line 110-111: `"Yes"`, `"No"`
- Line 119: `<InputLabel>Size</InputLabel>`
- Line 120: `label="Size"`
- Line 121: `"Medium"`
- Line 122: `"Small"`

**Recommended Fixes:**
```tsx
label={Locale.label("site.table.rows")}
label={Locale.label("site.table.columns")}
<InputLabel>{Locale.label("site.table.firstRowHeader")}</InputLabel>
{Locale.label("common.yes")}
{Locale.label("common.no")}
// etc.
```

---

### 17. **D:\Code\ChurchApps\B1Admin\src\site\admin\HelpDialog.tsx**
**Hardcoded Strings:**
- Line 15-17: Three help paragraphs

**Recommended Fixes:**
```tsx
<p>{Locale.label("site.help.addElements")}</p>
<p>{Locale.label("site.help.editElements")}</p>
<p>{Locale.label("site.help.rearrangeElements")}</p>
```

---

### 18. **D:\Code\ChurchApps\B1Admin\src\site\admin\SectionEdit.tsx**
**Hardcoded Strings:**
- Line 84: `label="ID"`
- Line 96: `<InputLabel>Block</InputLabel>`
- Line 97: `label="Block"`
- Line 129: Prompt text
- Line 150: `title="Convert to Block"`, `"Convert to"`, `"duplicate"`

**Recommended Fixes:**
```tsx
label={Locale.label("site.section.id")}
<InputLabel>{Locale.label("site.section.block")}</InputLabel>
label={Locale.label("site.section.block")}
window.prompt(Locale.label("site.section.convertPrompt"), Locale.label("site.section.blockName"))
title={Locale.label("site.section.convertToBlock")}
{Locale.label("site.section.convertTo")}
{Locale.label("site.section.duplicate")}
```

---

### 19. **D:\Code\ChurchApps\B1Admin\src\site\admin\EmptyState.tsx**
**Hardcoded Strings:**
- Line 14: `"No sections yet"`
- Line 17: Full description
- Line 24: `"Click the + button in the toolbar to add content"`

**Recommended Fixes:**
```tsx
{Locale.label("site.emptyState.noSections")}
{Locale.label("site.emptyState.description")}
{Locale.label("site.emptyState.clickToAdd")}
```

---

### 20. **D:\Code\ChurchApps\B1Admin\src\site\admin\Section.tsx**
**Hardcoded Strings:**
- Line 125: `text="Drop here to add element"`

**Recommended Fixes:**
```tsx
text={Locale.label("site.section.dropToAddElement")}
```

---

### 21. **D:\Code\ChurchApps\B1Admin\src\site\admin\StyleList.tsx**
**Hardcoded Strings:**
- Line 25: `"All"`, `"Desktop Only"`, `"Mobile Only"`
- Line 32-39: Display text
- Line 63: `"Use these fields to customize the style of a single element. For sitewide changes use the site appearance editor."`
- Line 64: `"Platform:"`

**Recommended Fixes:**
```tsx
{Locale.label("site.styleList.all")}
{Locale.label("site.styleList.desktopOnly")}
{Locale.label("site.styleList.mobileOnly")}
// etc.
```

---

### 22. **D:\Code\ChurchApps\B1Admin\src\site\admin\StylesAnimations.tsx**
**Hardcoded Strings:**
- Line 31: `"Styles"`
- Line 32: `"Advanced appearance options."`
- Line 41: `"Animations"`
- Line 42: `"Effect for when element is shown."`

**Recommended Fixes:**
```tsx
{Locale.label("site.stylesAnimations.styles")}
{Locale.label("site.stylesAnimations.stylesDescription")}
{Locale.label("site.stylesAnimations.animations")}
{Locale.label("site.stylesAnimations.animationsDescription")}
```

---

### 23. **D:\Code\ChurchApps\B1Admin\src\site\admin\ZoneBox.tsx**
**Hardcoded Strings:**
- Line 19: `label={`Zone: ${keyName}`}`

**Recommended Fixes:**
```tsx
label={Locale.label("site.zoneBox.zone") + ": " + keyName}
```

---

### 24. **D:\Code\ChurchApps\B1Admin\src\site\AppearancePage.tsx**
**Hardcoded Strings:**
- Line 23: `title="Site Styles"`
- Line 24: `subtitle="Below is a preview of a sample site with your colors, fonts and logos. This is not your actual site content."`

**Recommended Fixes:**
```tsx
title={Locale.label("site.appearance.title")}
subtitle={Locale.label("site.appearance.subtitle")}
```

---

### 25. **D:\Code\ChurchApps\B1Admin\src\site\BlocksPage.tsx**
**Hardcoded Strings:**
- Line 53: `"No blocks found"`
- Line 56: `"Get started by creating your first reusable block"`
- Line 58: `"Create First Block"`
- Line 90: `"Element(s)"`, `"Section(s)"`
- Line 111: `"Name"`
- Line 116: `"Type"`
- Line 121: `"Actions"`
- Line 148: `title="Reusable Blocks"`
- Line 149: `subtitle="Create and manage reusable content blocks for your website"`
- Line 160: `title="Reusable Blocks"`
- Line 160: `label="Total Blocks"`
- Line 161: `"Add Block"`
- Line 179: `"Blocks"`
- Line 182: `"block"`, `"blocks"`

**Recommended Fixes:**
```tsx
{Locale.label("site.blocks.noBlocks")}
{Locale.label("site.blocks.getStarted")}
{Locale.label("site.blocks.createFirst")}
{Locale.label("site.blocks.elements")}
{Locale.label("site.blocks.sections")}
// etc.
```

---

### 26. **D:\Code\ChurchApps\B1Admin\src\site\PagesPage.tsx**
**Hardcoded Strings:**
- Line 136: `"Page editor is only available in desktop mode"`
- Line 143: `title="Website Pages"`
- Line 143: `subtitle="Manage your website pages, content, and navigation"`
- Line 143: `label="Total Pages"`, `label="Custom Pages"`, `label="Auto-generated"`
- Line 144: `"Add Page"`
- Line 149: `"Pages"`
- Line 153: `"Show Login"`
- Line 163: `"Main Navigation"`
- Line 176: `"Pages"`
- Line 183: `"Below is a list of custom and auto-generated pages. You can add new pages, edit existing ones, or convert auto-generated pages to custom pages."`
- Line 191: `"No pages found"`
- Line 193: `"Get started by adding your first page."`
- Line 194: `"Add First Page"`
- Line 203: `"Actions"`
- Line 208: `"Path"`
- Line 213: `"Title"`
- Line 55: `label="Generated"`

**Recommended Fixes:**
```tsx
{Locale.label("site.pages.desktopOnlyMessage")}
title={Locale.label("site.pages.title")}
subtitle={Locale.label("site.pages.subtitle")}
// etc.
```

---

### 27. **D:\Code\ChurchApps\B1Admin\src\site\PagePreview.tsx**
**Hardcoded Strings:**
- Line 64: `"Loading..."`
- Line 73: `title="Website Preview"`
- Line 73: `subtitle={`Previewing: ${pageData.title}`}`
- Line 75: `"Edit Content"`
- Line 76: `"Page Settings"`

**Recommended Fixes:**
```tsx
{Locale.label("common.loading")}
title={Locale.label("site.pagePreview.title")}
subtitle={Locale.label("site.pagePreview.previewing") + ": " + pageData.title}
{Locale.label("site.pagePreview.editContent")}
{Locale.label("site.pagePreview.pageSettings")}
```

---

### 28. **D:\Code\ChurchApps\B1Admin\src\site\FilesPage.tsx**
**Hardcoded Strings:**
- Line 23: `title="Files"`
- Line 24: `subtitle="Manage files and media for your website"`

**Recommended Fixes:**
```tsx
title={Locale.label("site.files.title")}
subtitle={Locale.label("site.files.subtitle")}
```

---

### Additional Files Checked (No Issues Found):
The following files were checked and appear to be properly localized or contain no user-facing strings:
- BlockEditPage.tsx
- PageEdit.tsx
- Site.tsx
- admin/DraggableIcon.tsx
- admin/ElementWrapper.tsx
- admin/Section.tsx
- admin/SectionBlock.tsx
- components/WebsiteFooter.tsx
- components/WebsiteHeader.tsx

---

## Localization Keys Needed

Based on the analysis, the following localization key structure is recommended:

### Common Keys (already exist):
- `common.add`
- `common.close`
- `common.done`
- `common.help`
- `common.edit`
- `common.delete`
- `common.duplicate`
- `common.update`
- `common.left`
- `common.center`
- `common.right`
- `common.top`
- `common.bottom`
- `common.yes`
- `common.no`
- `common.select`
- `common.custom`
- `common.loading`
- `common.sermons`

### Site-specific Keys Needed:

#### ColorPicker
- `site.colorPicker.color`

#### ContentEditor
- `site.contentEditor.dropToAddSection`
- `site.contentEditor.scrollDown`
- `site.contentEditor.scrollUp`

#### EditorToolbar
- `site.editor.page`
- `site.editor.block`
- `site.editor.addContent`
- `site.editor.switchToDesktop`
- `site.editor.desktop`
- `site.editor.switchToMobile`
- `site.editor.mobile`

#### Animations (already partially implemented)
- `site.animations.editAnimations`
- `site.animations.onShowAnimation`
- `site.animations.onShowSpeed` (missing)
- `site.animations.none`
- `site.animations.slideLeft`
- `site.animations.slideRight`
- `site.animations.slideUp`
- `site.animations.slideDown`
- `site.animations.fadeIn`
- `site.animations.grow`
- `site.animations.shrink`
- `site.animations.pulse`
- `site.animations.colorize`
- `site.animations.focus`
- `site.animations.slow`
- `site.animations.normal`
- `site.animations.fast`

#### Calendar
- `site.calendar.groupCalendar`
- `site.calendar.curatedCalendar`
- `site.calendar.selectCalendar`

#### DonateLink (already partially implemented)
- `site.donateLink.funds`
- `site.donateLink.donationAmounts`
- `site.donateLink.donationAmountsHelper`
- `site.donateLink.amount`
- `site.donateLink.maxAmountsAlert`
- `site.donateLink.urlPlaceholder`
- `site.donateLink.urlHelper`
- `site.donateLink.urlLabel`
- `site.donateLink.textHelper`
- `site.donateLink.textLabel`
- `site.donateLink.noFunds`
- `site.donateLink.amountPlaceholder`
- `site.donateLink.add`

#### ElementAdd
- `site.elementAdd.noBlocks`
- `site.elementAdd.dragDropInstructions`
- `site.elementAdd.simpleElements`
- `site.elementAdd.churchSpecific`
- `site.elementAdd.blocks`
- `site.elementAdd.text`
- `site.elementAdd.textWithPhoto`
- `site.elementAdd.image`
- `site.elementAdd.video`
- `site.elementAdd.card`
- `site.elementAdd.location`
- `site.elementAdd.table`
- `site.elementAdd.row`
- `site.elementAdd.box`
- `site.elementAdd.carousel`
- `site.elementAdd.expandable`
- `site.elementAdd.html`
- `site.elementAdd.embedPage`
- `site.elementAdd.logo`
- `site.elementAdd.stream`
- `site.elementAdd.donation`
- `site.elementAdd.donateLink`
- `site.elementAdd.form`
- `site.elementAdd.calendar`
- `site.elementAdd.groupList`

#### ElementEdit (many needed)
- `site.elementEdit.textAlignment`
- `site.elementEdit.roundedCorners`
- `site.elementEdit.translucent`
- `site.elementEdit.selectPhoto`
- `site.elementEdit.photoLabel`
- `site.elementEdit.photoPosition`
- `site.elementEdit.linkUrl`
- `site.elementEdit.titleAlignment`
- `site.elementEdit.title`
- `site.elementEdit.block`
- `site.elementEdit.mode`
- `site.elementEdit.videoOnly`
- `site.elementEdit.videoAndInteraction`
- `site.elementEdit.offlineContent`
- `site.elementEdit.nextServiceTime`
- `site.elementEdit.hide`
- `site.elementEdit.source`
- `site.elementEdit.variant`
- `site.elementEdit.buttonType`
- `site.elementEdit.contained`
- `site.elementEdit.outlined`
- `site.elementEdit.color`
- `site.elementEdit.primary`
- `site.elementEdit.secondary`
- `site.elementEdit.error`
- `site.elementEdit.warning`
- `site.elementEdit.info`
- `site.elementEdit.success`
- `site.elementEdit.openInNewTab`
- `site.elementEdit.fullWidth`
- `site.elementEdit.type`
- `site.elementEdit.youtube`
- `site.elementEdit.vimeo`
- `site.elementEdit.id`
- `site.elementEdit.youtubeHelp`
- `site.elementEdit.vimeoHelp`
- `site.elementEdit.htmlContent`
- `site.elementEdit.javascript`
- `site.elementEdit.address`
- `site.elementEdit.addressHelper`
- `site.elementEdit.label`
- `site.elementEdit.nameHelper`
- `site.elementEdit.zoomLevel`
- `site.elementEdit.zoomHelper`
- `site.elementEdit.categoriesHelper`
- `site.elementEdit.height`
- `site.elementEdit.slides`
- `site.elementEdit.animationOptions`
- `site.elementEdit.fade`
- `site.elementEdit.slide`
- `site.elementEdit.autoplay`
- `site.elementEdit.slidesInterval`
- `site.elementEdit.openLinkNewTab`
- `site.elementEdit.doNotResize`
- `site.elementEdit.imageAlignment`

#### Elements (already partially implemented)
- `site.elements.editElement`
- `site.elements.confirmDelete`
- `site.elements.confirmDuplicate`
- `site.elements.heightPlaceholder`

#### Faq
- `site.faq.headingType`
- `site.faq.heading`
- `site.faq.link`
- `site.faq.title`
- `site.faq.iconColor`

#### FormEdit
- `site.formEdit.noForms`
- `site.formEdit.createNew`

#### PickColors
- `site.pickColors.backgroundType`
- `site.pickColors.color`
- `site.pickColors.image`
- `site.pickColors.youtubeVideo`
- `site.pickColors.background`
- `site.pickColors.youtubeId`
- `site.pickColors.selectPhoto`
- `site.pickColors.backgroundField`
- `site.pickColors.content`
- `site.pickColors.currentColors`
- `site.pickColors.sampleText`
- `site.pickColors.suggested`
- `site.pickColors.headingColor`
- `site.pickColors.textColor`
- `site.pickColors.linkColor`
- `site.pickColors.opacityHelper`

#### Row
- `site.row.columnsMustAddTo12`
- `site.row.width1` through `site.row.width12`
- `site.row.remove`
- `site.row.total`
- `site.row.width`
- `site.row.addColumn`
- `site.row.showMobileSizes`
- `site.row.hideMobileSizes`
- `site.row.showMobileOrder`
- `site.row.hideMobileOrder`
- `site.row.commonOptions`
- `site.row.halves`
- `site.row.thirds`
- `site.row.quarters`
- `site.row.preview`
- `site.row.previewHelper`
- `site.row.columnsHelper`

#### RowMobileOrder
- `site.rowMobileOrder.customizeOrder`
- `site.rowMobileOrder.desktopOrder`
- `site.rowMobileOrder.mobileOrder`

#### RowMobileSizes
- `site.rowMobileSizes.customizeLayout`
- `site.rowMobileSizes.helper`
- `site.rowMobileSizes.desktopWidth`
- `site.rowMobileSizes.mobileWidth`

#### StyleTextShadow
- `site.styleTextShadow.offsetX`
- `site.styleTextShadow.offsetY`
- `site.styleTextShadow.blurRadius`

#### Table
- `site.table.rows`
- `site.table.columns`
- `site.table.firstRowHeader`
- `site.table.allowMarkdown`
- `site.table.size`
- `site.table.medium`
- `site.table.small`

#### Help
- `site.help.addElements`
- `site.help.editElements`
- `site.help.rearrangeElements`

#### Section (already partially implemented)
- `site.section.id`
- `site.section.block`
- `site.section.convertPrompt`
- `site.section.blockName`
- `site.section.convertToBlock`
- `site.section.convertTo`
- `site.section.duplicate`
- `site.section.dropToAddElement`
- `site.section.editSection`
- `site.section.confirmDelete`
- `site.section.confirmDuplicate`

#### EmptyState
- `site.emptyState.noSections`
- `site.emptyState.description`
- `site.emptyState.clickToAdd`

#### StyleList
- `site.styleList.all`
- `site.styleList.desktopOnly`
- `site.styleList.mobileOnly`
- `site.styleList.addStyle`
- `site.styleList.helper`
- `site.styleList.platform`

#### StyleEdit
- `site.styleEdit.property`
- `site.style.editStyle`

#### StylesAnimations
- `site.stylesAnimations.styles`
- `site.stylesAnimations.stylesDescription`
- `site.stylesAnimations.animations`
- `site.stylesAnimations.animationsDescription`

#### ZoneBox
- `site.zoneBox.zone`

#### Appearance
- `site.appearance.title`
- `site.appearance.subtitle`

#### Blocks
- `site.blocks.noBlocks`
- `site.blocks.getStarted`
- `site.blocks.createFirst`
- `site.blocks.elements`
- `site.blocks.sections`
- `site.blocks.name`
- `site.blocks.type`
- `site.blocks.actions`
- `site.blocks.title`
- `site.blocks.subtitle`
- `site.blocks.totalBlocks`
- `site.blocks.addBlock`
- `site.blocks.blocks`
- `site.blocks.block`
- `site.blocks.blockPlural`

#### Pages (already partially implemented)
- `site.pages.desktopOnlyMessage`
- `site.pages.title`
- `site.pages.subtitle`
- `site.pages.totalPages`
- `site.pages.customPages`
- `site.pages.autoGenerated`
- `site.pages.addPage`
- `site.pages.pages`
- `site.pages.showLogin`
- `site.pages.mainNavigation`
- `site.pages.description`
- `site.pages.noPages`
- `site.pages.getStarted`
- `site.pages.addFirst`
- `site.pages.actions`
- `site.pages.path`
- `site.pages.title`
- `site.pages.generated`
- `site.pages.convert`
- `site.pagesPage.confirmConvert`

#### PagePreview
- `site.pagePreview.title`
- `site.pagePreview.previewing`
- `site.pagePreview.editContent`
- `site.pagePreview.pageSettings`

#### PageLink (already partially implemented)
- `site.pageLink.urlHelper`
- `site.pageLink.check`

#### Files (already partially implemented)
- `site.files.title`
- `site.files.subtitle`
- `site.files.confirmDelete`
- `site.files.uploadFiles`
- `site.files.upload`
- `site.files.storageInfo`

---

## Recommendations

1. **Create Localization File**: Create a new localization file at `src/locales/en-US/site.json` with all the keys listed above.

2. **Systematic Replacement**: Work through each file listed above and replace hardcoded strings with `Locale.label()` calls.

3. **Priority Order**:
   - High Priority: User-facing UI elements (buttons, labels, headings)
   - Medium Priority: Help text, descriptions, placeholders
   - Low Priority: Technical labels that might not need translation

4. **Testing**: After localization, test all affected components to ensure:
   - All strings display correctly
   - Layout doesn't break with longer translated strings
   - No missing translations

5. **Future Prevention**: Add ESLint rule to detect hardcoded strings in JSX/TSX files.

---

## Conclusion

The site module has **28 files** with hardcoded English strings totaling **150+ individual strings** that need localization. While some localization work has been started (DonateLinkEdit, AnimationsEdit, etc.), the majority of files still contain hardcoded English text.

**Next Steps:**
1. Create comprehensive localization key file
2. Systematically replace hardcoded strings following the patterns above
3. Test all components
4. Add linting rules to prevent future hardcoded strings
