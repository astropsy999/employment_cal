export const filterUsersFormanagers = () => {
  const userSelectorEl = document.querySelector('#otherUsers');
  const depSelectorEl = document.querySelector('#otherUsersDepths');
  const selectedDep = depSelectorEl.value;

  userSelectorEl.querySelectorAll('option').forEach((option) => {
    // Получаем атрибут dep текущей опции
    const optionDep = option.getAttribute('dep');

    // Показываем/скрываем опции в зависимости от выбранного значения
    if (optionDep === selectedDep || selectedDep === '') {
      option.style.display = 'block'; // Показываем опцию
      const options = userSelectorEl.options;
    } else if (selectedDep === 'Все отделы') {
      option.style.display = 'block';
    } else {
      option.style.display = 'none'; // Скрываем опцию
    }
  });

  const chooseUserOption = document.createElement('option');
  chooseUserOption.value = chooseUserOption.innerText = 'Выберите сотрудника';
  chooseUserOption.setAttribute('selected', 'selected');
  chooseUserOption.setAttribute('disabled', 'disabled');
  const allOptions = [...userSelectorEl.options].filter(
    (o) => o.innerText === 'Выберите сотрудника',
  );
  userSelectorEl.remove(allOptions[0]);

  userSelectorEl.insertAdjacentElement('afterbegin', chooseUserOption);

  depSelectorEl.setAttribute('title', selectedDep);
};
