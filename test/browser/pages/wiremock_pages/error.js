module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  getSomethingWentWrongMessage() {
    return "    Sorry, there is a problem";
  }

  getSomethingWentWrongMessagWelsh() {
    return "    Mae’n ddrwg gennym, mae problem";
  }

  getErrorTitle() {
    return this.page.textContent('[data-page="error"]');
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }
};
