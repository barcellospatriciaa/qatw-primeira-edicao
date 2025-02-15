export class DashPage {
  constructor(page) {
    this.page = page;
  }

  async validaSaldo() {
    return this.page.locator("#account-balance");
  }
}
