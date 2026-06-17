export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { imageBase64, imageMime } = req.body;

    const  url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json ',
        },
        body: JSON.stringify({
            contents: [{
                role: 'user',
                parts: [
                    { inline_data: { mime_type: imageMime, data: imageBase64 }},
                    { text: 'Convert this wireframe to html scaffold'}
                ]
            }]
        })
    });
    

    const data = await response.json();
    res.status(200).json(data);
}