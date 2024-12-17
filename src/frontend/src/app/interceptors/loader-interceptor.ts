import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
 
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private activeRequests = 0;
 
  constructor(private ngxService: NgxUiLoaderService) {}
 
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.ngxService.start();
    }
 
    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.ngxService.stop();
        }
      })
    );
  }
}
 