const socket = io();

const messagesContainer = document.getElementById('messages');
const sendButton = document.getElementById('sendButton');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const imageInput = document.getElementById('image-input'); // escondido
const clipButton = document.getElementById('clipButton');

// 📎 abre seletor de arquivo
clipButton.addEventListener('click', () => {
  imageInput.click();
});

// Enviar mensagem
sendButton.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const text = messageInput.value.trim();
  const file = imageInput.files[0];

  if (!username) return;

  // Caso seja imagem
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.url) {
        socket.emit('send_message', {
          username,
          content: data.url,
          type: 'image',
          room: 'default'
        });
      }
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
    }

    imageInput.value = ''; // limpa input
  }

  // Caso seja texto
  if (text) {
    socket.emit('send_message', {
      username,
      content: text,
      type: 'text',
      room: 'default'
    });
    messageInput.value = '';
  }
});

// Receber histórico
socket.emit('join_room', 'default');
socket.on('messages_history', (msgs) => {
  msgs.forEach(renderMessage);
});

// Receber novas mensagens
socket.on('new_message', (msg) => {
  renderMessage(msg);
});

// Renderizar mensagem
function renderMessage(msg) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(
    msg.username === usernameInput.value ? 'sent' : 'received'
  );

  messageElement.innerHTML = `
    <span class="user">${msg.username}</span>
    ${
      msg.type === 'image'
        ? `<img src="${msg.content}" alt="imagem enviada">`
        : `<span class="text">${msg.content}</span>`
    }
    <span class="time">${new Date(msg.created_at || Date.now()).toLocaleTimeString()}</span>
  `;

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}