import { addEventToCal } from '../../assets/js/actions/addEvent';

// Мокируем необходимые зависимости
jest.mock('../../assets/js/api/getDropDownData.js', () => ({
  addDataToSelector: jest.fn(),
  getTypesOfWorkOptions: jest.fn(),
}));

describe('addEventToCal function', () => {
  let calendar;
  let eventTaskModalBtn;
  let mockAddEventToUser;

  beforeEach(() => {
    // Создаем заглушку для календаря и элемента кнопки
    calendar = {};
    eventTaskModalBtn = document.createElement('button');
    eventTaskModalBtn.id = 'addTaskToCalBtn';

    // Создаем заглушку для addEventToUser
    mockAddEventToUser = jest.fn();

    // Заменяем метод getElementById, чтобы он возвращал созданный элемент кнопки
    document.getElementById = jest.fn((id) =>
      id === 'addTaskToCalBtn' ? eventTaskModalBtn : null,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set up event listener on button click', () => {
    // Вызываем функцию
    addEventToCal(calendar);

    // Проверяем, что addEventToUser был вызван при клике
    eventTaskModalBtn.click();

    // Проверяем, что addEventToUser был вызван с аргументом calendar
    expect(mockAddEventToUser).toHaveBeenCalledWith(calendar);
  });

  it('should not set up event listener if button not found', () => {
    // Переопределяем getElementById, чтобы вернуть null исключительно для этого теста
    document.getElementById = jest.fn(() => null);

    // Вызываем функцию
    addEventToCal(calendar);

    // Проверяем, что addEventToUser не был вызван
    expect(mockAddEventToUser).not.toHaveBeenCalled();
  });
});
