import { Page, expect} from "playwright/test";
import { waitForOptions } from "./selectors";

/**
 * Checks if all selectors in header are loaded.
 * It waits until at least two options are loaded in "otherUsers" and "otherUsersDepths" dropdowns.
 * If at least two options are loaded, it means that the selectors are loaded.
 * @param {Page} page - Page to check.
 */
export const checkHeaderSelectorsAreLoaded = async (page: Page) => {
    const header = page.locator('.card-header');
    expect(header).toBeVisible();

    // Ожидаем, пока выпадающий список пользователей загрузится
    const usersDropdown = header.locator('#otherUsers');
    await waitForOptions(usersDropdown, 1); // Ждем, пока опций станет больше 1
    const userOptionsCount = await usersDropdown.locator('option').count();
    expect(userOptionsCount).toBeGreaterThan(1); // Проверяем, что опций больше 
    // Ожидаем, пока выпадающий список отделов загрузится
    const departmentsDropdown = header.locator('#otherUsersDepths');
    await waitForOptions(departmentsDropdown, 1); // Ждем, пока опций станет больше 1
    const departmentOptionsCount = await departmentsDropdown.locator('option').count();
    expect(departmentOptionsCount).toBeGreaterThan(1); // Проверяем, что опций больше 1
}

/**
 * Verifies that all essential elements in the header are loaded and visible.
 * This includes buttons for navigation, task management, and view control.
 * Specifically, it checks for the visibility and correct text of elements such as 
 * the previous and next buttons, calendar title, add task button, today button,
 * full view button, refresh button, report button, and view switcher.
 * It waits for the calendar title to become visible within a specified timeout.
 * 
 * @param {Page} page - The Playwright page object representing the browser page to be checked.
 */
export const checkAllHeaderElementsLoaded = async (page: Page) => {
    const header = page.locator('.card-header');
    await expect(header).toBeVisible();

    // Проверяем остальные элементы в шапке
    const prevButton = header.locator('button[data-event="prev"]');
    await expect(prevButton).toBeVisible();

    const nextButton = header.locator('button[data-event="next"]');
    await expect(nextButton).toBeVisible();

    const calendarTitle = header.locator('.calendar-title');
    await calendarTitle.waitFor({ state: 'visible', timeout: 10000 });
    await expect(calendarTitle).toContainText('нояб.');

    const addTaskButton = header.locator('#addTaskBtn');
    await expect(addTaskButton).toBeVisible();
    await expect(addTaskButton).toHaveText(/Добавить задачу/);

    const todayButton = header.locator('.todayBtn');
    await expect(todayButton).toBeVisible();
    await expect(todayButton).toHaveText(/Сегодня/);

    const fullViewButton = header.locator('button[data-event="cutTimeView"]');
    await expect(fullViewButton).toBeVisible();
    await expect(fullViewButton).toHaveText(/Полный вид/);

    const refreshButton = header.locator('.refreshBtn');
    await expect(refreshButton).toBeVisible();

    const reportButton = header.locator('.btn-report.spreedsheet');
    await expect(reportButton).toBeVisible();

    const viewSwitcher = header.locator('.calViewSwitcher');
    await expect(viewSwitcher).toBeVisible();
    await expect(viewSwitcher).toHaveText(/Неделя/);
}