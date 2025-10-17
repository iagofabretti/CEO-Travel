// ============================================
// CONFIGURAÇÃO DO GOOGLE SHEETS
// ============================================
// Substitua pela URL do seu Web App do Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxMKcwiUIoCZy7c2D26m29wEn2BkzIrYelFT0BhdARJxw5RPjwJ0Isr36l696cKRa6/exec';

// ============================================

// Variáveis globais
let canvas, ctx;
let isDrawing = false;
let signatureData = null;
let termsAccepted = false;

// Papel timbrado em base64 (será carregado)
let papelTimbradoBase64 = null;

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initializeSignatureCanvas();
    initializeToggleButtons();
    initializeSectionObserver();
    initializeNavigationLinks();
    initializeTermsCheckbox();
    loadPapelTimbrado();
});

// Carregar papel timbrado
async function loadPapelTimbrado() {
    try {
        // Carregar a imagem do papel timbrado
        const response = await fetch('papel_timbrado.png');
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = function() {
            papelTimbradoBase64 = reader.result;
            console.log('Papel timbrado carregado com sucesso');
        };
        
        reader.readAsDataURL(blob);
    } catch (error) {
        console.error('Erro ao carregar papel timbrado:', error);
    }
}

// ============================================
// FUNÇÕES DE NAVEGAÇÃO
// ============================================

function initializeNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove a classe 'active' de todos os links
            navLinks.forEach(l => l.classList.remove('active'));

            // Adiciona a classe 'active' ao link clicado
            this.classList.add('active');

            // Obtém o ID da seção alvo (ex: #dados-gerais)
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Altura do cabeçalho + margem extra para deixar o título mais alto
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 120;
                const extraOffset = 30; // 🔼 Ajuste fino — deixa o título um pouco mais pra cima
                const totalOffset = headerHeight + extraOffset;

                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - totalOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Observer para atualizar o link ativo durante o scroll
function initializeSectionObserver() {
    const sections = document.querySelectorAll('.form-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// ============================================
// FUNÇÕES DE TOGGLE DE SEÇÕES
// ============================================

function initializeToggleButtons() {
    const toggleButtons = document.querySelectorAll('.toggle-section-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            const sectionContent = document.querySelector(`[data-section-content="${sectionName}"]`);
            const toggleIcon = this.querySelector('.toggle-icon');
            
            if (sectionContent) {
                const isActive = sectionContent.classList.contains('active');
                
                if (isActive) {
                    // Desativar seção
                    sectionContent.classList.remove('active');
                    toggleIcon.textContent = '➕';
                    this.innerHTML = '<span class="toggle-icon">➕</span> Adicionar Serviço';
                    disableSectionInputs(sectionContent);
                } else {
                    // Ativar seção
                    sectionContent.classList.add('active');
                    toggleIcon.textContent = '➖';
                    this.innerHTML = '<span class="toggle-icon">➖</span> Remover Serviço';
                    enableSectionInputs(sectionContent);
                }
            }
        });
    });
}

function disableSectionInputs(section) {
    const inputs = section.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.disabled = true;
        input.value = '';
    });
}

function enableSectionInputs(section) {
    const inputs = section.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.disabled = false;
    });
}

// ============================================
// CANVAS DE ASSINATURA
// ============================================

