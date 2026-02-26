const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('composer');
const inputEl = document.getElementById('messageInput');

function addMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble--me';

  const meta = document.createElement('div');
  meta.className = 'bubble__meta';
  meta.textContent = 'You';

  const body = document.createElement('div');
  body.className = 'bubble__text';
  body.textContent = trimmed;

  bubble.append(meta, body);
  messagesEl.appendChild(bubble);

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  addMessage(inputEl.value);
  inputEl.value = '';
  inputEl.focus();
});