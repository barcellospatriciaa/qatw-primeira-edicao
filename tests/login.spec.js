import { test, expect } from '@playwright/test';
import { obterCodigo2fa } from '../support/db';
import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';
import { LoginActions } from '../actions/LoginActions';
import { cleanJobs, getJob } from '../support/redis';


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

  await cleanJobs();

  await loginPage.acessarPagina();
  await loginPage.informarCpf(usuario.cpf);
  await loginPage.informaSenha(usuario.senha);
  
  //* Essa espera, diferente de um await convencional que apenas aguarda por 3s para fazer alguma coisa,
  // * tem por objetivo aguardar o elemento que exibe verificação em duas etapas para então pegar o ultimo código 2FA
  //* então aqui tem até 3s para aparecer o elemento para depois buscar o código, caso contrário, o teste falha.
  
  await page.getByRole('heading', { name : 'Verificação em duas etapas' })
    .waitFor({timeout: 3000});

    // * busca no Redis o código 2FA
    const codigo = await getJob();

    // * busca no banco de dados o código 2FA 
  // const codigo =  await obterCodigo2fa(usuario.cpf);

  await loginPage.informa2FA(codigo);
  
 await expect(await dashPage.validaSaldo()).toHaveText('R$ 5.000,00');

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