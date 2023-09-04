// Сохраняем выделенную область

export const saveHighlightedReg = (multipleArray, calendarGridArray) => {
  calendarGridArray.forEach((fcTg, idx) => {
    if (idx > 0) {
      const fcTimegridColBg = fcTg.querySelector('.fc-timegrid-col-bg');

      multipleArray.map((multEv) => {
        if (fcTg.getAttribute('data-date') === multEv.hlElAttrDate) {
          const fcTimegridBgHarness = document.createElement('div');
          fcTimegridBgHarness.classList.add('fc-timegrid-bg-harness');
          fcTimegridBgHarness.setAttribute('style', multEv.hlElStyle);

          const hlElem = document.createElement('div');
          hlElem.classList.add('fc-highlight');

          if (fcTimegridBgHarness != null && !fcTimegridBgHarness.firstChild) {
            fcTimegridBgHarness.append(hlElem);
          }
          if (!fcTimegridColBg.childNodes[1]) {
            fcTimegridColBg.append(fcTimegridBgHarness);
          }
        }
      });
    }
  });
};
