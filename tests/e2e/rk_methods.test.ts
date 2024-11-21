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


    test('Тестирование работы с методом РК', async () => {
        test.setTimeout(150000);

           // Функция ожидания, пока количество опций в селекторе станет больше 1
        async function waitForOptions(locator: Locator, minCount: number, timeout: number = 50000): Promise<void> {
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

        await test.step('Проверка элементов шапки', async () => {
            const header = page.locator('.card-header');
            await expect(header).toBeVisible();
        
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
            // Получаем текущую дату в формате YYYY-MM-DD
            const currentDate = new Date().toISOString().split('T')[0];
            // Шаг 1: Выделяем день на календаре
            const dayCell = page.locator(`.fc-timegrid-col[data-date="${currentDate}"]`); 
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
            await waitForOptions(kindOfTasksDropdown, 1);
            await kindOfTasksDropdown.selectOption({ label: 'Техническое диагностирование' });
            console.log('Вид работ: Техническое диагностирование выбран.');
        
            // Ожидание появления дополнительной области "Методы контроля"
            const wooContainer = modal.locator('.woo');
            await expect(wooContainer).toBeVisible();
        
        });

        await test.step('Проверка появления полей для метода "РК (Классический)"', async () => {
            // Ожидаем появления модального окна добавления задачи
            const modal = page.locator('#addEventModal');
            await expect(modal).toBeVisible();
        
            // Ожидаем, пока появится область методов контроля
            const wooContainer = modal.locator('.woo');
            await expect(wooContainer).toBeVisible();
        
            // Выбираем метод контроля "РК (Классический)"
            const methodDropdown = modal.locator('#wooMethod');
            await methodDropdown.selectOption({ label: 'РК (Классический)' });
            console.log('Метод контроля "РК (Классический)" выбран.');
        
            // Ожидаем появления кастомного элемента селектора для бригады
            const brigadeChoices = modal.locator('.choices__inner'); // Ищем кастомный элемент
            await expect(brigadeChoices).toBeVisible();
            console.log('Кастомный селектор для выбора сотрудников бригады виден.');
        
            // Проверяем чекбокс "Я бригадир"
            const brigadirCheckbox = modal.locator('#brigadirCheckbox');
            await expect(brigadirCheckbox).toBeVisible();
            console.log('Чекбокс "Я бригадир" виден.');
        
            console.log('Дополнительные поля для метода "РК (Классический)" успешно проверены.');
        });

        await test.step('Проверка валидации времени (wooTime)', async () => {
            // Ожидаем появления модального окна
            const modal = page.locator('#addEventModal');
            await expect(modal).toBeVisible();
        
            // Очищаем или вводим некорректное значение в поле "wooTime"
            const wooTimeInput = modal.locator('#wooTime');
            await wooTimeInput.fill(''); // Пустое значение
        
            // Нажимаем на кнопку добавления метода
            const addWooMetButton = modal.locator('#addWooMet');
            await expect(addWooMetButton).toBeVisible();
            await addWooMetButton.click();
        
            // Проверяем, что поле получило класс "is-invalid"
            await expect(wooTimeInput).toHaveClass(/is-invalid/);
        
            console.log('Валидация времени прошла успешно: поле wooTime получило класс is-invalid.');
        });

        await test.step('Проверка валидации пустого списка работников бригады при добавлении метода', async () => {
            // Ожидаем появления модального окна
            const modal = page.locator('#addEventModal');
            await expect(modal).toBeVisible();
        
            // Заполняем поле "время" (если требуется)
            const wooTimeInput = modal.locator('#wooTime');
            await wooTimeInput.fill('0.5'); // Заполняем значение, например, 1 час
            await expect(wooTimeInput).toHaveValue('0.5');
        
            // Нажимаем на кнопку добавления метода
            const addWooMetButton = modal.locator('#addWooMet');
            await expect(addWooMetButton).toBeVisible();
            await addWooMetButton.click();
        
            // Проверяем, что поле "brigadeSelect" получает класс "is-invalid"
            const brigadeSelect = modal.locator('#brigadeSelect');
            await expect(brigadeSelect).toHaveClass(/is-invalid/);
        
            // Проверяем, что появляется сообщение с классом "invalid-feedback"
            const invalidFeedback = modal.locator('.invalid-feedback');
            await expect(invalidFeedback).toBeVisible();
            await expect(invalidFeedback).toHaveText('Необходимо выбрать хотя бы одного работника бригады.');
        
            console.log('Валидация пустого списка работников бригады прошла успешно.');
        });

        await test.step('Добавление задачи: заполнение формы и сохранение', async () => {
            const modal = page.locator('#addEventModal');
            await expect(modal).toBeVisible();

            // Получаем текущую дату
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('ru-RU'); // Форматируем дату в формате DD.MM.YYYY
            const startTime = '09:00'; // Время начала
            const endTime = '14:30'; // Время окончания
        
            // Заполняем название задачи
            const taskTitleInput = modal.locator('#eventTitle');
            await taskTitleInput.fill('Тестовая задача');
            await expect(taskTitleInput).toHaveValue('Тестовая задача');
        
            // Выбираем занятость
            const employmentDropdown = modal.locator('#employment');
            await employmentDropdown.selectOption('Работа');
        
            // Выбираем объект
            const taskObjDropdown = modal.locator('#taskObj');
            await taskObjDropdown.selectOption({ index: 1 });
        
            // Указываем локацию
            const locObjDropdown = modal.locator('#locObj');
            await locObjDropdown.selectOption('Офис');
        
            // Указываем дату начала
            const startDateInput = modal.locator('#eventStartDate');
            await startDateInput.fill(`${formattedDate} ${startTime}`);
            await expect(startDateInput).toHaveValue(`${formattedDate} ${startTime}`);

            // Указываем дату окончания
            const endDateInput = modal.locator('#eventEndDate');
            await endDateInput.fill(`${formattedDate} ${endTime}`);
            await expect(endDateInput).toHaveValue(`${formattedDate} ${endTime}`);
        
            // Выбираем вид работ
            const kindOfTasksDropdown = modal.locator('#kindOfTasks');
            await kindOfTasksDropdown.selectOption('Техническое диагностирование');
        
            // Выбираем метод контроля
            const wooMethodDropdown = modal.locator('#wooMethod');
            await wooMethodDropdown.selectOption('РК (Классический)');
        
            // Указываем длительность
            const wooTimeInput = modal.locator('#wooTime');
            await wooTimeInput.fill('1');
        
            // Убедимся, что список работников доступен
            const brigadeDropdown = modal.locator('.choices__inner');
            await expect(brigadeDropdown).toBeVisible();
        
            // Добавляем сотрудника в список работников
            const brigadeSelect = modal.locator('#brigadeSelect');
            await brigadeSelect.evaluate((select) => select.removeAttribute('hidden')); // Убираем атрибут "hidden", если он есть
            await brigadeSelect.selectOption({ label: 'Абужаков Д.К.' });

            // Отмечаем чекбокс "Я бригадир"
            const brigadirCheckbox = modal.locator('#brigadirCheckbox');
            await expect(brigadirCheckbox).toBeVisible();
            await brigadirCheckbox.check();
            await expect(brigadirCheckbox).toBeChecked();
        
            console.log('Форма заполнена успешно.');
        
            // Нажимаем кнопку "Добавить"
            const addTaskButton = modal.locator('#addTaskToCalBtn');
            await addTaskButton.click();
        
            // Проверяем, что модальное окно закрылось
            await expect(modal).toBeHidden();
        
            // Проверяем, что задача добавилась в календарь
            const taskInCalendar = page.locator('.fc-timegrid-event-harness').locator('text=Тестовая задача');
            await expect(taskInCalendar).toBeVisible();
            console.log('Задача успешно добавлена и отображена в календаре.');
        });

        await test.step('Проверка сохраненных данных задачи в календаре', async () => {
            // Ожидаем появления лоадера
            const loader = page.locator('.temploaderWrapper');
            await expect(loader).toBeVisible();
        
            // Ожидание скрытия лоадера
            await loader.waitFor({ state: 'hidden' });
            console.log('Лоадер успешно исчез.');
        
            // Уточняем селектор задачи по её уникальным характеристикам
            const taskInCalendarHeader = page.locator('div.contentLayoutHeader')
                .filter({ has: page.locator('text=Тестовая задача') });
            
        
            // Убеждаемся, что задача появилась
            await expect(taskInCalendarHeader).toBeVisible({ timeout: 10000 });
        
            // Проверяем отображение названия задачи
            const taskTitle = taskInCalendarHeader.locator('.title');
            await expect(taskTitle).toBeVisible();
            await expect(taskTitle).toHaveText('Тестовая задача');
            console.log('Тестовая задача найдена в календаре.');
        
            // Проверяем отображение времени
            const taskTime = taskInCalendarHeader.locator('.factTime b');
            await expect(taskTime).toBeVisible();
            await expect(taskTime).toHaveText('5.5');
            console.log('В задаче указано верное время.');

            // Задача
            const taskInCalendar = page.locator('.fc-event-main')
        
            // Проверяем отображение локации (уточняем локатор)
            const taskLocation = taskInCalendar.locator('div').filter({ hasText: 'Офис' }).first();
            await taskLocation.waitFor({ state: 'attached' }); // Убедимся, что элемент существует
            await expect(taskLocation).toBeVisible();
            await expect(taskLocation).toHaveText('Офис');
            console.log('Локация указана верно.');
        
            // Проверяем отображение объекта
            const taskObject = taskInCalendar.locator('.eventObject');
            await expect(taskObject).toBeVisible();
            await expect(taskObject).toHaveText('АО "Глазовский завод "Химмаш"');
            console.log('Объект указан верно.');
        
            // Проверяем отображение вида работ
            const taskType = taskInCalendar.locator('.eventTaskType');
            await expect(taskType).toBeVisible();
            await expect(taskType).toHaveText('Техническое диагностирование');
            console.log('Вид работ указан верно.');
        
            // Проверяем отображение метода контроля
            const taskMethod = taskInCalendar.locator('.eventMethodsWrapper').locator('text=РК (Классический)-1ч');
            await expect(taskMethod).toBeVisible();
            console.log('Метод указан верно.');
        
            // Проверяем отображение сотрудника
            const taskBrigadeMember = taskInCalendar.locator('.eventMethodsWrapper').locator('text=Абужаков Д.К.');
            await expect(taskBrigadeMember).toBeVisible();
            console.log('Список бригады соответствует');
        
            // Проверяем наличие иконки fa-user (отвечает за чекбокс "Я бригадир")
            const brigadirIcon = taskInCalendar.locator('.eventMethodsWrapper').locator('svg[data-icon="user"]');
            await expect(brigadirIcon).toBeVisible();
            console.log('Данные о бригадире отображаются верно.');
        
        
            console.log('Все данные задачи в календаре успешно проверены.');
        });

        // await test.step('Удаление тестовой задачи', async () => {


        //     console.log('Тестовая задача успешно удалена.');
        // })
        
        
    });

    

    test.afterAll(async () => {
        // Закрываем страницу и контекст после завершения всех тестов
        await page.close();
        await context.close();
    });
});
