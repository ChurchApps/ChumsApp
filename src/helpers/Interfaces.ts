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
