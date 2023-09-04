import { srvv, delObjMassUrl, delTabID } from '../config';

export const delEvent = (
  info,
  delID,
  isMultiMode,
  modal,
  typeID,
  shiftKeyUp,
) => {
  const delEventBtn = document.querySelector('#delEventBtn');

  delEventBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    const formDataDel = new FormData();
    formDataDel.append(
      'IDDelObj',
      `[{"ObjID":"${delID}","TypeID":"${'1040' || typeID}"}]`,
    );
    formDataDel.append('TypeID', '');
    formDataDel.append('TabID', delTabID);

    fetch(srvv + delObjMassUrl, {
      credentials: 'include',
      method: 'post',
      body: formDataDel,
    })
      .then((response) => {
        return response.json();
      })

      .catch(function (error) {
        console.log('error', error);
      });
    info.event.remove();

    document.addEventListener('hide.bs.modal', () => {
      isMultiMode = false;
      document.addEventListener('keyup', shiftKeyUp);
    });
    modal.hide();
  });
};
