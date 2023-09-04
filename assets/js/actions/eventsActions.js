/**
 * Определяет ID даты на которую кликнул пользователь в календаре, для дальнейших действий
 * @param {*} parIdArr
 * @param {*} startDate
 * @returns
 */
export const findParentID = (parIdArr, startDate) => {
  const clickedStartDate = startDate.slice(0, 10);

  const nessDateParentID = parIdArr.find(
    (el) => Object.values(el)[0] === clickedStartDate,
  );

  return Object.keys(nessDateParentID)[0];
};
