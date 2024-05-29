import { Component, inject } from '@angular/core';
import { ResolveFn, Router} from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Sumt20Service } from '../sumt20.service';
import { RowState } from '@app/shared/rowstate.enum';

export const messageDetailResolver: ResolveFn<Observable<any>> = () => {
  const router = inject(Router);
  const db = inject(Sumt20Service);

  let messageCode = null;
  let systemControl = null;
  let rowState = RowState.Normal;
  if(router.getCurrentNavigation().extras.state){
      messageCode = router.getCurrentNavigation().extras.state['messageCode'];
      rowState = RowState.Add
  }

  let resolverUpdateData = of({});
  if(messageCode){
      resolverUpdateData = db.getMessageByCode(messageCode);
  }
  console.log(messageCode);
  return forkJoin([resolverUpdateData]).pipe(map((result)=>{
      let detail: any = result[0];
      detail.languageCode = detail.languageCode ?? '';
      detail.messageDesc = detail.messageDesc ?? '';
      detail.remark = detail.remark ?? '';
      return { detail: result[0],messageCode}
  }));
};
