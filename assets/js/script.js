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
                { text: 
                    `Look at the entire wireframe carefully before writing any code. Count every card, every section, every nav item.
                    If you see 7 feature cards, output 7 cards. If you see 3 pricing tiers, output 3. Do not summarise or reduce.
                    You are a front-end developer. Convert this wireframe image into a complete, self-contained HTML file with embedded CSS.

                    RULES:
                    1. ONE file only. All CSS goes inside a <style> tag in the <head>. No external stylesheets.
                    2. Count every element in the wireframe carefully. If you see 7 feature cards, output 7 cards. If you see 3 pricing tiers, output 3. Do not summarise or reduce.
                    3. Every section visible in the wireframe must exist in the HTML with the correct tag: <header>, <nav>, <main>, <section>, <footer> etc.
                    4. Add an HTML comment above each section naming it and listing what a developer needs to fill in. Example: <!-- HERO: replace h1 with product name, swap placeholder div for video embed -->
                    5. Styling rules:
                    - Layout only: use CSS Grid or Flexbox to match the wireframe structure
                    - Neutral colours: #f4f4f4 backgrounds, #e0e0e0 borders, #333 text, #fff cards
                    - system-ui font only
                    - No shadows, gradients, or animations
                    6. Image placeholders: a <div> with background:#e0e0e0, a set height, and centered text saying what goes there. No <img> tags.
                    7. Interactive elements: if the wireframe shows a form, countdown, or tabs — include the HTML structure and minimal working JS for it.
                    8. Copy: use the exact placeholder labels from the wireframe (e.g. [SOFTWARE NAME], [FEATURE 1 TITLE]). Do not invent content.

                    Return the complete HTML file inside a \`\`\`html code block. Nothing else.`
                 }
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
