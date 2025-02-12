console.log("Based on Gemini AI");
const API_KEY = 'AIzaSyCPhaOkNh09vHwDzBb065l4RNx8OwofD0w'; //GEMINI API KEY
const chatMessages = document.getElementById('chat-messages');
const inputElement = document.getElementById('input');
document.body.classList.toggle('dark-theme');
console.log("Dark Mode Loaded (Default)")

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

async function sendMessage() {
    const userMessage = inputElement.value.trim();
    if (!userMessage) return;

    displayMessage(userMessage, 'user');
    inputElement.value = '';
    inputElement.style.height = 'auto';
    console.log(userMessage);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                })
            }
        );

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        displayMessage(aiResponse, 'ai');
        console.log(aiResponse);
    } catch (error) {
        displayMessage('Sorry, an error occurred.', 'ai');
        console.error('Error:', error);
    }
}

function displayMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${type}-message`);
    
    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = type === 'user' ? 'Me' : 'AI';

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('message-content');
    
    const content = document.createElement('p');
    content.textContent = message;

    const time = document.createElement('span');
    time.classList.add('message-time');
    time.textContent = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    contentWrapper.appendChild(content);
    contentWrapper.appendChild(time);

    messageElement.appendChild(avatar);
    messageElement.appendChild(contentWrapper);

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    console.log("Theme Changed");
}

inputElement.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});