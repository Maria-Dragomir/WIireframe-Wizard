// var imageBase64 = '';
// var imageMime = '';

// document.getElementById('file-input').addEventListener('change', function() {
//     var file = this.files[0];
//     if (!file) return;

//     imageMime = file.type;

//     var reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = function(e) {
//         imageBase64 = e.target.result.split(',')[1];
//         document.getElementById('btn').disabled = false;
//     }
// });

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
        
        // To show and hide the download button

        var btn = document.getElementById('btn');
        
        btn.disabled = false;
        btn.style.display = '';

        document.getElementById('upload-label').style.display = 'none';
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
                    `Look at the entire wireframe carefully before writing any code.
                    Count every card, every section, every nav item before you start.

                    You are a front-end developer converting a wireframe into an HTML scaffold.
                    A developer will use this as a starting point — structure and accuracy matter more than style.

                    RULES:
                    1. ONE self-contained file. All CSS inside a <style> tag in <head>. No external stylesheets.
                    2. Count every repeated element precisely. Output exactly what the wireframe shows — do not summarise or reduce.
                    3. Use correct semantic tags throughout: <header>, <nav>, <main>, <section>, <footer>, <article>, <ul>, <form>. Nav items must use <a href="#"> tags, not <span> or plain text.
                    4. Wrap all sections between the header and footer in a single <main> tag.
                    5. Add a comment above every section in this format:
                    <!-- SECTION NAME: what the developer needs to replace or implement -->
                    6. CSS rules:
                    - Layout only — CSS Grid and Flexbox to match wireframe structure
                    - Neutral colours: #f4f4f4 backgrounds, #e0e0e0 borders, #333 text, #fff cards
                    - system-ui font, no external fonts
                    - No shadows, gradients, border-radius above 4px, or animations
                    - Add one media query: stack all grid columns to a single column below 600px
                    7. Inside every card use proper child elements — <h3> for the title, <p> for body text, <ul> for lists, <button> for actions. No <br> tags.
                    8. Image and media placeholders: a <div class="placeholder"> with background:#e0e0e0, a fixed height matching the wireframe proportion, and centered text describing what goes there. No <img> tags. The placeholder class is for image and media slots only — card text content (headings, paragraphs, lists, buttons) sits outside and below any placeholder div, never inside it.
                    9. Only include a <script> tag if the wireframe clearly shows a countdown timer. If it does, output this exact skeleton before </body>:
                    const timerEl = document.getElementById('countdown');
                    // TODO: set your launch date here
                    const launchDate = new Date('2025-01-01T00:00:00');
                    setInterval(function() {
                        const diff = launchDate - new Date();
                        const d = Math.floor(diff / 86400000);
                        const h = Math.floor((diff % 86400000) / 3600000);
                        const m = Math.floor((diff % 3600000) / 60000);
                        const s = Math.floor((diff % 60000) / 1000);
                        timerEl.textContent = d + 'd ' + h + 'h ' + m + 'm ' + s + 's';
                    }, 1000);
                    10. Preserve the exact placeholder labels from the wireframe: [SOFTWARE NAME], [FEATURE 1 TITLE] etc. Do not invent real content.
                    11. If the wireframe shows a search bar, output a proper HTML form:
                        <form role="search">
                        <input type="search" placeholder="Search...">
                        <button type="submit">Search</button>
                        </form>
                    12. If the wireframe shows content cards with no visible text labels, output them as bare placeholder divs only — no invented headings or body text:
                        <article class="card">
                        <div class="placeholder">Image placeholder</div>
                        </article>
                    13. For any unreadable, ambiguous, or illegible text in the wireframe, use standard Lorem ipsum placeholder text rather than attempting to guess the content.

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

   window.generatedHtml = html;

    var btn = document.getElementById('btn');
    btn.onclick = function() {
        var blob = new Blob([window.generatedHtml], {type: 'text/html'});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'scaffold.html';
        link.click();
    };

    //Prview section
    var previewSection = document.getElementById('preview-section');
    var previewFrame = document.getElementById('preview-frame');
    previewFrame.srcdoc = html;
    previewSection.style.display = '';
    previewSection.scrollIntoView({behavior: 'smooth'});
});
