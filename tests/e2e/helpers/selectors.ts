import { expect, Locator, Page } from "playwright/test";
import { isMethodsAreaAvailable } from "./tasks";

// Функция ожидания, пока количество опций в селекторе станет больше 1
export async function waitForOptions(locator: Locator, minCount: number, timeout: number = 50000): Promise<void> {
    const startTime = Date.now();
    while (true) {
        const count = await locator.locator('option').count();
        if (count > minCount) break; // Условие выполнено
        if (Date.now() - startTime > timeout) {
            throw new Error(`Timed out waiting for ${minCount + 1} options to load.`);
        }
        await new Promise((resolve) => setTimeout(resolve, 500)); // Короткая пауза перед повторной проверкой
    }
}

/**
 * Выбирает значение в селекторе. Если значение не указано, выбирает первое доступное значение.
 *
 * @param {Page} page - Объект страницы Playwright.
 * @param {string} selector - Селектор элемента селектора.
 * @param {string} [value] - Значение, которое необходимо выбрать. Если не указано, выбирается первое значение.
 */
export async function chooseValueInSelect(page: Page, selector: string, value: string | undefined = undefined) {
    const dropdown = page.locator(selector);

    // Убедимся, что селектор видим
    await expect(dropdown).toBeVisible();

    if (value) {
        // Попытка выбрать опцию по метке (label)
        try {
            await dropdown.selectOption({ label: value });
            console.log(`В селекторе "${selector}" выбрано значение: "${value}".`);
        } catch (error) {
            // Если не удалось выбрать по label, попробуем выбрать по значению (value)
            console.warn(`Не удалось выбрать по label "${value}" в селекторе "${selector}". Пытаемся выбрать по значению...`);
            await dropdown.selectOption({ value: value });
            console.log(`В селекторе "${selector}" выбрано значение по value: "${value}".`);
        }
    } else {
        // Получение всех доступных опций
        const options = await dropdown.locator('option').all();

        if (options.length === 0) {
            throw new Error(`Селектор "${selector}" не содержит доступных опций для выбора.`);
        }

        // Выбор первой доступной опции пропуская Не выбрано (индекс 1)
        await dropdown.selectOption({ index: 1 });
        const selectedOption = await options[0].textContent();
        console.log(`В селекторе "${selector}" выбрано первое значение.`);
    }
}

/**
 * Заполнение поля "Время" (wooTime) в модальном окне добавления задачи.
 * 
 * @param {Page} page - Страница, на которой необходимо заполнить поле.
 * @param {string} timeValue - Значение, которое необходимо ввести в поле.
 * @returns {Promise<Locator>} - Locator на заполненный input.
 */
export async function fillMethodTime(page:Page, timeValue: string) {
    const modal = await isMethodsAreaAvailable(page)

    const wooTimeInput = modal.locator('#wooTime');
    await wooTimeInput.fill(timeValue); 

    return wooTimeInput;
}

export async function fillInputValue(page: Page, selector: string, value: string) {
    const input = page.locator(selector);
    await input.fill(value);
    await expect(input).toHaveValue(value);
}

/**
 * Устанавливает дату и время начала и окончания события в модальном окне.
 *
 * @param {Locator} modal - Локатор модального окна, содержащего поля для ввода дат.
 * @param {string} startTime - Время начала события в формате `HH:mm` (например, "09:00").
 * @param {string} endTime - Время окончания события в формате `HH:mm` (например, "14:30").
 * @param {string|null} [date=null] - Дата события в формате `DD.MM.YYYY`. Если не указана, используется текущая дата.
 *
 * @throws {Error} Если значения полей не совпадают с ожидаемыми.
 *
 * @example
 * // Установить дату и время на сегодня:
 * await chooseDateTime(modal, '09:00', '14:30');
 *
 * @example
 * // Установить дату и время на заданный день:
 * await chooseDateTime(modal, '09:00', '14:30', '25.11.2024');
 */
export async function fillDateTime(
    modal: Locator,
    startTime: string,
    endTime: string,
    date: string | null = null
) {
    // Если дата не указана, используем текущую дату
    const currentDate = date || new Date().toLocaleDateString('ru-RU');

    // Указываем дату и время начала
    const startDateInput = modal.locator('#eventStartDate');
    await startDateInput.fill(`${currentDate} ${startTime}`);
    await expect(startDateInput).toHaveValue(`${currentDate} ${startTime}`);

    // Указываем дату и время окончания
    const endDateInput = modal.locator('#eventEndDate');
    await endDateInput.fill(`${currentDate} ${endTime}`);
    await expect(endDateInput).toHaveValue(`${currentDate} ${endTime}`);
}



