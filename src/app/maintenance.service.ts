import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Maintenance } from './maintenance';
import { DefaultHttpOptions } from './default-http-options';
import { StorageURL, BlockBlobURL, Aborter, uploadBrowserDataToBlockBlob, AnonymousCredential } from "@azure/storage-blob";
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UploadAuthorization } from './upload-authorization';

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
    return this.http.get<UploadAuthorization>(`api/uploadReceipt?name=${file.name}`).pipe(switchMap(authorization => {
      const pipeline = StorageURL.newPipeline(new AnonymousCredential());
      var blockBlobURL = new BlockBlobURL(authorization.url, pipeline);
      const options = { blobHTTPHeaders: { blobContentType: file.type } };
      const promise = uploadBrowserDataToBlockBlob(Aborter.none, file, blockBlobURL, options);
      return from(promise);
    }));
  }
}
