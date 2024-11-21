import { expect, Locator, Page,  } from "playwright/test";

export const checkCalendarIsInWeekMode = async (page: Page) => {
     // Проверка загрузки календаря в недельном отображении
    const weekViewContainer = page.locator('.fc-timeGridWeek-view');
    expect(weekViewContainer).toBeVisible();

    const days = weekViewContainer.locator('[role="columnheader"]');
    await expect(days).toHaveCount(7);

    const expectedDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    for (let i = 0; i < expectedDays.length; i++) {
        const dayText = await days.nth(i).locator('.fc-col-header-cell-cushion').innerText();
        expect(dayText.toLowerCase()).toContain(expectedDays[i]);
    }
}