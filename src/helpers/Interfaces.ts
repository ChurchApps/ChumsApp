export interface PaymentGatewaysInterface {
  id?: string;
  churchId?: string;
  provider?: string;
  publicKey?: string;
  privateKey?: string;
  payFees?: boolean;
}

export interface SongInterface {
  id?: string;
  name?: string;
  dateAdded: Date;
}

export interface SongDetailInterface {
  id?: string;
  praiseChartsId?: string;
  title?: string;
  artist?: string;
  album?: string;
  language?: string;
  thumbnail?: string;
  releaseDate?: Date;
  bpm?: number;
  keySignature?: string;
  seconds: number;
  meter?: string;
  tones?: string;
}

export interface SongDetailLinkInterface {
  id?: string;
  songDetailId?: string;
  service?: string;
  serviceKey?: string;
  url?: string;
}

export interface ArrangementInterface {
  id?: string;
  songId?: string;
  songDetailId?: string;
  name?: string;
  lyrics?: string;
}

export interface ArrangementKeyInterface {
  id?: string;
  arrangementId?: string;
  keySignature?: string;
  shortDescription?: string;
}

export interface PlanItemInterface {
  id?: string;
  planId?: string;
  parentId?: string;
  sort?: number;
  itemType?: string;
  relatedId?: string;
  label?: string;
  description?: string;
  seconds?: number;
  link?: string;

  children?: PlanItemInterface[];
}

export interface PlanTypeInterface {
  id?: string;
  churchId?: string;
  ministryId?: string;
  name?: string;
}

export interface PlanInterface {
  id?: string;
  churchId?: string;
  name?: string;
  ministryId?: string;
  planTypeId?: string;
  serviceDate?: Date;
  notes?: string;
  serviceOrder?: boolean;
  contentType?: string;
  contentId?: string;
}

export interface ProgramInterface {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  live?: boolean;
  churchId?: string;
}

export interface StudyInterface {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  programId?: string;
  sort?: number;
}

export interface LessonInterface {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  studyId?: string;
  sort?: number;
}

export interface VenueInterface {
  id?: string;
  name?: string;
  lessonId?: string;
  sort?: number;
}

export interface FileInterface {
  id?: string;
  contentType?: string;
  contentId?: string;
  fileName?: string;
  contentPath?: string;
  fileType?: string;
  size?: number;
  dateModified?: Date;
  fileContents?: string;
}

export interface GlobalStyleInterface {
  id?: string;
  churchId?: string;
  fonts?: string;
  palette?: any;
  customCss?: string;
  customJS?: string;
}

export interface ColumnInterface {
  size: number;
  elements: ElementInterface[];
}

export interface ElementInterface {
  id?: string;
  churchId?: string;
  sectionId?: string;
  blockId?: string;
  parentId?: string;
  size?: number;
  answersJSON?: string;
  answers?: any;
  stylesJSON?: string;
  styles?: { all?: any; desktop?: any; mobile?: any };
  animationsJSON?: string;
  animations?: { onShow: string; onShowSpeed: string };
  sort?: number;
  elementType: string;
  elements?: ElementInterface[];
}

export interface SectionInterface {
  id?: string;
  churchId?: string;
  pageId?: string;
  blockId?: string;
  zone?: string;
  background?: string;
  textColor?: string;
  headingColor?: string;
  linkColor?: string;
  sort?: number;
  targetBlockId?: string;
  answersJSON?: string;
  answers?: any;
  stylesJSON?: string;
  styles?: any;
  animationsJSON?: string;
  animations?: any;
  sourceId?: string;
  sections?: SectionInterface[];
  elements?: ElementInterface[];
}

export interface PageInterface {
  id?: string;
  churchId?: string;
  url?: string;
  title?: string;
  layout?: string;
  sections?: SectionInterface[];
}

export interface BlockInterface {
  id?: string;
  churchId?: string;
  blockType?: string;
  name?: string;
  sections?: SectionInterface[];
}

export interface PageLink {
  pageId?: string;
  title: string;
  url: string;
  custom: boolean;
  children?: PageLink[];
  expanded?: boolean;
}

export interface GenericSettingInterface {
  id?: string;
  churchId?: string;
  keyName?: string;
  value?: string;
  public?: number;
}
