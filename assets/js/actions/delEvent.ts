import { Calendar } from '@fullcalendar/core';
import { delObjMassUrl, delTabID, srvv } from '../config';

export const delEvent = (
  info: { view: { calendar: { prev: () => void; next: () => void; }; }; event: { remove: () => void; }; },
  delID: any,
  isMultiMode: boolean,
  modal: { hide: () => void; },
  typeID: any,
  shiftKeyUp: (this: Document, ev: KeyboardEvent) => any,
  calendar: Calendar,
) => {
  const delEventBtn = document.querySelector('#delEventBtn');

  delEventBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    const formDataDel = new FormData();
    formDataDel.append(
      'IDDelObj',
      `[{"ObjID":"${delID}","TypeID":"${typeID || '1040'}"}]`,
    );
    formDataDel.append('TypeID', '');
    formDataDel.append('TabID', delTabID);

    fetch(srvv + delObjMassUrl, {
      credentials: 'include',
      method: 'post',
      body: formDataDel,
    })
      .then((response) => {
        info.view.calendar.prev();
        info.view.calendar.next();
        return response.json();
      })

      .catch(function (error) {
        console.log('error', error);
      });
    info.event.remove();

    document.addEventListener('hide.bs.modal', () => {
      isMultiMode = false;
      document.addEventListener('keyup', shiftKeyUp);

      // calendar?.render();
    });
    // calendar?.render();
    modal.hide();
  });

  calendar?.render();
};
