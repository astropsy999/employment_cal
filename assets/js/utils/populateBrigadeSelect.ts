import { initials } from "./textsUtils";

/**
 * Заполняет селектор работниками бригады.
 * @param brigadeSelectElement - элемент <select>, который нужно заполнить.
 * @param brigadeWorkers - массив работников бригады.
 */
export const populateBrigadeSelect = (
  brigadeSelectElement: HTMLSelectElement,
  brigadeWorkers: {ID: string, Name: string}[],
) => {
  brigadeWorkers.forEach((worker) => {
    const { ID: id, Name: name } = worker;
    const option = document.createElement('option');
    option.value = `{${id}:${name}}`;
    option.text = initials(name);
    brigadeSelectElement.appendChild(option);
  });
};