/**
 * Вывод часто используемых значений в селектора на верх списка
 * @param {*} selectEl
 */

export const oftenSelectedCollectInLS = (selectEl: HTMLSelectElement) => {
  // 1) При каждом добавлении события сохраняем значение в LS в качестве ключа - название элемента selectEl,
  //                                                          в качестве значения - объект {selectEl.value: количество добавлений}
  const addDataStr = selectEl.getAttribute('id');

  // Проверяем есть ли в LS подобный ключ, если нет, то добавляем
  if (!localStorage.getItem(addDataStr!)) {
    localStorage.setItem(
      addDataStr!,
      JSON.stringify({
        [selectEl.value]: 1,
      }),
    );
  } else {
    // достаем его значение и превращаем в объект
    const getAvailableValueObj = JSON.parse(localStorage.getItem(addDataStr!)!);
    let addingValue;
    selectEl.value !== 'Не выбрано'
      ? (addingValue = selectEl.value)
      : addingValue === null;
    // в полученном объекте находим данные соответствующие добавляемому значению селектора
    let addingValueData = getAvailableValueObj[addingValue!];
    addingValueData += 1;
    // Начинаем обратную трансформацию и перезаписывание данных в LS
    // 2) При каждом новом добавлении проверяем есть ли уже такой Постановщик в LS, если да, увеличиваем его значение на 1, если нет - добавляем
    const newObjToWrite = JSON.stringify({
      ...getAvailableValueObj,
      [addingValue]: addingValueData,
    });
    localStorage.setItem(addDataStr, newObjToWrite);
  }
};

export const getFromLSSortAdd = (selectEl) => {
  const addDataStr = selectEl.getAttribute('id');

  if (
    localStorage.getItem(addDataStr) &&
    localStorage.getItem(addDataStr) !== null
  ) {
    const getAvailableValueObj = JSON.parse(localStorage.getItem(addDataStr));
    const sortedAvailableValueObj = Object.keys(getAvailableValueObj).sort(
      function (a, b) {
        return getAvailableValueObj[a] - getAvailableValueObj[b];
      },
    );

    sortedAvailableValueObj.forEach((val) => {
      if (val !== 'undefined') {
        const matchedValue = [...selectEl.options].filter(
          (m, i) => m.innerText === val,
        );

        if (
          matchedValue.length != 0 &&
          matchedValue[0].innerText !== 'Не выбрано'
        ) {
          const newMoveUpEl = document.createElement('option');
          newMoveUpEl.setAttribute('value', matchedValue[0].innerText);
          newMoveUpEl.setAttribute(
            'creatorid',
            matchedValue[0].attributes[1].nodeValue,
          );
          newMoveUpEl.innerText = matchedValue[0].innerText;
          newMoveUpEl.style.background = '#f7fcff';
          newMoveUpEl.style.color = 'darkblue';
          const zeroel = document.querySelector('.zeroel');
          zeroel.after(newMoveUpEl);
        }
      }
    });
  }
};
