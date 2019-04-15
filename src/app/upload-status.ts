export class UploadStatus {
  constructor(public type: UploadStatusType, public percentComplete: number) { }
}

export enum UploadStatusType {
  Progress, Completion
}