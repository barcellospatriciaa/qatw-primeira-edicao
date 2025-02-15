export class LoginActions{
    constructor(page) {
      this.page = page;
    }
  
    async acessarPagina() {
      await this.page.goto("http://paybank-mf-auth:3000/");
    }
  
    async informarCpf(cpf) {
      await this.page.getByRole("textbox", { name: "Digite seu CPF" }).fill(cpf);
      await this.page.getByRole("button", { name: "Continuar" }).click();
    }
  
    async informaSenha(senha) {
      for (const digito of senha) {
        await this.page.getByRole("button", { name: digito }).click();
      }
      await this.page.getByRole("button", { name: "Continuar" }).click();
    }
  
    async informa2FA(codigo) {
      await this.page.getByRole("textbox", { name: "000000" }).fill(codigo);
      await this.page.getByRole("button", { name: "Verificar" }).click();
    }
  
    async validaSaldo() {
        return this.page.locator("#account-balance");
      }
  }
  