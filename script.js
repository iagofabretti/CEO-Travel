// Função para coletar dados do formulário
function collectFormData() {
    const form = document.getElementById('travel-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Adicionar campos de rádio que podem não estar no FormData
    const radioGroups = ['bagagem-despachada', 'transfer-hotel', 'necessita-locacao', 'necessita-seguro'];
    radioGroups.forEach(name => {
        const radio = document.querySelector(`input[name="${name}"]:checked`);
        data[name] = radio ? radio.value : '';
    });
    
    return data;
}

// ============================================
// CONFIGURAÇÃO DO GOOGLE SHEETS
// ============================================
// IMPORTANTE: Cole aqui o link do seu Google Sheets compartilhado
// O Google Sheets deve estar configurado como "Web App" para receber dados
// Instruções completas estão no arquivo README.txt
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/12cXMG7gnHB1VdpbTcTIOzWYCPV39KG7bkIp1b-3ph2A/edit?usp=sharing';
// ============================================

// Função para enviar dados para o Google Sheets
async function sendToGoogleSheets() {
    const data = collectFormData();
    
    // Verificar se há dados preenchidos
    const hasData = Object.values(data).some(value => value !== '');
    if (!hasData) {
        alert('Por favor, preencha pelo menos um campo antes de enviar.');
        return;
    }
    
    // Verificar se o link do Google Sheets foi configurado
    if (GOOGLE_SHEETS_URL === 'COLE_AQUI_O_LINK_DO_SEU_GOOGLE_SHEETS_WEB_APP') {
        alert('ATENÇÃO: O link do Google Sheets ainda não foi configurado!\n\nPor favor, edite o arquivo script.js e cole o link do seu Google Sheets Web App na variável GOOGLE_SHEETS_URL (linha 6).');
        return;
    }
    
    // Adicionar timestamp
    data.timestamp = new Date().toLocaleString('pt-BR');
    
    try {
        // Mostrar mensagem de carregamento
        showLoadingMessage();
        
        // Enviar dados para o Google Sheets
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Mostrar mensagem de sucesso
        hideLoadingMessage();
        showSuccessMessage();
        
        // Limpar formulário após envio bem-sucedido
        setTimeout(() => {
            if (confirm('Dados enviados com sucesso! Deseja limpar o formulário?')) {
                document.getElementById('travel-form').reset();
            }
        }, 2000);
        
    } catch (error) {
        hideLoadingMessage();
        console.error('Erro ao enviar dados:', error);
        alert('Erro ao enviar dados para o Google Sheets. Por favor, verifique a configuração e tente novamente.\n\nDetalhes do erro: ' + error.message);
    }
}

// Função para mostrar mensagem de carregamento
function showLoadingMessage() {
    const message = document.createElement('div');
    message.id = 'loading-message';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 30px 50px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-size: 1.2em;
        font-weight: 600;
        text-align: center;
        animation: fadeInScale 0.3s ease-out;
    `;
    message.innerHTML = '⏳ Enviando dados para o Google Sheets...';
    document.body.appendChild(message);
}

// Função para esconder mensagem de carregamento
function hideLoadingMessage() {
    const message = document.getElementById('loading-message');
    if (message) {
        message.style.animation = 'fadeOutScale 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #c9a961 0%, #d4b574 100%);
        color: white;
        padding: 30px 50px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-size: 1.2em;
        font-weight: 600;
        text-align: center;
        animation: fadeInScale 0.3s ease-out;
    `;
    message.innerHTML = '✓ Dados enviados com sucesso para o Google Sheets!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOutScale 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 2500);
}

// Função para limpar o formulário
function resetForm() {
    if (confirm('Tem certeza que deseja limpar todos os campos do formulário?')) {
        document.getElementById('travel-form').reset();
        showResetMessage();
    }
}

// Função para mostrar mensagem de reset
function showResetMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        color: #c9a961;
        padding: 30px 50px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        border: 3px solid #c9a961;
        z-index: 10000;
        font-size: 1.2em;
        font-weight: 600;
        text-align: center;
        animation: fadeInScale 0.3s ease-out;
    `;
    message.innerHTML = 'Formulário limpo com sucesso!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOutScale 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 2000);
}

// Adicionar animações CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes fadeOutScale {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll para os links de navegação
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Adicionar efeito de entrada nas seções ao rolar
    const sections = document.querySelectorAll('.form-section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
});
