const chatToggle = document.getElementById('chat-toggle');
const chatClose = document.getElementById('chat-close');
const chatPopup = document.getElementById('chat-popup');
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const suggestions = document.getElementById('suggestions');
const heroCta = document.getElementById('hero-cta');
const ctaBtn = document.getElementById('cta-btn');

let chatOpened = false;
const conversation = [];

/* ── Toggle chat popup ── */
function openChat() {
  chatPopup.classList.remove('hidden');
  chatToggle.textContent = '✕';
  userInput.focus();
  if (!chatOpened) {
    chatOpened = true;
    setTimeout(() => {
      appendBotMessage('Halo! 👋 Saya BizAI, asisten bisnis berbasis AI Anda.\n\nBisnis apa yang ingin Anda kembangkan? Saya siap membantu 🚀');
    }, 400);
  }
}

function closeChat() {
  chatPopup.classList.add('hidden');
  chatToggle.textContent = '💬';
}

chatToggle.addEventListener('click', () => {
  chatPopup.classList.contains('hidden') ? openChat() : closeChat();
});
chatClose.addEventListener('click', closeChat);
if (heroCta) heroCta.addEventListener('click', openChat);
if (ctaBtn) ctaBtn.addEventListener('click', openChat);

/* ── Suggestion chips ── */
suggestions.addEventListener('click', (e) => {
  if (e.target.classList.contains('suggestion-chip')) {
    const text = e.target.textContent.replace(/^[^\s]+\s/, '').trim();
    userInput.value = text;
    chatForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }
});

/* ── Form submit ── */
chatForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendUserMessage(userMessage);
  userInput.value = '';
  userInput.disabled = true;
  suggestions.style.display = 'none';

  conversation.push({ role: 'user', text: userMessage });

  const thinkingEl = appendThinking();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();
    const reply = data.reply || data.result || 'Maaf, tidak ada respons yang diterima.';

    thinkingEl.remove();
    appendBotMessage(reply);
    conversation.push({ role: 'model', text: reply });
  } catch (err) {
    thinkingEl.remove();
    appendBotMessage('Gagal mendapatkan respons dari server. Silakan coba lagi.');
    console.error(err);
  } finally {
    userInput.disabled = false;
    userInput.focus();
  }
});

/* ── DOM helpers ── */
function appendUserMessage(text) {
  const wrap = document.createElement('div');
  wrap.className = 'flex justify-end';
  const bubble = document.createElement('div');
  bubble.className = 'user-bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  chatBox.appendChild(wrap);
  scrollBottom();
}

function appendBotMessage(text) {
  const wrap = document.createElement('div');
  wrap.className = 'flex justify-start items-end gap-2';

  const avatar = document.createElement('div');
  avatar.className = 'bot-avatar';
  avatar.textContent = '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'bot-bubble';
  bubble.innerHTML = parseMarkdown(text);

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatBox.appendChild(wrap);
  scrollBottom();
  return wrap;
}

function appendThinking() {
  const wrap = document.createElement('div');
  wrap.className = 'flex justify-start items-end gap-2';

  const avatar = document.createElement('div');
  avatar.className = 'bot-avatar';
  avatar.textContent = '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'bot-bubble loading-dots';
  bubble.innerHTML = '<span></span><span></span><span></span>';

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatBox.appendChild(wrap);
  scrollBottom();
  return wrap;
}

function scrollBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* ── Markdown parser ── */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInline(text) {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function parseMarkdown(text) {
  const lines = text.split('\n');
  const html = [];
  let inList = false;

  for (const line of lines) {
    if (/^### /.test(line)) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h3>${renderInline(escapeHtml(line.slice(4)))}</h3>`);
    } else if (/^## /.test(line)) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h2>${renderInline(escapeHtml(line.slice(3)))}</h2>`);
    } else if (/^# /.test(line)) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h1>${renderInline(escapeHtml(line.slice(2)))}</h1>`);
    } else if (/^[-*] /.test(line)) {
      if (!inList) { html.push('<ul>'); inList = true; }
      html.push(`<li>${renderInline(escapeHtml(line.slice(2)))}</li>`);
    } else if (line.trim() === '') {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<br>');
    } else {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<p>${renderInline(escapeHtml(line))}</p>`);
    }
  }

  if (inList) html.push('</ul>');
  return html.join('');
}