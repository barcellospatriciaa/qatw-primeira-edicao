import pgPromise from "pg-promise";

const pgp = pgPromise();
const db = pgp('postgresql://dba:dba@paybank-db:5432/UserDB') // conexão com o banco de dados

export async function obterCodigo2fa(){ 
    const query = `
        SELECT code 
	    FROM public."TwoFactorCode"
	    ORDER BY ID DESC
        LIMIT 1;
    `
    const resultado = await db.oneOrNone(query) // essa função retorna um registro ou nulo
    return resultado.code
}