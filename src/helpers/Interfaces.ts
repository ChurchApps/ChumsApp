export interface PaymentGatewaysInterface { id?: string, churchId?: string, provider?: string, publicKey?: string, privateKey?: string, payFees?: boolean }

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
  bpm?: string,
  keySignature?: string,
  seconds: number
}
