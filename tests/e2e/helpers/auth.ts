import { Cookie, Page, expect } from '@playwright/test';

/**
 * Авторизация на сайте и возврат cookies.
 * @param {Page} page Экземпляр страницы Playwright.
 * @param {string} url URL для авторизации.
 * @param {string} username Имя пользователя.
 * @param {string} password Пароль.
 * @returns {Promise<void>} Возвращает Promise, который завершится после успешной авторизации.
 */
export async function authorizeAndGetCookies(page: Page, url: string, username: string, password: string): Promise<Cookie[]> {
    // Переход на страницу авторизации
    await page.goto(url);

    // Заполнение полей ввода
    await page.locator('input[placeholder="Имя пользователя"]').fill(username);
    await page.locator('input[placeholder="Пароль"]').fill(password);

    // Клик по кнопке "Войти"
    await page.locator('button:has-text("Войти")').click();

    // Ожидание, пока URL изменится на страницу после авторизации
    await page.waitForURL('https://telegram.giapdc.ru:8443/index.php/home?db=gdc', { timeout: 50000 });

    // Проверка URL страницы
    await expect(page).toHaveURL('https://telegram.giapdc.ru:8443/index.php/home?db=gdc', { timeout: 50000 });

    // Возвращаем cookies для дальнейшего использования
    return await page.context().cookies();
}
