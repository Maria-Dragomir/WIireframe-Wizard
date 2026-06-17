var imageBase64 = '';
var imageMime = '';

document.getElementById('file-input').addEventListener('change', function() {
    var file = this.files[0];
    if (!file) return;

    imageMime = file.type;

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        imageBase64 = e.target.result.split(',')[1];
        document.getElementById('btn').disabled = false;
    }
});

document.getElementById('btn').addEventListener('click', async function() {
    var API_KEY = document.getElementById('api-key-input').value;
    var apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=' + API_KEY;

    var body = {
        contents: [{
            role: 'user',
            parts: [
                { inline_data: { mime_type: imageMime, data: imageBase64 } },
                { text: 'Convert this wireframe to html scaffold' }
            ]
        }]
    };

    var response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    var data = await response.json();
    var reply = data.candidates[0].content.parts[0].text;

    var match = reply.match(/```html([\s\S]*?)```/i);
    var html = match ? match[1].trim() : reply;

    var blob = new Blob([html], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'scaffold.html';
    link.click();
});
