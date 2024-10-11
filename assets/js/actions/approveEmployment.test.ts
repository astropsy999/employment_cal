import { Calendar, EventInput } from '@fullcalendar/core';
import { approveEmploynment } from './approveEmploynment';
import { approveEventsApi } from '../api/approveEvents';
import { fullCalendar } from '../utils/fullcalendar';
import { blockBtnAddTitle } from '../utils/mainGlobFunctions';
import { generateDaysCheckboxes } from './generateDaysCheckboxes';
import { fireEvent, screen } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

// Мокаем внешние модули и функции
jest.mock('../api/approveEvents');
jest.mock('../utils/fullcalendar');
jest.mock('../utils/mainGlobFunctions');
jest.mock('./generateDaysCheckboxes');

describe('approveEmploynment', () => {
  let calendar: Calendar;
  let approveBtn: HTMLButtonElement;
  let approveActionBtn: HTMLButtonElement;
  let otherUsersSelector: HTMLSelectElement;
  let userSurname: HTMLSpanElement;
  let dailyApproveContainer: HTMLDivElement;
  let startApproveDate: HTMLSpanElement;
  let endApproveDate: HTMLSpanElement;

  beforeEach(() => {
    // Очистка DOM перед каждым тестом
    document.body.innerHTML = '';

    // Создаем необходимые элементы DOM
    approveBtn = document.createElement('button');
    approveBtn.className = 'approveBtn';
    document.body.appendChild(approveBtn);

    approveActionBtn = document.createElement('button');
    approveActionBtn.className = 'approve-action';
    document.body.appendChild(approveActionBtn);

    otherUsersSelector = document.createElement('select');
    otherUsersSelector.id = 'otherUsers';
    const option = document.createElement('option');
    option.textContent = 'Иванов';
    otherUsersSelector.appendChild(option);
    document.body.appendChild(otherUsersSelector);

    userSurname = document.createElement('span');
    userSurname.className = 'userSurname';
    document.body.appendChild(userSurname);

    dailyApproveContainer = document.createElement('div');
    dailyApproveContainer.className = 'dailyApprove';
    document.body.appendChild(dailyApproveContainer);

    startApproveDate = document.createElement('span');
    startApproveDate.className = 'startApproveDate';
    document.body.appendChild(startApproveDate);

    endApproveDate = document.createElement('span');
    endApproveDate.className = 'endApproveDate';
    document.body.appendChild(endApproveDate);

    const approveEmplModal = document.createElement('div');
    approveEmplModal.id = 'approveEmplModal';
    document.body.appendChild(approveEmplModal);

    // Мокаем календарь
    calendar = new Calendar(document.createElement('div'), {
      initialView: 'dayGridWeek',
      initialDate: '2023-10-01',
      events: [
        { title: 'Event 1', start: '2023-10-02' },
        { title: 'Event 2', start: '2023-10-03' },
      ],
    });

    // Мокаем методы календаря
    jest.spyOn(calendar, 'getEvents').mockReturnValue([
      { title: 'Event 1', start: new Date('2023-10-02') } as any,
      { title: 'Event 2', start: new Date('2023-10-03') } as any,
    ]);

    // Вызываем функцию, которую будем тестировать
    approveEmploynment(calendar);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен отображать фамилию выбранного пользователя при нажатии на approveBtn', () => {
    fireEvent.click(approveBtn);
    expect(userSurname.textContent).toBe('Иванов');
  });

  it('должен показать модальное окно при нажатии на approveBtn', () => {
    const modalShowSpy = jest.fn();
    // Мокаем Modal из bootstrap
    jest.mock('bootstrap', () => ({
      Modal: jest.fn().mockImplementation(() => ({
        show: modalShowSpy,
        hide: jest.fn(),
      })),
    }));

    fireEvent.click(approveBtn);

    expect(modalShowSpy).toHaveBeenCalled();
  });

  it('должен корректно отображать даты начала и окончания', () => {
    fireEvent.click(approveBtn);

    expect(startApproveDate.textContent).toBe('02.10.2023');
    expect(endApproveDate.textContent).toBe('03.10.2023');
  });

  it('должен вызвать generateDaysCheckboxes с правильными параметрами', () => {
    fireEvent.click(approveBtn);

    expect(generateDaysCheckboxes).toHaveBeenCalledWith(
      dailyApproveContainer,
      expect.arrayContaining([
        expect.objectContaining({ start: new Date('2023-10-02') }),
        expect.objectContaining({ start: new Date('2023-10-03') }),
      ])
    );
  });

  it('должен вызвать approveEventsApi с выбранными событиями при подтверждении', async () => {
    (approveEventsApi as jest.Mock).mockResolvedValueOnce(true);

    fireEvent.click(approveBtn);

    // Добавляем чекбоксы в dailyApproveContainer
    const checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    checkbox1.value = '02.10.2023';
    checkbox1.checked = true;
    dailyApproveContainer.appendChild(checkbox1);

    const checkbox2 = document.createElement('input');
    checkbox2.type = 'checkbox';
    checkbox2.value = '03.10.2023';
    checkbox2.checked = false;
    dailyApproveContainer.appendChild(checkbox2);

    fireEvent.click(approveActionBtn);

    expect(approveEventsApi).toHaveBeenCalledWith([
      expect.objectContaining({ start: new Date('2023-10-02') }),
    ]);
  });

  it('должен отображать ошибку, если не выбрано ни одно событие', () => {
    window.alert = jest.fn();

    fireEvent.click(approveBtn);

    // Ни один чекбокс не выбран
    const checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    checkbox1.value = '02.10.2023';
    checkbox1.checked = false;
    dailyApproveContainer.appendChild(checkbox1);

    fireEvent.click(approveActionBtn);

    expect(window.alert).toHaveBeenCalledWith(
      'Пожалуйста, выберите хотя бы одно событие для согласования.'
    );
  });

  it('должен обновлять UI после успешного согласования', async () => {
    (approveEventsApi as jest.Mock).mockResolvedValueOnce(true);

    const modalHideSpy = jest.fn();
    // Мокаем Modal из bootstrap
    jest.mock('bootstrap', () => ({
      Modal: jest.fn().mockImplementation(() => ({
        show: jest.fn(),
        hide: modalHideSpy,
      })),
    }));

    fireEvent.click(approveBtn);

    // Добавляем выбранный чекбокс
    const checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    checkbox1.value = '02.10.2023';
    checkbox1.checked = true;
    dailyApproveContainer.appendChild(checkbox1);

    fireEvent.click(approveActionBtn);

    // Ждем выполнения промиса
    await Promise.resolve();

    expect(approveActionBtn.textContent).toBe('Согласовано');

    // Проверяем, что modal.hide был вызван после задержки
    jest.advanceTimersByTime(800);
    expect(modalHideSpy).toHaveBeenCalled();

    expect(blockBtnAddTitle).toHaveBeenCalledWith(approveBtn);
    expect(approveActionBtn.disabled).toBe(false);
    expect(approveActionBtn.textContent).toBe('Да');
    expect(fullCalendar.fullCalendarInit).toHaveBeenCalled();
    expect(calendar.render).toHaveBeenCalled();
  });

  it('должен отображать ошибку при неудачном согласовании', async () => {
    (approveEventsApi as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
    window.alert = jest.fn();
    console.error = jest.fn();

    fireEvent.click(approveBtn);

    // Добавляем выбранный чекбокс
    const checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    checkbox1.value = '02.10.2023';
    checkbox1.checked = true;
    dailyApproveContainer.appendChild(checkbox1);

    fireEvent.click(approveActionBtn);

    // Ждем выполнения промиса
    await Promise.resolve();

    expect(console.error).toHaveBeenCalledWith(
      'Ошибка при согласовании событий:',
      expect.any(Error)
    );
    expect(window.alert).toHaveBeenCalledWith(
      'Произошла ошибка при согласовании событий. Пожалуйста, попробуйте снова.'
    );
    expect(approveActionBtn.disabled).toBe(false);
  });
});
