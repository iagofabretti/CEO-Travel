================================================================================
FORMULÁRIO CEO TRAVEL - INSTRUÇÕES DE CONFIGURAÇÃO
================================================================================

Este formulário envia automaticamente as respostas dos clientes para um Google Sheets.

================================================================================
PASSO 1: CRIAR O GOOGLE SHEETS
================================================================================

1. Acesse https://sheets.google.com e crie uma nova planilha
2. Nomeie a planilha como "CEO Travel - Respostas Formulário"
3. Na primeira linha, adicione os seguintes cabeçalhos (colunas):

   A1: Timestamp
   B1: Nome do Cliente
   C1: Destino
   D1: Data da Viagem
   E1: Data de Retorno
   F1: Observações Gerais
   G1: Companhia Aérea
   H1: Número do Voo (Ida)
   I1: Horário de Partida (Ida)
   J1: Horário de Chegada (Ida)
   K1: Número do Voo (Volta)
   L1: Horário de Partida (Volta)
   M1: Horário de Chegada (Volta)
   N1: Classe do Voo
   O1: Bagagem Despachada
   P1: Observações sobre o Serviço Aéreo
   Q1: Nome do Hotel
   R1: Endereço
   S1: Data de Check-in
   T1: Data de Check-out
   U1: Tipo de Quarto
   V1: Regime de Alimentação
   W1: Transfer do Aeroporto para o Hotel
   X1: Observações sobre a Hospedagem
   Y1: Necessita de Locação de Veículo
   Z1: Locadora
   AA1: Categoria do Veículo
   AB1: Data de Retirada
   AC1: Data de Devolução
   AD1: Local de Retirada
   AE1: Local de Devolução
   AF1: Observações sobre a Locação
   AG1: Necessita de Seguro Viagem
   AH1: Seguradora
   AI1: Tipo de Cobertura
   AJ1: Valor da Cobertura
   AK1: Número da Apólice
   AL1: Observações sobre o Seguro
   AM1: Passeio 1
   AN1: Data do Passeio 1
   AO1: Horário do Passeio 1
   AP1: Passeio 2
   AQ1: Data do Passeio 2
   AR1: Horário do Passeio 2
   AS1: Passeio 3
   AT1: Data do Passeio 3
   AU1: Horário do Passeio 3
   AV1: Transfer Adicional
   AW1: Observações sobre Serviços Gerais
   AX1: Resumo Geral dos Horários da Viagem
   AY1: Contato de Emergência
   AZ1: Observações Finais

================================================================================
PASSO 2: CRIAR O SCRIPT DO GOOGLE APPS SCRIPT
================================================================================

1. Na planilha, clique em "Extensões" > "Apps Script"
2. Apague todo o código existente
3. Cole o seguinte código:

---INÍCIO DO CÓDIGO---

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Criar array com os dados na ordem correta
    var row = [
      data.timestamp || '',
      data.cliente || '',
      data.destino || '',
      data['data-viagem'] || '',
      data['data-retorno'] || '',
      data['observacoes-gerais'] || '',
      data['cia-aerea'] || '',
      data['numero-voo-ida'] || '',
      data['horario-partida-ida'] || '',
      data['horario-chegada-ida'] || '',
      data['numero-voo-volta'] || '',
      data['horario-partida-volta'] || '',
      data['horario-chegada-volta'] || '',
      data['classe-voo'] || '',
      data['bagagem-despachada'] || '',
      data['observacoes-aereo'] || '',
      data['nome-hotel'] || '',
      data['endereco-hotel'] || '',
      data['data-checkin'] || '',
      data['data-checkout'] || '',
      data['tipo-quarto'] || '',
      data['regime-alimentacao'] || '',
      data['transfer-hotel'] || '',
      data['observacoes-hospedagem'] || '',
      data['necessita-locacao'] || '',
      data['locadora'] || '',
      data['categoria-veiculo'] || '',
      data['data-retirada'] || '',
      data['data-devolucao'] || '',
      data['local-retirada'] || '',
      data['local-devolucao'] || '',
      data['observacoes-locacao'] || '',
      data['necessita-seguro'] || '',
      data['seguradora'] || '',
      data['tipo-cobertura'] || '',
      data['valor-cobertura'] || '',
      data['numero-apolice'] || '',
      data['observacoes-seguro'] || '',
      data['passeio-1'] || '',
      data['data-passeio-1'] || '',
      data['horario-passeio-1'] || '',
      data['passeio-2'] || '',
      data['data-passeio-2'] || '',
      data['horario-passeio-2'] || '',
      data['passeio-3'] || '',
      data['data-passeio-3'] || '',
      data['horario-passeio-3'] || '',
      data['transfer-adicional'] || '',
      data['observacoes-servicos-gerais'] || '',
      data['resumo-horarios-texto'] || '',
      data['contato-emergencia'] || '',
      data['observacoes-finais'] || ''
    ];
    
    // Adicionar linha na planilha
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Dados salvos com sucesso'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

---FIM DO CÓDIGO---

4. Clique em "Salvar projeto" (ícone de disquete)
5. Nomeie o projeto como "CEO Travel Form Handler"

================================================================================
PASSO 3: IMPLANTAR COMO WEB APP
================================================================================

1. Clique em "Implantar" > "Nova implantação"
2. Clique no ícone de engrenagem ao lado de "Selecionar tipo"
3. Escolha "Aplicativo da Web"
4. Configure:
   - Descrição: "CEO Travel Form API"
   - Executar como: "Eu (seu email)"
   - Quem tem acesso: "Qualquer pessoa"
5. Clique em "Implantar"
6. COPIE O LINK DA WEB APP que aparece (algo como: https://script.google.com/macros/s/XXXXX/exec)
7. Clique em "Concluído"

================================================================================
PASSO 4: CONFIGURAR O FORMULÁRIO
================================================================================

1. Abra o arquivo "script.js" em um editor de texto
2. Na linha 27, substitua 'COLE_AQUI_O_LINK_DO_SEU_GOOGLE_SHEETS_WEB_APP' 
   pelo link que você copiou no Passo 3
3. Salve o arquivo

Exemplo:
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/XXXXX/exec';

================================================================================
PASSO 5: TESTAR O FORMULÁRIO
================================================================================

1. Abra o arquivo "index.html" no navegador
2. Preencha alguns campos do formulário
3. Clique em "Enviar Respostas"
4. Verifique se os dados aparecem na planilha do Google Sheets

================================================================================
OBSERVAÇÕES IMPORTANTES
================================================================================

- O formulário funciona 100% offline, exceto no momento do envio dos dados
- Os dados são enviados diretamente para o Google Sheets sem passar por servidores intermediários
- Você pode compartilhar a planilha com outras pessoas para visualizar as respostas
- Para visualizar as respostas em tempo real, mantenha a planilha aberta
- Se precisar alterar o link do Google Sheets, basta editar o arquivo script.js

================================================================================
SUPORTE
================================================================================

Em caso de dúvidas ou problemas:
1. Verifique se o link do Google Sheets está correto no arquivo script.js
2. Certifique-se de que a implantação do Apps Script está configurada como "Qualquer pessoa"
3. Teste o formulário com o console do navegador aberto (F12) para ver mensagens de erro

================================================================================
