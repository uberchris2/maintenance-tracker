import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Maintenance } from './maintenance';
import { DefaultHttpOptions } from './default-http-options';
import { StorageURL, BlockBlobURL, Aborter, uploadBrowserDataToBlockBlob, AnonymousCredential, IUploadToBlockBlobOptions } from "@azure/storage-blob";
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UploadAuthorization } from './upload-authorization';
import { UploadStatus, UploadStatusType } from './upload-status';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(private http: HttpClient) { }

  post(maintenance: Maintenance) {
    return this.http.post<Maintenance>('api/maintenance', maintenance, DefaultHttpOptions);
  }

  delete(id: string) {
    return this.http.delete(`api/vehicleMaintenance/${id}`);
  }

  uploadReceipt(file: File) {
    return this.http.get<UploadAuthorization>(`api/authorizeReceipt?name=${file.name}`).pipe(switchMap(authorization => {
      return Observable.create(observer => {
        const pipeline = StorageURL.newPipeline(new AnonymousCredential());
        var blockBlobURL = new BlockBlobURL(authorization.url, pipeline);
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

  downloadReceipt(name: string) {
    return this.http.get<UploadAuthorization>(`api/authorizeReceipt?name=${name}`).subscribe(authorization => {
      window.open(authorization.url, "_blank");
    });
  }
}
