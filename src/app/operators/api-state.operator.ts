import {
  tap,
  catchError
} from 'rxjs/operators';

import {
  throwError
} from 'rxjs';

export function handleApiState(
  loading: any,
  errorMessage: any
) {

  return (source: any) =>

    source.pipe(

      tap(() => {

        loading.set(false);

      }),

      catchError(error => {

        errorMessage.set('Failed');

        loading.set(false);

        return throwError(() => error);

      })

    );

}
