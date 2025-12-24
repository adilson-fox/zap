// Conexão ajustada para a porta que seu servidor informou (8080)
const socket = io('http://localhost:8080'); 

// Seleção de elementos (Baseado no seu código do GitHub)
const messageForm = document.getElementById('chat-form');
const messagesDisplay = document.getElementById('messages-display');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const clipButton = document.getElementById('clipButton');
const imageInput = document.getElementById('image-input');

// 1. Lógica do botão de Clipe (Abrir seletor)
if(clipButton && imageInput) {
    clipButton.addEventListener('click', () => imageInput.click());
}

// 2. Lógica para Processar e Enviar Imagem
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const messageData = {
                user: usernameInput.value.trim() || "Usuário",
                image: event.target.result, // Base64 da imagem
                text: null,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            socket.emit('message', messageData); // Envia para o servidor
            imageInput.value = ''; // Limpa o seletor
        };
        reader.readAsDataURL(file);
    }
});

// 3. Enviar mensagem de texto ao submeter
messageForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const user = usernameInput.value.trim();
    const text = messageInput.value.trim();

    if (user === "") {
        alert("Por favor, digite seu nome!");
        return;
    }

    if (text !== "") {
        const messageData = {
            user: user,
            text: text,
            image: null,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit('message', messageData); // Envia para o servidor
        messageInput.value = '';
        messageInput.focus();
    }
});

// 4. Função de exibição (Unindo Texto + Imagem + Zoom)
function displayMessage(data) {
    if (!messagesDisplay) return;

    const messageElement = document.createElement('div');
    const myName = usernameInput.value.trim();

    // Lógica de Lados (GitHub)
    messageElement.className = (myName !== "" && data.user === myName) ? 'message sent' : 'message received';
    
    // Define se o conteúdo é texto ou imagem clicável
    const conteudoHtml = data.image 
        ? `<img src="${data.image}" class="chat-img-payload" onclick="openModal('${data.image}')">`
        : `<span class="text">${data.text}</span>`;

    messageElement.innerHTML = `
        <span class="user">${data.user}</span>
        ${conteudoHtml}
        <span class="time">${data.time}</span>
    `;
    
    messagesDisplay.appendChild(messageElement);
    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
}

// 5. Funções do Modal de Zoom
function openModal(src) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    if (modal && modalImg) {
        modal.style.display = 'flex';
        modalImg.src = src;
    }
}

// Fechar modal ao clicar
const imageModal = document.getElementById('image-modal');
if (imageModal) {
    imageModal.addEventListener('click', function() { this.style.display = 'none'; });
}

// 6. Escutar Histórico e Novas Mensagens (Lógica do GitHub)
socket.on('previous_messages', (messages) => {
    messagesDisplay.innerHTML = ''; 
    messages.forEach(msg => displayMessage(msg));
});

socket.on('message', (data) => {
    displayMessage(data);
});