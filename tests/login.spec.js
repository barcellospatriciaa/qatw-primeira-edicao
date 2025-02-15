import { test, expect } from '@playwright/test';
import { obterCodigo2fa } from '../support/db';
import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';
import { LoginActions } from '../actions/LoginActions';

test('Não deve permitir logar após informar codigo invalido', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const usuario = {
    cpf: '00000014141',
    senha: '147258',
  };

  await loginPage.acessarPagina();
  await loginPage.informarCpf(usuario.cpf);
  await loginPage.informaSenha(usuario.senha);
  await loginPage.informa2FA('123456');

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('DP PageObject: Deve permitir logar após informar codigo válido', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashPage = new DashPage(page);

  const usuario = {
    cpf: '00000014141',
    senha: '147258',
  };

  await loginPage.acessarPagina();
  await loginPage.informarCpf(usuario.cpf);
  await loginPage.informaSenha(usuario.senha);
  
  await page.getByRole('heading', { name : 'Verificação em duas etapas' })
    .waitFor({timeout: 3000});

  const codigo =  await obterCodigo2fa(usuario.cpf);
  await loginPage.informa2FA(codigo);
  
 expect(await dashPage.validaSaldo()).toHaveText('R$ 5.000,00');

});

test('DP Actions: Deve permitir logar após informar codigo válido 2 ', async ({ page }) => {
  const loginActions = new LoginActions(page);

  const usuario = {
    cpf: '00000014141',
    senha: '147258',
  };

  await loginActions.acessarPagina();
  await loginActions.informarCpf(usuario.cpf);
  await loginActions.informaSenha(usuario.senha);
  
  await page.getByRole('heading', { name : 'Verificação em duas etapas' })
    .waitFor({timeout: 3000});

  const codigo =  await obterCodigo2fa(usuario.cpf);
  await loginActions.informa2FA(codigo);
  
 await expect(await loginActions.validaSaldo()).toHaveText('R$ 5.000,00');

});