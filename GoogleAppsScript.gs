/**
 * CEO TRAVEL - FORMULÁRIO DE VIAGEM
 * Google Apps Script para receber dados do formulário
 * 
 * INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Abra sua planilha do Google Sheets
 * 2. Vá em Extensões > Apps Script
 * 3. Cole este código no editor
 * 4. Clique em "Implantar" > "Nova implantação"
 * 5. Escolha "Aplicativo da Web"
 * 6. Configure:
 *    - Executar como: Eu (seu email)
 *    - Quem tem acesso: Qualquer pessoa
 * 7. Clique em "Implantar"
 * 8. Copie a URL do Web App
 * 9. Cole a URL no arquivo script.js na constante GOOGLE_APPS_SCRIPT_URL
 */

// Nome da planilha onde os dados serão salvos
const SHEET_NAME = 'Formulários';

/**
 * Função principal que recebe requisições POST
 */
function doPost(e) {
  try {
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);
    
    // Salvar dados na planilha
    const result = saveToSheet(data);
    
    // Retornar resposta de sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Dados salvos com sucesso',
        row: result.row
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar resposta de erro
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Salva os dados na planilha
 */
function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Criar planilha se não existir
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    createHeaders(sheet);
  }
  
  // Preparar linha de dados
  const row = [
    data.timestamp || new Date().toLocaleString('pt-BR'),
    data.cliente || '',
    data.destino || '',
    data['data-viagem'] || '',
    data['data-retorno'] || '',
    data['observacoes-gerais'] || '',
    
    // Serviço Aéreo
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
    
    // Hospedagem
    data['nome-hotel'] || '',
    data['endereco-hotel'] || '',
    data['data-checkin'] || '',
    data['data-checkout'] || '',
    data['tipo-quarto'] || '',
    data['regime-alimentacao'] || '',
    data['transfer-hotel'] || '',
    data['observacoes-hospedagem'] || '',
    
    // Locação de Veículos
    data['necessita-locacao'] || '',
    data['locadora'] || '',
    data['categoria-veiculo'] || '',
    data['data-retirada-veiculo'] || '',
    data['data-devolucao-veiculo'] || '',
    data['local-retirada'] || '',
    data['local-devolucao'] || '',
    data['observacoes-locacao'] || '',
    
    // Seguro Viagem
    data['necessita-seguro'] || '',
    data['seguradora'] || '',
    data['tipo-cobertura'] || '',
    data['valor-cobertura'] || '',
    data['numero-apolice'] || '',
    data['observacoes-seguro'] || '',
    
    // Serviços Gerais
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
    
    // Assinatura e Termos
    data.termos_aceitos || '',
    data.data_aceite_termos || '',
    data.assinatura_digital || ''
  ];
  
  // Adicionar linha na planilha
  sheet.appendRow(row);
  
  // Formatar a linha adicionada
  const lastRow = sheet.getLastRow();
  formatRow(sheet, lastRow);
  
  // Se houver assinatura, adicionar como imagem
  if (data.assinatura_digital) {
    try {
      insertSignatureImage(sheet, lastRow, data.assinatura_digital);
    } catch (error) {
      console.error('Erro ao inserir imagem da assinatura:', error);
    }
  }
  
  return { row: lastRow };
}

/**
 * Cria os cabeçalhos da planilha
 */
function createHeaders(sheet) {
  const headers = [
    'Data/Hora',
    'Nome do Cliente',
    'Destino',
    'Data da Viagem',
    'Data de Retorno',
    'Observações Gerais',
    
    // Serviço Aéreo
    'Companhia Aérea',
    'Voo Ida - Número',
    'Voo Ida - Partida',
    'Voo Ida - Chegada',
    'Voo Volta - Número',
    'Voo Volta - Partida',
    'Voo Volta - Chegada',
    'Classe do Voo',
    'Bagagem Despachada',
    'Obs. Aéreo',
    
    // Hospedagem
    'Hotel',
    'Endereço Hotel',
    'Check-in',
    'Check-out',
    'Tipo de Quarto',
    'Regime Alimentação',
    'Transfer Hotel',
    'Obs. Hospedagem',
    
    // Locação
    'Necessita Locação',
    'Locadora',
    'Categoria Veículo',
    'Retirada',
    'Devolução',
    'Local Retirada',
    'Local Devolução',
    'Obs. Locação',
    
    // Seguro
    'Necessita Seguro',
    'Seguradora',
    'Tipo Cobertura',
    'Valor Cobertura',
    'Número Apólice',
    'Obs. Seguro',
    
    // Serviços Gerais
    'Passeio 1',
    'Data Passeio 1',
    'Horário Passeio 1',
    'Passeio 2',
    'Data Passeio 2',
    'Horário Passeio 2',
    'Passeio 3',
    'Data Passeio 3',
    'Horário Passeio 3',
    'Transfer Adicional',
    'Obs. Serviços Gerais',
    
    // Assinatura e Termos
    'Termos Aceitos',
    'Data Aceite Termos',
    'Assinatura Digital'
  ];
  
  sheet.appendRow(headers);
  
  // Formatar cabeçalho
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#c9a961');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Congelar primeira linha
  sheet.setFrozenRows(1);
  
  // Ajustar largura das colunas
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Formata a linha adicionada
 */
function formatRow(sheet, rowNumber) {
  const range = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn());
  
  // Alternar cores de fundo
  if (rowNumber % 2 === 0) {
    range.setBackground('#f9f9f9');
  }
  
  // Bordas
  range.setBorder(true, true, true, true, true, true);
  
  // Alinhamento vertical
  range.setVerticalAlignment('middle');
  
  // Wrap text para observações
  const obsColumns = [6, 16, 24, 32, 38, 49]; // Colunas de observações
  obsColumns.forEach(col => {
    if (col <= sheet.getLastColumn()) {
      sheet.getRange(rowNumber, col).setWrap(true);
    }
  });
}

/**
 * Insere a imagem da assinatura na planilha
 */
function insertSignatureImage(sheet, rowNumber, base64Image) {
  try {
    // Remover o prefixo data:image/png;base64, se existir
    const imageData = base64Image.replace(/^data:image\/png;base64,/, '');
    
    // Converter base64 para blob
    const blob = Utilities.newBlob(
      Utilities.base64Decode(imageData),
      'image/png',
      'assinatura.png'
    );
    
    // Inserir imagem na última coluna
    const lastCol = sheet.getLastColumn();
    const cell = sheet.getRange(rowNumber, lastCol);
    
    // Ajustar altura da linha para acomodar a imagem
    sheet.setRowHeight(rowNumber, 100);
    
    // Inserir imagem
    sheet.insertImage(blob, lastCol, rowNumber);
    
  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    // Em caso de erro, apenas salvar o base64 como texto
    const lastCol = sheet.getLastColumn();
    sheet.getRange(rowNumber, lastCol).setValue('[Assinatura Digital - Base64]');
  }
}

/**
 * Função de teste (opcional)
 */
function testScript() {
  const testData = {
    timestamp: new Date().toLocaleString('pt-BR'),
    cliente: 'Teste Cliente',
    destino: 'Teste Destino',
    'data-viagem': '2025-01-01',
    'data-retorno': '2025-01-10',
    termos_aceitos: 'Sim',
    data_aceite_termos: new Date().toLocaleString('pt-BR'),
    assinatura_digital: ''
  };
  
  const result = saveToSheet(testData);
  Logger.log('Teste concluído. Linha: ' + result.row);
}

