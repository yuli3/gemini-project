"use client"

import React, { useState, useRef, useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from '@/components/ui/skeleton'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface AnalysisResult {
  response: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [theme, setTheme] = useState('')
  const [subTheme, setSubTheme] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState('female')
  const [language, setLanguage] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreviewUrl(objectUrl)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file || !theme) return

    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('image', file)
    formData.append('theme', theme)
    if (subTheme) formData.append('subTheme', subTheme)
    if (birthYear) formData.append('birthYear', birthYear)
    formData.append('gender', gender)
    if (language) formData.append('language', language)

    try {
      const response = await fetch('/api/analyze-mood', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while processing your request')
    } finally {
      setLoading(false)
    }
  }

  const renderSubThemeSelect = () => {
    switch (theme) {
      case 'novel':
        return (
          <Select onValueChange={setSubTheme}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SF">Science Fiction</SelectItem>
              <SelectItem value="Fantasy">Fantasy</SelectItem>
              <SelectItem value="Contemporary">Contemporary</SelectItem>
              <SelectItem value="Mystery">Mystery</SelectItem>
            </SelectContent>
          </Select>
        )
      case 'poem':
        return (
          <Select onValueChange={setSubTheme}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ballad">Ballad</SelectItem>
              <SelectItem value="Epic">Epic</SelectItem>
              <SelectItem value="Sonnet">Sonnet</SelectItem>
              <SelectItem value="Haiku">Haiku</SelectItem>
            </SelectContent>
          </Select>
        )
      case 'lyrics':
        return (
          <Select onValueChange={setSubTheme}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choose genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pop">Pop</SelectItem>
              <SelectItem value="Hiphop">Hip Hop</SelectItem>
              <SelectItem value="Rock">Rock</SelectItem>
              <SelectItem value="RnB">R&B</SelectItem>
            </SelectContent>
          </Select>
        )
      case 'name':
        return (
          <div className="flex space-x-4">
            <Input
              type="number"
              placeholder="Birth Year"
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-[150px]"
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="gender-switch"
                checked={gender === 'male'}
                onCheckedChange={(checked) => setGender(checked ? 'male' : 'female')}
              />
              <Label htmlFor="gender-switch">{gender === 'male' ? 'Male' : 'Female'}</Label>
            </div>
            <Select onValueChange={setLanguage}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="Korean">Korean</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="container mx-auto p-12">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        Creative Energy Boost
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
        Get personalized encouragement, support, or creative content!
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-4 mb-4 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="image">Upload your photo (required)</Label>
          <Input type="file" id="image" onChange={handleFileChange} accept="image/*" required className="w-[300px]" ref={fileInputRef} />
          {previewUrl && (
            <div className="mt-2">
              <img src={previewUrl} alt="Preview" className="max-w-[300px] max-h-[300px] object-contain" />
            </div>
          )}
        </div>
        <div className="mb-4 flex items-center space-x-4">
          <Select onValueChange={setTheme}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Choose a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mood">How do I look?</SelectItem>
              <SelectItem value="needs">What do I need?</SelectItem>
              <SelectItem value="action">What should I do?</SelectItem>
              <SelectItem value="comfort">Comfort me</SelectItem>
              <SelectItem value="courage">Give me courage</SelectItem>
              <SelectItem value="quote">Inspirational quote</SelectItem>
              <SelectItem value="novel">Write a novel about me</SelectItem>
              <SelectItem value="poem">Write a poem about me</SelectItem>
              <SelectItem value="lyrics">Write lyrics about me</SelectItem>
              <SelectItem value="name">Give me a name</SelectItem>
            </SelectContent>
          </Select>
          {renderSubThemeSelect()}
        </div>
        <Button type="submit" disabled={!file || !theme || loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Tada! Boost My Energy
        </Button>
      </form>

      {loading && (
        <div className="mt-4 mx-auto space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[220px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[220px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      )}

      {result && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle><strong>Your Personalized Content</strong></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{result.response}</p>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use Creative Energy Boost</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Upload Your Photo</AccordionTrigger>
              <AccordionContent>
                Start by uploading a photo of yourself. This photo will be used as the basis for generating personalized content.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Choose a Theme</AccordionTrigger>
              <AccordionContent>
                Select from various themes such as mood analysis, needs assessment, action suggestions, comfort, courage, inspirational quotes, novel writing, poem generation, lyrics creation, or name suggestion.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Provide Additional Details</AccordionTrigger>
              <AccordionContent>
                Depending on the theme you choose, you may need to provide additional information such as genre, style, birth year, gender, or language preferences.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Generate Content</AccordionTrigger>
              <AccordionContent>
                Click the Tada! Boost My Energy button to generate your personalized content. The AI will analyze your photo and create content based on your chosen theme and preferences.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Features Overview</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-4">
                  <li>Mood Analysis: Get insights on how you look in your photo</li>
                  <li>Needs Assessment: Discover what you might need based on your image</li>
                  <li>Action Suggestions: Receive recommendations on what you should do</li>
                  <li>Comfort & Courage: Get comforting messages or courage boosts</li>
                  <li>Inspirational Quotes: Receive personalized inspirational quotes</li>
                  <li>Creative Writing: Get a novel excerpt, poem, or song lyrics about you</li>
                  <li>Name Suggestion: Receive a name based on your appearance and preferences</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-8 w-[full]">
        <CardHeader>
          <CardTitle>Gemini Project by AKSMILD 2024</CardTitle>
          <Link href="https://www.youtube.com/live/ltm6r3dZ4Ag?si=ngFX3s7G9CFB4q7m">inspiration from  <strong>조코딩</strong></Link>
        </CardHeader>
        <CardContent>
          Share with your friends
          <div className="a2a_kit a2a_kit_size_32 a2a_default_style">
            <a className="a2a_dd" href="https://www.addtoany.com/share"></a>
            <a className="a2a_button_facebook"></a>
            <a className="a2a_button_mastodon"></a>
            <a className="a2a_button_email"></a>
            <a className="a2a_button_linkedin"></a>
            <a className="a2a_button_telegram"></a>
            <a className="a2a_button_whatsapp"></a>
            <a className="a2a_button_sms"></a>
            <a className="a2a_button_hacker_news"></a>
            <a className="a2a_button_kakao"></a>
            <a className="a2a_button_line"></a>
            <a className="a2a_button_x"></a>
            <a className="a2a_button_snapchat"></a>
          </div>
        </CardContent>
      </Card>
      <Script src="https://static.addtoany.com/menu/page.js" strategy="lazyOnload" />
    </main>
  )
}