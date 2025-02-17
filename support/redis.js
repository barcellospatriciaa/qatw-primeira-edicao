import { Queue } from "bullmq";

// objeto com a conexão com o Redis
const connection = {
  host: "paybank-redis",
  port: 6379,
};

// constate que define a fila de mensagens
const queueName = "twoFactorQueue";

// constante que faz a inscrição na fila usando a conexão com o Redis
const queue = new Queue(queueName, { connection });

export const getJob = async () => {
    const jobs = await queue.getJobs() // busca todos os jobs da fila
    console.log(jobs[0].data.code)
    return jobs[0].data.code
};

export const cleanJobs = async () => {
    await queue.obliterate() // limpa a fila do redis
}