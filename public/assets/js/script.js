var response = await fetch('/apigenerate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, imageMime })
});

var iamgeBase64 ='';
var iamgeMime ='';

document.getElementById('file-input').addEventListener('change', function() {
    var file = this.files[0];
    if (!file) return;

    iamgeMime = file.type;

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        iamgeBase64 = e.target.result.split(',')[1];
        document.getElementById('btn').disabled = false;
    }
});

var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=' + API_KEY;

var body = {
    contents: [{
        role: 'user',
        parts: [
            {inline_data: {mime_type: iamgeMime, data: iamgeBase64}},
            {text: 'Convert this wireframe to html scaffold'}
        ]
    }]
}

var response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});

var data = await response.json();
var reply = data.candidates[0].content.parts[0].text;

var match = reply.match(/```html([\s\S]*?)```/i);
var html = match ? match[1].trim() : reply;

var blob = new Blob([html], {type: 'text/html'});
var url = URL.createObjectURL(blob);
var link = document.createElement('a');
link.href = url;
link.download = 'gemini.html';
link.click();