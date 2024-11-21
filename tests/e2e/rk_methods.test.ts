import { BrowserContext, expect, Locator, Page } from '@playwright/test';
import test from './fixtures';
import { chooseValueInSelector, fillMethodTime, waitForOptions } from './helpers/selectors';
import { checkAllHeaderElementsLoaded, checkHeaderSelectorsAreLoaded } from './helpers/header';
import { checkCalendarIsInWeekMode } from './helpers/calendar';
import { checkAddTaskModal, isAddEventModalAvailable } from './helpers/modals';
import { isMethodsAreaAvailable, selectCurrentDateAndOpenAddTaskModal, selectMethod } from './helpers/tasks';

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
            await chooseValueInSelector(authenticatedPage, '#locObj', 'Офис');
            console.log('Локация выбрана.');

            // Выбор значения в селекторе "Вид работ" с указанием конкретного значения
            await chooseValueInSelector(authenticatedPage, '#kindOfTasks', 'Техническое диагностирование');
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
            const addWooMetButton = modal.locator('#addWooMet');
            await expect(addWooMetButton).toBeVisible();
            await addWooMetButton.click();
        
            // Проверяем, что поле получило класс "is-invalid"
            await expect(wooTimeInput).toHaveClass(/is-invalid/);
        
            console.log('Валидация времени прошла успешно: поле wooTime получило класс is-invalid.');
        });

        await test.step('Проверка валидации пустого списка работников бригады при добавлении метода', async () => {
            // Ожидаем появления модального окна
            const modal = authenticatedPage.locator('#addEventModal');
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
            const modal = await isAddEventModalAvailable(authenticatedPage);

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
            await brigadeSelect.evaluate((select: any) => select.removeAttribute('hidden')); // Убираем атрибут "hidden", если он есть
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
            const taskInCalendar = authenticatedPage.locator('.fc-timegrid-event-harness').locator('text=Тестовая задача');
            await expect(taskInCalendar).toBeVisible();
            console.log('Задача успешно добавлена и отображена в календаре.');
        });

        await test.step('Проверка сохраненных данных задачи в календаре', async () => {
            // Ожидаем появления лоадера
            const loader = authenticatedPage.locator('.temploaderWrapper');
            await expect(loader).toBeVisible();
        
            // Ожидание скрытия лоадера
            await loader.waitFor({ state: 'hidden' });
            console.log('Лоадер успешно исчез.');
        
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
            //Находим тестовую задачу и кликаем на нее
            const taskInCalendar = authenticatedPage.locator('.fc-timegrid-event-harness').locator('text=Тестовая задача');
            taskInCalendar.click()
            //Проверяем что открылось окно с детальной информацией
            const eventDetailsModal = authenticatedPage.locator('#eventDetailsModal')
            await expect(eventDetailsModal).toBeVisible()
            //Находим кнопку Удалить и кликаем на нее
            const delEventBtn = eventDetailsModal.locator('#delEventBtn')
            await expect(delEventBtn).toBeVisible()

            delEventBtn.click()
            //Проверяем что окно с детальной информацией скрылось
            await expect(eventDetailsModal).toBeHidden()
            //Проверяем что тестовая задача отсутствует
            await expect(taskInCalendar).toBeHidden()

            console.log('Тестовая задача успешно удалена.');
        })
        
    });

    

    // test.afterAll(async () => {
    //     // Закрываем страницу и контекст после завершения всех тестов
    //     await page.close();
    //     await context.close();
    // });
});

