import { getExpenses, getDocuments, getOwners, getAssemblies, getBalances } from '../data/condoData';

export async function askAIStudio(question) {
  question = question.toLowerCase();

  if (question.includes('despesa') || question.includes('gasto')) {
    return await getExpenses();
  }

  if (question.includes('documento')) {
    return await getDocuments();
  }

  if (question.includes('proprietário') || question.includes('dono')) {
    return await getOwners();
  }

  if (question.includes('assembleia')) {
    return await getAssemblies();
  }

  if (question.includes('saldo') || question.includes('conta')) {
    return await getBalances();
  }

  return { error: 'Não encontrei nada relacionado com a pergunta.' };
}