function initializeSignatureCanvas() {
    canvas = document.getElementById('signature-canvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Configurar contexto
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Event listeners para mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Event listeners para touch (mobile)
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Canvas sempre ativo (sem classe disabled)
    canvas.classList.remove('disabled');
}

function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function startDrawing(e) {
    if (canvas.classList.contains('disabled')) return;
    
    isDrawing = true;
    const coords = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
}

function draw(e) {
    if (!isDrawing || canvas.classList.contains('disabled')) return;
    
    const coords = getCanvasCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        ctx.closePath();
        
        // Salvar assinatura como base64
        signatureData = canvas.toDataURL('image/png');
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function clearSignature() {
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    signatureData = null;
}

// ============================================
// FUNÇÕES DO MODAL DE TERMOS
// ============================================

function initializeTermsCheckbox() {
    const checkbox = document.getElementById('accept-terms');
    const confirmBtn = document.getElementById('confirm-terms-btn');
    
    if (checkbox && confirmBtn) {
        checkbox.addEventListener('change', function() {
            confirmBtn.disabled = !this.checked;
        });
    }
}

function showTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeTermsModal() {
    const modal = document.getElementById('terms-modal');
    const checkbox = document.getElementById('accept-terms');
    
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    if (checkbox) {
        checkbox.checked = false;
        document.getElementById('confirm-terms-btn').disabled = true;
    }
}

function acceptTermsAndSubmit() {
    termsAccepted = true;
    closeTermsModal();
    
    // Enviar dados
    submitFormData();
}

// ============================================
// FUNÇÕES DE COLETA E ENVIO DE DADOS
// ============================================

function collectFormData() {
    const form = document.getElementById('travel-form');
    const formData = new FormData(form);
    const data = {};
    
    // Coletar todos os campos do formulário
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Adicionar campos de rádio que podem não estar no FormData
    const radioGroups = ['bagagem-despachada', 'transfer-hotel', 'necessita-locacao', 'necessita-seguro'];
    radioGroups.forEach(name => {
        const radio = document.querySelector(`input[name="${name}"]:checked`);
        data[name] = radio ? radio.value : '';
    });
    
    // Adicionar assinatura digital
    data['assinatura_digital'] = signatureData || '';
    
    // Adicionar aceite dos termos
    data['termos_aceitos'] = termsAccepted ? 'Sim' : 'Não';
    data['data_aceite_termos'] = termsAccepted ? new Date().toLocaleString('pt-BR') : '';
    
    // Adicionar timestamp
    data['timestamp'] = new Date().toLocaleString('pt-BR');
    
    return data;
}

function sendToGoogleSheets() {
    // Validar campos obrigatórios
    const cliente = document.getElementById('cliente').value.trim();
    const destino = document.getElementById('destino').value.trim();
    const dataViagem = document.getElementById('data-viagem').value;
    const dataRetorno = document.getElementById('data-retorno').value;
    
    if (!cliente || !destino || !dataViagem || !dataRetorno) {
        alert('Por favor, preencha todos os campos obrigatórios em Dados Gerais:\n- Nome do Cliente\n- Destino\n- Data da Viagem\n- Data de Retorno');
        return;
    }
    
    // Validar assinatura obrigatória
    if (!signatureData) {
        alert('⚠️ A assinatura digital é obrigatória!\n\nPor favor, assine no campo de assinatura antes de enviar o formulário.');
        
        // Rolar para a seção de assinatura
        const assinaturaSection = document.getElementById('assinatura');
        if (assinaturaSection) {
            assinaturaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Mostrar modal de termos
    showTermsModal();
}

async function submitFormData() {
    const data = collectFormData();
    
    try {
        const pdfResult = await generatePDF(data);

        // 3. ADICIONA AS INFORMAÇÕES DO PDF AO OBJETO 'data'
        if (pdfResult && pdfResult.base64) {
            data['pdf_base64'] = pdfResult.base64;
            data['pdf_filename'] = pdfResult.fileName;
            data['nome_pdf'] = pdfResult.fileName; // ✅ adiciona também como coluna no Google Sheets
        }

        // Enviar dados para o Google Sheets
        // Nota: mode 'no-cors' é necessário para Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        });
        
        // Com mode 'no-cors', não conseguimos ler a resposta
        // Assumimos sucesso se não houver erro
        alert('✅ Formulário enviado com sucesso!\n\nO PDF foi gerado e os dados foram enviados para o Google Sheets.\n\nVerifique sua planilha para confirmar.');
        
        // Limpar formulário
        clearForm();
        
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        alert('❌ Erro ao enviar formulário.\n\nO PDF foi gerado, mas houve um problema ao salvar os dados no Google Sheets.\n\nPor favor, verifique:\n1. Se a URL do Google Apps Script está correta\n2. Se o Web App foi implantado corretamente\n3. Se "Quem tem acesso" está como "Qualquer pessoa"');
    }
}


// ============================================
// GERAÇÃO DE PDF COM PAPEL TIMBRADO
// ============================================

async function generatePDF(data) {
    // Verificar se jsPDF está disponível
    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF não está carregado');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 50; // Começar mais abaixo para não sobrepor o logo
    const lineHeight = 7;
    const margin = 20;
    
    // Função para adicionar papel timbrado como fundo
    function addPapelTimbrado() {
        if (papelTimbradoBase64) {
            try {
                doc.addImage(papelTimbradoBase64, 'PNG', 0, 0, pageWidth, pageHeight);
            } catch (error) {
                console.error('Erro ao adicionar papel timbrado:', error);
            }
        }
    }
    
    // Função auxiliar para adicionar nova página se necessário
    function checkPageBreak() {
        if (yPosition > pageHeight - 40) { // Deixar espaço para o rodapé
            doc.addPage();
            addPapelTimbrado();
            yPosition = 50;
        }
    }
    
    // Adicionar papel timbrado na primeira página
    addPapelTimbrado();
    
    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Formulário de Viagem', 105, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;
    
    // Data e hora
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Data de envio: ${data.timestamp}`, 105, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;
    
    // Dados Gerais
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(201, 169, 97); // Cor dourada CEO Travel
    doc.text('Dados Gerais', margin, yPosition);
    yPosition += lineHeight;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Nome do Cliente: ${data.cliente || 'N/A'}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Destino: ${data.destino || 'N/A'}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Data da Viagem: ${data['data-viagem'] || 'N/A'}`, margin, yPosition);
    yPosition += lineHeight;
    doc.text(`Data de Retorno: ${data['data-retorno'] || 'N/A'}`, margin, yPosition);
    yPosition += lineHeight;
    
    if (data['observacoes-gerais']) {
        doc.text(`Observações: ${data['observacoes-gerais']}`, margin, yPosition);
        yPosition += lineHeight;
    }
    
    yPosition += lineHeight;
    checkPageBreak();
    
    // Serviço Aéreo (se preenchido)
    if (data['cia-aerea']) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(201, 169, 97);
        doc.text('Serviço Aéreo', margin, yPosition);
        yPosition += lineHeight;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Companhia Aérea: ${data['cia-aerea']}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Voo Ida: ${data['numero-voo-ida'] || 'N/A'} - ${data['horario-partida-ida'] || 'N/A'} às ${data['horario-chegada-ida'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Voo Volta: ${data['numero-voo-volta'] || 'N/A'} - ${data['horario-partida-volta'] || 'N/A'} às ${data['horario-chegada-volta'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Classe: ${data['classe-voo'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Bagagem Despachada: ${data['bagagem-despachada'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight * 2;
        
        checkPageBreak();
    }
    
    // Hospedagem (se preenchido)
    if (data['nome-hotel']) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(201, 169, 97);
        doc.text('Hospedagem', margin, yPosition);
        yPosition += lineHeight;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Hotel: ${data['nome-hotel']}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Endereço: ${data['endereco-hotel'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Check-in: ${data['data-checkin'] || 'N/A'} | Check-out: ${data['data-checkout'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Tipo de Quarto: ${data['tipo-quarto'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Regime: ${data['regime-alimentacao'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight * 2;
        
        checkPageBreak();
    }
    
    // Locação de Veículos (se preenchido)
    if (data['necessita-locacao'] === 'Sim') {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(201, 169, 97);
        doc.text('Locação de Veículos', margin, yPosition);
        yPosition += lineHeight;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Locadora: ${data['locadora'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Categoria: ${data['categoria-veiculo'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Retirada: ${data['data-retirada-veiculo'] || 'N/A'} em ${data['local-retirada'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Devolução: ${data['data-devolucao-veiculo'] || 'N/A'} em ${data['local-devolucao'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight * 2;
        
        checkPageBreak();
    }
    
    // Seguro Viagem (se preenchido)
    if (data['necessita-seguro'] === 'Sim') {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(201, 169, 97);
        doc.text('Seguro Viagem', margin, yPosition);
        yPosition += lineHeight;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Seguradora: ${data['seguradora'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Tipo de Cobertura: ${data['tipo-cobertura'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight;
        doc.text(`Valor: ${data['valor-cobertura'] || 'N/A'}`, margin, yPosition);
        yPosition += lineHeight * 2;
        
        checkPageBreak();
    }
    
    // Passeios (se preenchidos)
    if (data['passeio-1']) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(201, 169, 97);
        doc.text('Passeios e Serviços', margin, yPosition);
        yPosition += lineHeight;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        if (data['passeio-1']) {
            doc.text(`1. ${data['passeio-1']} - ${data['data-passeio-1'] || ''} às ${data['horario-passeio-1'] || ''}`, margin, yPosition);
            yPosition += lineHeight;
        }
        
        if (data['passeio-2']) {
            doc.text(`2. ${data['passeio-2']} - ${data['data-passeio-2'] || ''} às ${data['horario-passeio-2'] || ''}`, margin, yPosition);
            yPosition += lineHeight;
        }
        
        if (data['passeio-3']) {
            doc.text(`3. ${data['passeio-3']} - ${data['data-passeio-3'] || ''} às ${data['horario-passeio-3'] || ''}`, margin, yPosition);
            yPosition += lineHeight;
        }
        
        yPosition += lineHeight;
        checkPageBreak();
    }
    
    // --------------------------------------------------------------------------------------
    // Termos e Condições (inserir antes da assinatura)
    // Vamos extrair o texto do modal de termos e adicionar ao PDF.
    // Caso o modal não exista ou esteja vazio, pulamos esta etapa.
    try {
        const termsModalBody = document.querySelector('#terms-modal .modal-body');
        if (termsModalBody) {
            let rawText = termsModalBody.innerText || termsModalBody.textContent || '';

            // 🔧 Limpa emojis e caracteres não suportados (mantém acentos e pontuação)
            rawText = rawText.replace(/[^\x00-\x7FÀ-ÿ\n\r.,;:!?()\-"'%€$@ ]/g, '');

            const lines = rawText
                .split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 0);

            if (lines.length > 0) {
                //  Título da seção de termos
                checkPageBreak();
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(201, 169, 97);
                doc.text('Termos e Condições', margin, yPosition);
                yPosition += lineHeight;

                // 🩶 Adiciona cada linha do texto de termos
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(60, 60, 60);

                lines.forEach(line => {
                    checkPageBreak();

                    // Quebrar linhas longas para caber na largura da página
                    const splitLines = doc.splitTextToSize(line, pageWidth - margin * 2);

                    splitLines.forEach(splitLine => {
                        doc.text(splitLine, margin, yPosition);
                        yPosition += lineHeight;
                        checkPageBreak();
                    });
                });

                yPosition += lineHeight;
            }
        }
    } catch (err) {
        console.error('Erro ao adicionar termos ao PDF:', err);
    }

    // --------------------------------------------------------------------------------------
    // Assinatura Digital
    if (signatureData) {
        checkPageBreak();
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(201, 169, 97);
        doc.text('Assinatura Digital', margin, yPosition);
        yPosition += lineHeight;
        
        // Adicionar imagem da assinatura
        try {
            doc.addImage(signatureData, 'PNG', margin, yPosition, 80, 20);
            yPosition += 25;
        } catch (error) {
            console.error('Erro ao adicionar assinatura ao PDF:', error);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(0, 0, 0);
            doc.text('(Assinatura digital anexada)', margin, yPosition);
            yPosition += lineHeight;
        }
    }
    
    // Termos aceitos
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Termos e Condições Aceitos: ${data.termos_aceitos} em ${data.data_aceite_termos}`, margin, yPosition);
    yPosition += lineHeight;

    // ------------------------------------------------------------------------
    // Montar nome do PDF no formato: Cliente_Destino_DataViagem
    const nomeCliente = (data.cliente || 'Cliente').replace(/\s+/g, '_');
    const destino = (data.destino || 'Destino').replace(/\s+/g, '_');
    const dataViagem = (data['data-viagem'] || 'Data').replace(/[^\w-]/g, '_');

    const fileName = `Formulario_CEO_Travel_${nomeCliente}_${destino}_${dataViagem}.pdf`;

    // Gerar string Base64 do PDF (Data URI)
    const dataUriString = doc.output('datauristring');
    const base64 = dataUriString.split(',')[1];

    // Salvar localmente (download para usuário)
    doc.save(fileName);

    // Retornar objeto com base64 e nome
    return { base64, fileName };
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Salva o payload como um arquivo .txt no computador do usuário (download pelo navegador).
 * O arquivo será baixado na pasta padrão de downloads do navegador.
 */
function savePayloadAsTxt(payload) {
    try {
        const jsonString = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
        const fileName = `payload_ceo_travel_${new Date().getTime()}.txt`;

        // Criar link temporário e clicar para forçar download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Erro ao salvar payload como txt:', err);
        throw err;
    }
}


function clearForm() {
    const form = document.getElementById('travel-form');
    if (form) {
        form.reset();
    }
    
    // Limpar assinatura
    clearSignature();
    
    // Resetar termos
    termsAccepted = false;
    
    // Desativar todas as seções opcionais
    const toggleButtons = document.querySelectorAll('.toggle-section-btn');
    toggleButtons.forEach(button => {
        const sectionName = button.getAttribute('data-section');
        const sectionContent = document.querySelector(`[data-section-content="${sectionName}"]`);
        
        if (sectionContent && sectionContent.classList.contains('active')) {
            button.click(); // Simular clique para desativar
        }
    });
    
    // Rolar para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

