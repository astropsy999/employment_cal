/**
 * Функция для включения/отключения лодера
 * @param {*} status
 * @returns
 */
export const tempLoader = (status: boolean) => {
  const temploaderWrapper = document.querySelector('.temploaderWrapper') as HTMLElement;

  if (status) {
    temploaderWrapper!.style.display = 'flex';
    return;
  }

  if (!status) {
    temploaderWrapper.style.display = 'none';
    return;
  }
};
