// server.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

// 🔐 Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Variáveis SUPABASE_URL ou SUPABASE_KEY não estão definidas.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🚀 Express + HTTP + Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// 📦 Upload (memória) para envio ao Supabase Storage
const upload = multer({ storage: multer.memoryStorage() });

// 💾 Configurações esperadas no banco (Supabase):
// Tabela: messages
// Colunas: id (uuid ou serial), conversation_id (text), username (text), content (text, pode ser URL), type (text: 'text'|'image'),
// created_at (timestamp default now())

// 🧭 Rotas HTTP
app.get('/', (req, res) => {
  res.send('Central do Bate-Papo 1.0 - Backend ativo');
});

// 📸 Upload de imagem para Supabase Storage
// Bucket recomendado: chat-images (público) ou privado + signed URLs
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });

    const filePath = `chat/${Date.now()}-${file.originalname}`;

    const { error: upErr } = await supabase.storage
      .from('chat-images')
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (upErr) return res.status(500).json({ error: upErr.message });

    const { data: pub } = supabase.storage
      .from('chat-images')
      .getPublicUrl(filePath);

    return res.json({ url: pub.publicUrl });
  } catch (err) {
    console.error('❌ Erro upload:', err);
    return res.status(500).json({ error: 'Falha no upload.' });
  }
});

// 🔌 Socket.IO
io.on('connection', (socket) => {
  console.log('🟢 Conectado:', socket.id);

  // Entrar em uma sala específica
  socket.on('join_room', async (room = 'default') => {
    try {
      socket.join(room);

      // Buscar histórico da sala
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', room)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar histórico:', error);
        socket.emit('error_message', 'Erro ao carregar histórico.');
        return;
      }

      socket.emit('messages_history', data || []);
    } catch (err) {
      console.error('❌ Erro join_room:', err);
      socket.emit('error_message', 'Erro ao entrar na sala.');
    }
  });

  // Mensagem de texto
  socket.on('send_message', async (payload) => {
    try {
      const {
        username,
        content,
        room = 'default',
        type = 'text' // 'text' | 'image'
      } = payload;

      if (!username || !content) return;

      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: room,
            username,
            content,
            type
            // created_at: gerado pelo banco (DEFAULT now())
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar mensagem:', error);
        socket.emit('error_message', 'Erro ao salvar mensagem.');
        return;
      }

      // Emite só para a sala
      io.to(room).emit('new_message', data);
    } catch (err) {
      console.error('❌ Erro send_message:', err);
      socket.emit('error_message', 'Erro ao enviar mensagem.');
    }
  });

  // Indicador "digitando..."
  socket.on('typing', ({ room = 'default', username }) => {
    socket.to(room).emit('user_typing', { username });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Desconectado:', socket.id);
  });
});

// 🚀 Start
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor ouvindo na porta ${PORT}`);
});