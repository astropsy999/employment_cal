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
export async function chooseValueInSelector(page: Page, selector: string, value: string | undefined = undefined) {
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
        console.log(`В селекторе "${selector}" выбрано первое значение: "${selectedOption!.trim()}".`);
    }
}

export async function fillMethodTime(page:Page, timeValue: string) {
    const modal = await isMethodsAreaAvailable(page)

    const wooTimeInput = modal.locator('#wooTime');
    await wooTimeInput.fill(timeValue); 

    return wooTimeInput;
}
