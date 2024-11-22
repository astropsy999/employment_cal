import { expect, Locator, Page } from '@playwright/test';
export async function clickAddMethodButton(modal: Locator) {
        const addWooMetButton = modal.locator('#addWooMet');
        await expect(addWooMetButton).toBeVisible();
        await addWooMetButton.click();
}

export async function clickAddTaskButton(modal: Locator) {
    const addTaskButton = modal.locator('#addTaskToCalBtn');
    await expect(addTaskButton).toBeVisible();
    await addTaskButton.click();
}

/**
 * Управляет состоянием чекбокса: отмечает его, если не установлен, или снимает, если установлен.
 *
 * @param {Locator} checkbox - Локатор чекбокса.
 * @throws {Error} Если чекбокс недоступен или не виден.
 *
 * @example
 * // Отметить чекбокс, если не отмечен, или снять, если уже отмечен:
 * await toggleCheckbox(modal.locator('#brigadirCheckbox'));
 */
export async function toggleCheckbox(checkbox: Locator) {
    // Убедимся, что чекбокс видим
    await expect(checkbox).toBeVisible();

    // Проверяем текущее состояние чекбокса
    const isChecked = await checkbox.isChecked();

    if (isChecked) {
        // Если чекбокс отмечен, снимаем его
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();
    } else {
        // Если чекбокс не отмечен, отмечаем его
        await checkbox.check();
        await expect(checkbox).toBeChecked();
    }
}
