import { Queue } from "bullmq";

// objeto com a conexão com o Redis
const connection = {
  host: "paybank-redis",
  port: 6379,
};

// constante que define a fila de mensagens
const queueName = "twoFactorQueue";

// constante que faz a inscrição na fila usando a conexão com o Redis
const queue = new Queue(queueName, { connection });

export const getJob = async () => {
    const jobs = await queue.getJobs() // busca todos os jobs da fila
    console.log(jobs[0].data.code) // vou deixar esse cara que ta imprimindo o código
    return jobs[0].data.code // retorna o código do primeiro job
};

export const cleanJobs = async () => {
    await queue.obliterate() // limpa a fila do redis
}

//? Obs.:  a função cleanJobs() vai limpar a fila twoFactorQueue para que a função getJob() possa pegar o primeiro código 2FA que chegar na fila.
//? garantindo que o primeiro código 2FA que chegar na fila seja o código que o teste vai usar para fazer a verificação em duas etapas.