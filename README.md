# CEO Travel - Formulário de Viagem - Guia Completo

## 📋 Visão Geral

Formulário web completo para coleta de dados de viagens com:
- ✅ Validação de assinatura digital obrigatória
- ✅ Integração com Google Sheets
- ✅ Geração automática de PDF
- ✅ Modal de termos e condições
- ✅ Navegação entre seções
- ✅ Regras de cancelamento visíveis
- ✅ Layout responsivo (2 colunas)

---

## 🚀 Instalação Rápida

### 1. Arquivos Necessários

Extraia todos os arquivos do ZIP:
- `index.html` - Formulário principal
- `styles.css` - Estilos
- `script.js` - JavaScript
- `logo.png` - Logotipo CEO Travel
- `GoogleAppsScript.gs` - Código para Google Sheets

### 2. Configurar Google Sheets

#### Passo 1: Criar Planilha
1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Nomeie como "CEO Travel - Formulários"

#### Passo 2: Adicionar Apps Script
1. Na planilha, vá em **Extensões** > **Apps Script**
2. Delete o código padrão
3. Cole o conteúdo do arquivo `GoogleAppsScript.gs`
4. Clique em **Salvar** (ícone de disquete)

#### Passo 3: Implantar Web App
1. Clique em **Implantar** > **Nova implantação**
2. Clique no ícone de engrenagem ⚙️ ao lado de "Selecionar tipo"
3. Escolha **Aplicativo da Web**
4. Configure:
   - **Descrição:** "Formulário CEO Travel"
   - **Executar como:** Eu (seu email)
   - **Quem tem acesso:** Qualquer pessoa
5. Clique em **Implantar**
6. **Autorize** o script (pode aparecer aviso de segurança - clique em "Avançado" e "Ir para...")
7. **COPIE A URL DO WEB APP** que aparece (algo como: `https://script.google.com/macros/s/ABC123.../exec`)

#### Passo 4: Configurar URL no Formulário
1. Abra o arquivo `script.js` em um editor de texto
2. Na linha 5, substitua:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/SEU_SCRIPT_ID/exec';
   ```
   Por:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'SUA_URL_COPIADA_AQUI';
   ```
3. Salve o arquivo

### 3. Testar o Formulário

1. Abra o arquivo `index.html` em um navegador
2. Preencha os campos obrigatórios:
   - Nome do Cliente
   - Destino
   - Data da Viagem
   - Data de Retorno
3. Assine no canvas de assinatura
4. Clique em "Enviar Respostas"
5. Aceite os termos e condições
6. Verifique se:
   - PDF foi gerado e baixado
   - Dados apareceram na planilha do Google Sheets

---

## 📝 Estrutura do Formulário

### Seções Sempre Ativas (Obrigatórias)

#### 1. 📋 Dados Gerais
- Nome do Cliente *
- Destino *
- Data da Viagem *
- Data de Retorno *
- Observações Gerais

#### 2. ✍️ Assinatura Digital
- Canvas de assinatura (800x200px)
- Botão "Limpar Assinatura"
- **OBRIGATÓRIA** - Não permite envio sem assinatura

### Seções Opcionais (Com Botão "Adicionar Serviço")

#### 3. ✈️ Serviço Aéreo
- Companhia Aérea
- Número do Voo (Ida/Volta)
- Horários de Partida e Chegada
- Classe do Voo
- Bagagem Despachada
- Observações

**Regras:**
- ❌ Cancelamento: Não permitido
- ❌ Alteração: Não permitida
- ❌ Reembolso: Não permitido

#### 4. 🏨 Hospedagem
- Nome do Hotel
- Endereço
- Check-in / Check-out
- Tipo de Quarto
- Regime de Alimentação
- Transfer Aeroporto
- Observações

**Regras:**
- ✅ Cancelamento: Gratuito até 30 dias antes
- ⚠️ Multa: 50% até 15 dias antes
- ✅ Alteração: Permitida sujeita à disponibilidade
- ✅ Reembolso: Proporcional

#### 5. 🚗 Locação de Veículos
- Necessita de Locação
- Locadora
- Categoria do Veículo
- Datas de Retirada/Devolução
- Locais de Retirada/Devolução
- Observações

**Regras:**
- ✅ Cancelamento: Gratuito até 48h antes
- ⚠️ Multa: 1 diária após prazo
- ✅ Alteração: Permitida sem taxa com 24h
- ✅ Reembolso: Integral se cancelado no prazo

#### 6. 🛡️ Seguro Viagem
- Necessita de Seguro
- Seguradora
- Tipo de Cobertura
- Valor da Cobertura
- Número da Apólice
- Observações

**Regras:**
- ✅ Cancelamento: Até 7 dias após emissão
- ❌ Alteração: Não permitida após início
- ✅ Reembolso: Proporcional conforme uso

#### 7. 🎯 Serviços Gerais
- Passeio 1, 2 e 3 (com datas e horários)
- Transfer Adicional
- Observações

**Regras:**
- ✅ Cancelamento: Até 72h antes - reembolso 100%
- ✅ Alteração: Permitida com 48h
- ❌ Reembolso: Sem reembolso em cima da hora

---

## 🎨 Características do Design

