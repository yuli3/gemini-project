import { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from "@google/generative-ai"
import formidable from 'formidable'
import fs from 'fs'
import os from 'os'
import path from 'path'
import sharp from 'sharp'

export const config = {
  api: {
    bodyParser: false,
  },
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string)

const prompts = {
  mood: "Analyze the user's mood from the provided image and offer insights and encouragement.",
  needs: "Reflect on what the user might need based on the image and offer supportive suggestions.",
  action: "Provide motivational advice and suggest positive actions the user could take based on the image.",
  comfort: "Offer words of comfort, understanding, and emotional support based on the image.",
  courage: "Inspire the user with motivational words and encourage them to face their challenges, referencing the image.",
  quote: "Share an inspirational quote relevant to the user's situation (based on the image) and explain its significance.",
  novel: "Write a short, engaging story snippet (about 150 words) in the specified genre, incorporating elements from the user's image.",
  poem: "Compose a brief poem (4-8 lines) in the specified style, reflecting the mood or elements from the user's image.",
  lyrics: "Write a catchy chorus or verse (4-8 lines) in the specified music genre, inspired by the user's image.",
  name: "Suggest a name for the person in the image, considering their birth year, gender, and preferred language. Explain the meaning and significance of the name."
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const form = formidable({})

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' })
    }

    const imageFile = files.image?.[0]
    const theme = fields.theme?.[0]
    const subTheme = fields.subTheme?.[0]
    const birthYear = fields.birthYear?.[0]
    const gender = fields.gender?.[0]
    const language = fields.language?.[0]

    if (!imageFile || !theme) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
      const imageBuffer = fs.readFileSync(imageFile.filepath)
      const processedImageBuffer = await sharp(imageBuffer)
        .resize(512, 512)
        .jpeg()
        .toBuffer()

      const tempFilePath = path.join(os.tmpdir(), `image_${Date.now()}.jpg`)
      fs.writeFileSync(tempFilePath, processedImageBuffer)

      const filePart = {
        inlineData: {
          data: Buffer.from(fs.readFileSync(tempFilePath)).toString("base64"),
          mimeType: "image/jpeg"
        },
      }

      const prompt = `You are an empathetic, wise, and creative AI assistant. Your task is based on the theme: ${theme}.

### Instructions ###
${prompts[theme as keyof typeof prompts]}

${subTheme ? `Sub-theme: ${subTheme}` : ''}
${birthYear ? `Birth Year: ${birthYear}` : ''}
${gender ? `Gender: ${gender}` : ''}
${language ? `Language: ${language}` : ''}

Please provide a thoughtful, personalized response based on the image and the given information. Be creative, supportive, and maintain a positive tone.

### Response Format ###
Provide your response in JSON format:
{
  "response": "Your detailed, personalized message or creative content here."
}`

      console.log(prompt);

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      })

      const result = await model.generateContent([prompt, filePart])
      const response = await result.response
      const text = response.text()

      console.log(text);

      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath)
      }

      res.status(200).json(JSON.parse(text));

    } catch (error) {
      console.error("Error processing request:", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  })
}