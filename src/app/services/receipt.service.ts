import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageURL, BlockBlobURL, Aborter, uploadBrowserDataToBlockBlob, AnonymousCredential, IUploadToBlockBlobOptions } from '@azure/storage-blob';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UploadAuthorization } from '../models/upload-authorization';
import { UploadStatus, UploadStatusType } from '../models/upload-status';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  constructor(private http: HttpClient) { }

  uploadReceipt(file: File) {
    return this.http.get<UploadAuthorization>(`api/authorizeReceipt?name=${file.name}`).pipe(switchMap(authorization => {
      return Observable.create(observer => {
        const pipeline = StorageURL.newPipeline(new AnonymousCredential());
        const blockBlobURL = new BlockBlobURL(authorization.url, pipeline);
        const progressCallback = e => {
          const status = new UploadStatus(UploadStatusType.Progress, e.loadedBytes / (file.size + 1) * 100);
          observer.next(status);
        };
        const options: IUploadToBlockBlobOptions = { blobHTTPHeaders: { blobContentType: file.type }, progress: progressCallback };
        const promise = uploadBrowserDataToBlockBlob(Aborter.none, file, blockBlobURL, options);
        promise.then(() => observer.next(new UploadStatus(UploadStatusType.Completion, 100)))
          .catch(e => observer.error(e))
          .finally(() => observer.complete());
      });
    }));
  }

  download(name: string) {
    return this.http.get<UploadAuthorization>(`api/authorizeReceipt?name=${name}`).subscribe(authorization => {
      window.open(authorization.url, '_blank');
    });
  }

  downloadShared(name: string, userId: string, vehicleId: string) {
    return this.http.get<UploadAuthorization>(`${environment.publicApiEndpoint}api/authorizeReceipt?name=${name}&userId=${userId}&vehicleId=${vehicleId}`)
    .subscribe(authorization => {
      window.open(authorization.url, '_blank');
    });
  }

  getAll() {
    return this.http.get<Array<string>>('api/receipts');
  }
}
