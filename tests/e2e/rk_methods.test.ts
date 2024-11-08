import { test, expect, BrowserContext, Page, Locator } from '@playwright/test';
import { authorizeAndGetCookies } from './helpers/auth';
import { CONFIG } from './config.e2e';

let context: BrowserContext;
let page: Page;

test.describe('Тестирование календаря', () => {
    test.beforeAll(async ({ browser }) => {
        // Создаем контекст
        context = await browser.newContext();

        // Создаем страницу для авторизации
        page = await context.newPage();

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
        await expect(page.locator('.card-header')).toBeVisible();
    });

    test('Проверка загрузки шапки календаря', async () => {
        const calendarHeader = page.locator('.card-header');
        await expect(calendarHeader).toBeVisible();
    });

    test('Проверка элементов в шапке календаря и календаря в недельном отображении', async () => {

        await test.step('Проверка элементов шапки', async () => {
            const header = page.locator('.card-header');
            await expect(header).toBeVisible();
        
            // Функция ожидания, пока количество опций в селекторе станет больше 1
                async function waitForOptions(locator: Locator, minCount: number, timeout: number = 30000): Promise<void> {
                    const startTime = Date.now();
                    while (true) {
                        const count = await locator.locator('option').count();
                        if (count > minCount) break; // Условие выполнено
                        if (Date.now() - startTime > timeout) {
                            throw new Error(`Timed out waiting for ${minCount + 1} options to load.`);
                        }
                        await new Promise((resolve) => setTimeout(resolve, 100)); // Короткая пауза перед повторной проверкой
                    }
                }
    
                // Ожидаем, пока выпадающий список пользователей загрузится
                const usersDropdown = header.locator('#otherUsers');
                await waitForOptions(usersDropdown, 1); // Ждем, пока опций станет больше 1
                const userOptionsCount = await usersDropdown.locator('option').count();
                expect(userOptionsCount).toBeGreaterThan(1); // Проверяем, что опций больше 1
    
                // Ожидаем, пока выпадающий список отделов загрузится
                const departmentsDropdown = header.locator('#otherUsersDepths');
                await waitForOptions(departmentsDropdown, 1); // Ждем, пока опций станет больше 1
                const departmentOptionsCount = await departmentsDropdown.locator('option').count();
                expect(departmentOptionsCount).toBeGreaterThan(1); // Проверяем, что опций больше 1
        
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
        
            console.log('Все элементы шапки успешно загружены.');
        });

        await test.step('Проверка недельного отображения календаря', async () => {
             // Проверка загрузки календаря в недельном отображении
                const weekViewContainer = page.locator('.fc-timeGridWeek-view');
                await expect(weekViewContainer).toBeVisible();

                const days = weekViewContainer.locator('[role="columnheader"]');
                await expect(days).toHaveCount(7);

                const expectedDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
                for (let i = 0; i < expectedDays.length; i++) {
                    const dayText = await days.nth(i).locator('.fc-col-header-cell-cushion').innerText();
                    expect(dayText.toLowerCase()).toContain(expectedDays[i]);
                }

            console.log('Шапка и недельный календарь успешно загружены.');
        });

        await test.step('Проверка появления окна добавления задачи', async () => {
            // Шаг 1: Выделяем день на календаре
            const dayCell = page.locator('.fc-timegrid-col[data-date="2024-11-08"]'); 
            await expect(dayCell).toBeVisible();
            await dayCell.click({ force: true });
    
            // Шаг 2: Проверяем, что окно добавления задачи появилось
            const addTaskModal = page.locator('#addEventModal');
            await expect(addTaskModal).toBeVisible();
    
            // Шаг 3: Проверяем элементы внутри модального окна
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
    
            console.log('Окно добавления задачи успешно проверено.');
        });

        await test.step('Добавление задачи: выбор значений и проверка методов', async () => {
            // Ожидаем появления модального окна добавления задачи
            const modal = page.locator('#addEventModal');
            await expect(modal).toBeVisible();
        
            // Выбор значения в селекторе "Локация"
            const locationDropdown = modal.locator('#locObj');
            await locationDropdown.selectOption({ index: 1 }); // Выбираем первое значение (после "Не выбрано")
            console.log('Локация выбрана.');
        
            // Выбор значения в селекторе "Вид работ"
            const kindOfTasksDropdown = modal.locator('#kindOfTasks');
            await kindOfTasksDropdown.selectOption({ label: 'Техническое диагностирование' });
            console.log('Вид работ: Техническое диагностирование выбран.');
        
            // Ожидание появления дополнительной области "Методы контроля"
            const wooContainer = modal.locator('.woo');
            await expect(wooContainer).toBeVisible();
        
        });
    });

   

    test.afterAll(async () => {
        // Закрываем страницу и контекст после завершения всех тестов
        await page.close();
        await context.close();
    });
});
