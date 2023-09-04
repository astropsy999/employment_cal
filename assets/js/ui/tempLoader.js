/**
 * Функция для включения/отключения лодера
 * @param {*} status
 * @returns
 */
export const tempLoader = (status) => {
  const temploaderWrapper = document.querySelector('.temploaderWrapper');

  if (status) {
    temploaderWrapper.style.display = 'flex';
    return;
  }

  if (!status) {
    temploaderWrapper.style.display = 'none';
    return;
  }
};
