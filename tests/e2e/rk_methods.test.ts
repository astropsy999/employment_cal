import { BrowserContext, expect, Locator, Page } from '@playwright/test';
import test from './fixtures';
import { chooseValueInSelect, fillDateTime, fillInputValue, fillMethodTime, waitForOptions } from './helpers/selectors';
import { checkAllHeaderElementsLoaded, checkHeaderSelectorsAreLoaded } from './helpers/header';
import { checkCalendarIsInWeekMode } from './helpers/calendar';
import { checkAddTaskModal, isAddEventModalAvailable } from './helpers/modals';
import { checkTaskInCalendar, deleteTestTask, isMethodsAreaAvailable, selectCurrentDateAndOpenAddTaskModal, selectMethod } from './helpers/tasks';
import { clickAddMethodButton, clickAddTaskButton, toggleCheckbox } from './helpers/buttons';
import { add } from 'lodash';

let context: BrowserContext;
let page: Page;

/**
 * Условия для тестирования: 
 * 1) Тестирование должно происходить в режиме менеджера
 * 2) На текущую дату в календаре не должно быть добавлено задач
 */

test.describe('Тестирование календаря', () => {
    test('Тестирование работы с методом РК', async ({authenticatedPage}) => {
        test.setTimeout(150000); // Общее время выполнения теста в мс

        await test.step('Проверка элементов шапки', async () => {

            await checkHeaderSelectorsAreLoaded(authenticatedPage);
            await checkAllHeaderElementsLoaded(authenticatedPage);
        
            console.log('Все элементы шапки успешно загружены.');
        });

        await test.step('Проверка недельного отображения календаря', async () => {
             // Проверка загрузки календаря в недельном отображении
            await checkCalendarIsInWeekMode(authenticatedPage);
            console.log('Шапка и недельный календарь успешно загружены.');
        });

        await test.step('Проверка появления окна добавления задачи', async () => {
            await checkAddTaskModal(authenticatedPage);
            console.log('Окно добавления задачи успешно проверено.');
        });

        await test.step('Добавление задачи: выбор значений и проверка методов', async () => {

            await selectCurrentDateAndOpenAddTaskModal(authenticatedPage);
        
            // Выбор значения в селекторе "Локация"
            await chooseValueInSelect(authenticatedPage, '#locObj', 'Офис');
            console.log('Локация выбрана.');

            // Выбор значения в селекторе "Вид работ" с указанием конкретного значения
            await chooseValueInSelect(authenticatedPage, '#kindOfTasks', 'Техническое диагностирование');
            console.log('Вид работ: Техническое диагностирование выбран.');
        
            await isMethodsAreaAvailable(authenticatedPage)
        
        });

        await test.step('Проверка появления полей для метода "РК (Классический)"', async () => {
            
            await selectMethod(authenticatedPage, 'РК (Классический)');
        
            console.log('Дополнительные поля для метода "РК (Классический)" успешно проверены.');
        });

        await test.step('Проверка валидации времени (wooTime)', async () => {
            // Ожидаем появления модального окна
            const modal = await isAddEventModalAvailable(authenticatedPage);
        
            // Очищаем или вводим некорректное значение в поле "Время"
            const wooTimeInput = await fillMethodTime(authenticatedPage, '');
        
            // Нажимаем на кнопку добавления метода
            await clickAddMethodButton(modal);
        
            // Проверяем, что поле получило класс "is-invalid"
            await expect(wooTimeInput).toHaveClass(/is-invalid/);
        
            console.log('Валидация времени прошла успешно: поле wooTime получило класс is-invalid.');
        });

        await test.step('Проверка валидации пустого списка работников бригады при добавлении метода', async () => {
            // Ожидаем появления модального окна
            const modal = await isAddEventModalAvailable(authenticatedPage);
        
            // Заполняем поле "время" 
            await fillMethodTime(authenticatedPage, '0.5');
        
            // Нажимаем на кнопку добавления метода
            await clickAddMethodButton(modal);
        
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
            const modal = await isAddEventModalAvailable(authenticatedPage);
        
            // Заполняем название задачи
            await fillInputValue(authenticatedPage, '#eventTitle', 'Тестовая задача');
        
            // Выбираем занятость
            await chooseValueInSelect(authenticatedPage, '#employment', 'Работа');
        
            // Выбираем объект
            chooseValueInSelect(authenticatedPage, '#taskObj');
        
            // Указываем локацию
            await chooseValueInSelect(authenticatedPage, '#locObj', 'Офис');

            // Вводим дату-время начала и окончания

            await fillDateTime(modal, '09:00', '14:30');

            // Выбираем вид работ
            await chooseValueInSelect(authenticatedPage, '#kindOfTasks', 'Техническое диагностирование');
        
            // Выбираем метод контроля
            await chooseValueInSelect(authenticatedPage, '#wooMethod', 'РК (Классический)');
        
            // Указываем длительность
            await fillMethodTime(authenticatedPage, '1');
        
            // Убедимся, что список работников доступен
            const brigadeDropdown = modal.locator('.choices__inner');
            await expect(brigadeDropdown).toBeVisible();
        
            // Добавляем сотрудника в список работников
            const brigadeSelect = modal.locator('#brigadeSelect');
            await brigadeSelect.evaluate((select: any) => select.removeAttribute('hidden')); // Убираем атрибут "hidden", если он есть
            await brigadeSelect.selectOption({ label: 'Абужаков Д.К.' });

            // Отмечаем чекбокс "Я бригадир"
            const brigadirCheckbox = modal.locator('#brigadirCheckbox');

            await toggleCheckbox(brigadirCheckbox);
        
            console.log('Форма заполнена успешно.');
        
            // Нажимаем кнопку "Добавить"
            await clickAddTaskButton(modal);
        
            // Проверяем, что модальное окно закрылось
            await expect(modal).toBeHidden();
        
            // // Проверяем, что задача добавилась в календарь
            await checkTaskInCalendar(authenticatedPage, 'Тестовая задача');
            console.log('Задача успешно добавлена и отображена в календаре.');
        });

        await test.step('Проверка сохраненных данных задачи в календаре', async () => {
            // Ожидаем появления лоадера
            const loader = authenticatedPage.locator('.temploaderWrapper');
            await expect(loader).toBeVisible();
        
            // Ожидание скрытия лоадера
            await loader.waitFor({ state: 'hidden' });
            console.log('Лоадер скрыт.');
        
            // Уточняем селектор задачи по её уникальным характеристикам
            const taskInCalendarHeader = authenticatedPage.locator('div.contentLayoutHeader')
                .filter({ has: authenticatedPage.locator('text=Тестовая задача') });
        
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
            const taskInCalendar = authenticatedPage.locator('.fc-event-main')
        
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

        await test.step('Удаление тестовой задачи', async () => {
            await deleteTestTask(authenticatedPage, 'Тестовая задача');
        })
        
    });

    

    // test.afterAll(async () => {
    //     // Закрываем страницу и контекст после завершения всех тестов
    //     await page.close();
    //     await context.close();
    // });
});

