import { expect, Page } from "playwright/test";
import { selectCurrentDateAndOpenAddTaskModal } from "./tasks";


/**
 * Проверяет, что при клике на день в календаре,
 * модальное окно добавления задачи появляется,
 * и что внутри него есть все необходимые элементы.
 * @param page - Страница, на которой происходит проверка.
 */
export async function checkAddTaskModal(page: Page) {

    const addTaskModal = await selectCurrentDateAndOpenAddTaskModal(page)

    // Проверяем элементы внутри модального окна
    const modalTitle = addTaskModal.locator('.modal-title');
    await expect(modalTitle).toHaveText('Добавление задачи');

    const employmentDropdown = addTaskModal.locator('#employment');
    await expect(employmentDropdown).toBeVisible();

    const taskTitleInput = addTaskModal.locator('#eventTitle');
    await expect(taskTitleInput).toBeVisible();
    await expect(taskTitleInput).toHaveAttribute('placeholder', 'Краткое описание');

    const addButton = addTaskModal.locator('#addTaskToCalBtn');
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText('Добавить');

    // Закрываем окно
    const closeBtn = addTaskModal.locator('.btn-close')
    await expect(closeBtn).toBeVisible()
    closeBtn.click()
    await expect(addTaskModal).toBeHidden()
    console.log('Модальное окно добавления задачи закрыто');

}

export async function isAddEventModalAvailable(page: Page){
    const modal = page.locator('#addEventModal');
    await expect(modal).toBeVisible();

    return modal;
}
