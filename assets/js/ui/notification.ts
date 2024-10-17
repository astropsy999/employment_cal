export const showError = (message: string) => {
    // Реализуйте отображение ошибки, например, через Bootstrap Alert
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    if (alertPlaceholder) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = [
        `<div class="alert alert-danger alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>',
      ].join('');
      alertPlaceholder.append(wrapper);
    }
  };