### Layout
- **Grid:** 2 colunas (1 em mobile)
- **Full-width:** Apenas observações e assinatura
- **Cores:** Paleta dourada CEO Travel (#c9a961)
- **Botões:** Fundo escuro com hover dourado

### Navegação
- Menu fixo no topo
- 7 botões de navegação
- Scroll suave entre seções
- Indicador visual de seção ativa

### Responsividade
- Desktop: 2 colunas
- Tablet: 2 colunas
- Mobile: 1 coluna
- Canvas de assinatura ajustável

---

## 🔧 Funcionalidades Técnicas

### Validações
1. **Campos Obrigatórios:**
   - Nome do Cliente
   - Destino
   - Data da Viagem
   - Data de Retorno

2. **Assinatura Obrigatória:**
   - Não permite envio sem assinatura
   - Alerta visual se tentar enviar sem assinar
   - Rola automaticamente para seção de assinatura

3. **Termos e Condições:**
   - Modal obrigatório antes do envio
   - Checkbox de aceite
   - Data e hora do aceite registradas

### Canvas de Assinatura
- Suporte para mouse e touch (mobile)
- Calibração automática de coordenadas
- Captura em formato PNG (base64)
- Botão "Limpar Assinatura" funcional
- Sempre ativo (não precisa de botão)

### Integração Google Sheets
- Envio via POST para Web App
- Todos os campos salvos
- Assinatura salva como base64
- Timestamp automático
- Tratamento de erros

### Geração de PDF
- Biblioteca jsPDF
- Inclui todos os dados preenchidos
- Assinatura digital inserida como imagem
- Nome do arquivo: `Formulario_CEO_Travel_[Nome]_[Timestamp].pdf`
- Download automático após envio

---

## 📊 Estrutura da Planilha Google Sheets

### Colunas Criadas Automaticamente

| Coluna | Campo |
|--------|-------|
| A | Data/Hora |
| B | Nome do Cliente |
| C | Destino |
| D | Data da Viagem |
| E | Data de Retorno |
| F | Observações Gerais |
| G-P | Serviço Aéreo (10 campos) |
| Q-X | Hospedagem (8 campos) |
| Y-AF | Locação (8 campos) |
| AG-AL | Seguro (6 campos) |
| AM-AW | Serviços Gerais (11 campos) |
| AX | Termos Aceitos |
| AY | Data Aceite Termos |
| AZ | Assinatura Digital (base64) |

### Formatação Automática
- Cabeçalho: Fundo dourado (#c9a961)
- Linhas alternadas: Cinza claro
- Bordas em todas as células
- Wrap text em observações
- Primeira linha congelada

---

## 🐛 Solução de Problemas

### Problema: Dados não aparecem no Google Sheets

**Soluções:**
1. Verifique se a URL do Web App está correta no `script.js`
2. Certifique-se de que o script foi implantado como "Aplicativo da Web"
3. Verifique se "Quem tem acesso" está como "Qualquer pessoa"
4. Reautorize o script (Implantar > Gerenciar implantações > Editar > Nova versão)

### Problema: PDF não é gerado

**Soluções:**
1. Verifique se o arquivo `index.html` tem a linha:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   ```
2. Verifique o console do navegador (F12) para erros
3. Teste em outro navegador (Chrome recomendado)

### Problema: Assinatura não funciona

**Soluções:**
1. Verifique se o canvas tem o ID correto: `id="signature-canvas"`
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Teste em modo de navegação anônima
4. Em mobile, certifique-se de que está usando touch

### Problema: Navegação não funciona

**Soluções:**
1. Verifique se os IDs das seções correspondem aos links:
   - `#dados-gerais`
   - `#servico-aereo`
   - `#hospedagem`
   - `#locacao-veiculos`
   - `#seguro-viagem`
   - `#servicos-gerais`
   - `#assinatura`
2. Abra o console (F12) e procure por erros JavaScript

---

## 🔐 Segurança e Privacidade

### Dados Sensíveis
- Assinatura digital armazenada como base64
- Sem armazenamento local (localStorage/cookies)
- Dados enviados via HTTPS
- Planilha privada (apenas você tem acesso)

### Recomendações
1. Mantenha a planilha privada
2. Não compartilhe a URL do Web App publicamente
3. Revise periodicamente as permissões do Apps Script
4. Faça backup regular da planilha

---

## 📞 Suporte

### Contato CEO Travel
- **Email:** suporte@ceotravel.com.br
- **Telefone:** (11) 1234-5678
- **Website:** https://www.ceotravel.com.br

### Documentação Adicional
- [Google Apps Script](https://developers.google.com/apps-script)
- [jsPDF](https://github.com/parallax/jsPDF)
- [HTML5 Canvas](https://developer.mozilla.org/pt-BR/docs/Web/API/Canvas_API)

---

## 📄 Licença

© 2025 CEO Travel. Todos os direitos reservados.

---

## 🎯 Checklist de Implementação

- [ ] Extrair arquivos do ZIP
- [ ] Criar planilha no Google Sheets
- [ ] Adicionar código do Apps Script
- [ ] Implantar como Web App
- [ ] Copiar URL do Web App
- [ ] Configurar URL no script.js
- [ ] Testar formulário completo
- [ ] Verificar dados na planilha
- [ ] Verificar geração de PDF
- [ ] Testar em mobile
- [ ] Fazer backup da configuração

---

**Versão:** 2.0  
**Data:** 14 de outubro de 2025  
**Status:** ✅ Pronto para Produção

