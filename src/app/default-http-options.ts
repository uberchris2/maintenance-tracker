import { HttpHeaders } from '@angular/common/http';

export const DefaultHttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
