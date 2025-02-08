export interface PaymentGatewaysInterface { id?: string, churchId?: string, provider?: string, publicKey?: string, privateKey?: string, payFees?: boolean }

export interface SongInterface {
  id?: string,
  songDetailId?: string,
  dateAdded: Date
}

export interface SongDetailInterface {
  id?: string,
  musicBrainzId?: string,
  title?: string,
  artist?: string,
  album?: string,
  language?: string,
  geniusId?: string,
  appleId?: string,
  youtubeId?: string,
  ccliId?: string,
  hymnaryId?: string,
  thumbnail?: string,
  releaseDate?: Date,
  bpm?: number,
  keySignature?: string,
  seconds: number
}

export interface ArrangementInterface {
  id?: string,
  songId?: string,
  name?: string,
  lyrics?: string
}

export interface PlanItemInterface {
  id?: string,
  planId?: string,
  parentId?: string,
  sort?: number,
  itemType?: string,
  relatedId?: string,
  label?: string,
  description?: string,
  seconds?: string
}
