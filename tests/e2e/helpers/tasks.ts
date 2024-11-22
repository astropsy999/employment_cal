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
    await expect(dayCell).toBeEnabled();
    await expect(dayCell).toBeVisible();
    await dayCell.click({ force: true });
    await page.waitForTimeout(20000);;

     // Шаг 2: Проверяем, что окно добавления задачи появилось
    const addTaskModal = page.locator('#addEventModal');
    await expect(addTaskModal).toBeVisible({timeout: 100000});
    // await expect(addTaskModal).toHaveCSS('display', 'block');

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

/**
 * Selects the given method from the methods dropdown in the add task modal.
 * Waits for the methods area to appear and selects the given method.
 * If the method is 'РК (Классический)' or 'РК (ЦРГ)', waits for the appearance of the custom brigade selector and the "Я бригадир" checkbox.
 * 
 * Steps:
 * 1. Waits for the add task modal to appear
 * 2. Checks that the methods area is visible
 * 3. Selects the given method from the methods dropdown
 * 4. If the method is 'РК (Классический)' or 'РК (ЦРГ)', waits for the appearance of the custom brigade selector and the "Я бригадир" checkbox
 * 
 * @param page - The page containing the calendar
 * @param methodName - The name of the method to select
 */
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

/**
 * Проверяет наличие задачи в календаре по ее названию.
 *
 * @param {Page} page - Объект страницы Playwright.
 * @param {string} taskName - Название задачи для поиска.
 * @throws {Error} Если задача не найдена или не отображается.
 *
 * @example
 * // Проверить наличие задачи с названием "Тестовая задача":
 * await checkTaskInCalendar(authenticatedPage, 'Тестовая задача');
 */
export async function checkTaskInCalendar(page: Page, taskName: string) {
    // Локатор задачи в календаре
    const taskInCalendar = page.locator('.fc-timegrid-event-harness').locator(`text=${taskName}`);
    
    // Проверяем, что задача отображается
    await expect(taskInCalendar).toBeVisible();
    
    console.log(`Задача "${taskName}" успешно добавлена и отображена в календаре.`);
}

/**
 * Удаляет задачу с указанным названием из календаря.
 *
 * @param {Page} page - Объект страницы Playwright.
 * @param {string} taskName - Название задачи для удаления.
 * @throws {Error} Если какой-либо шаг не выполнен.
 *
 * @example
 * // Удалить задачу с названием "Тестовая задача":
 * await deleteTestTask(authenticatedPage, 'Тестовая задача');
 */
export async function deleteTestTask(page: Page, taskName: string) {
    // Находим задачу в календаре
    const taskInCalendar = page.locator('.fc-timegrid-event-harness').locator(`text=${taskName}`);
    await expect(taskInCalendar).toBeVisible();
    console.log(`Задача "${taskName}" найдена в календаре.`);

    // Кликаем по задаче
    await taskInCalendar.click();
    console.log(`Клик по задаче "${taskName}" выполнен.`);

    // Проверяем, что открылось окно с детальной информацией
    const eventDetailsModal = page.locator('#eventDetailsModal');
    await expect(eventDetailsModal).toBeVisible();
    console.log('Окно с детальной информацией успешно открыто.');

    // Находим кнопку "Удалить" и кликаем на нее
    const delEventBtn = eventDetailsModal.locator('#delEventBtn');
    await expect(delEventBtn).toBeVisible();
    console.log('Кнопка "Удалить" найдена.');
    await delEventBtn.click();

    // Проверяем, что окно с детальной информацией скрылось
    await expect(eventDetailsModal).toBeHidden();
    console.log('Окно с детальной информацией закрыто.');

    // Проверяем, что задача отсутствует
    await expect(taskInCalendar).toBeHidden();
    console.log(`Задача "${taskName}" успешно удалена из календаря.`);
}



