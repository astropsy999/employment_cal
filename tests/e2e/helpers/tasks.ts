import { expect, Page } from "playwright/test";
import { isAddEventModalAvailable } from "./modals";


/**
 * Selects the current date on the calendar and opens the add task modal.
 *
 * Steps:
 * 1. Selects the current date on the calendar
 * 2. Checks that the add task modal appears
 *
 * @param page - The page containing the calendar
 * @returns The add task modal
 */
export async function selectCurrentDateAndOpenAddTaskModal(page: Page){
     // Получаем текущую дату в формате YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];

     // Шаг 1: Выделяем день на календаре
    const dayCell = page.locator(`.fc-timegrid-col[data-date="${currentDate}"]`); 
    await expect(dayCell).toBeVisible();
    await dayCell.click({ force: true });

     // Шаг 2: Проверяем, что окно добавления задачи появилось
    const addTaskModal = page.locator('#addEventModal');
    await expect(addTaskModal).toBeVisible({timeout: 20000});

    return addTaskModal;
}

/**
 * Waits for the add task modal to appear and checks that the methods area is available
 * 
 * Steps:
 * 1. Waits for the add task modal to appear
 * 2. Checks that the methods area is visible
 * 
 * @param page - The page containing the calendar
 * @returns The add task modal
 */
export async function isMethodsAreaAvailable(page: Page){
    // Ожидаем появления модального окна добавления задачи
    const modal = await isAddEventModalAvailable(page);
    // Ожидаем, пока появится область методов контроля
    const wooContainer = modal.locator('.woo');
    await expect(wooContainer).toBeVisible();

    console.log('Область для работы с методами доступна')

    return modal;
}

export async function selectMethod(page: Page, methodName: string) {
    const modal = await isMethodsAreaAvailable(page);
        
    // Выбираем метод контроля 
    const methodDropdown = modal.locator('#wooMethod');
    await methodDropdown.selectOption({ label: methodName });
    console.log(`Метод контроля "${methodName}" выбран.`);

    if(methodName === 'РК (Классический)' || methodName === 'РК (ЦРГ)') {
        // Ожидаем появления кастомного элемента селектора для бригады
        const brigadeChoices = modal.locator('.choices__inner'); // Ищем кастомный элемент
        await expect(brigadeChoices).toBeVisible();
        console.log('Кастомный селектор для выбора сотрудников бригады виден.');

        // Проверяем чекбокс "Я бригадир"
        const brigadirCheckbox = modal.locator('#brigadirCheckbox');
        await expect(brigadirCheckbox).toBeVisible();
        console.log('Чекбокс "Я бригадир" виден.');
    }
    
}

