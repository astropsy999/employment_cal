// fixtures.ts

import { test as base, BrowserContext, Page } from '@playwright/test';
import { authorizeAndGetCookies } from './helpers/auth';
import { CONFIG } from './config.e2e';

// Определяем типы для новых фикстур
type MyFixtures = {
    authenticatedPage: Page;
};

// Расширяем базовый тест с новыми фикстурами
export const test = base.extend<MyFixtures>({
    authenticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // Авторизация и получение cookies
        const cookies = await authorizeAndGetCookies(
            page,
            CONFIG.AUTH.url,
            CONFIG.AUTH.username,
            CONFIG.AUTH.password
        );

        // Добавляем cookies в контекст
        await context.addCookies(cookies);

        // Переход на страницу календаря
        await page.goto(CONFIG.APP.url);

        // Проверяем, что шапка календаря видна
        await page.locator('.card-header').waitFor({ state: 'visible', timeout: 10000 });

        await use(page);

        // После использования фикстуры, закрываем страницу и контекст
        await page.close();
        await context.close();
    },

});

// Экспортируем базовый тест с расширенными фикстурами
export default test;
