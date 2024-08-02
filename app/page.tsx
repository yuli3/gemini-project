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
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Creative Energy Boost
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
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
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        Powered By <Link href="https://aistudio.google.com/"><strong>Gemini</strong></Link>
        <br />
        Created with inspiration from <Link href="https://www.youtube.com/live/ltm6r3dZ4Ag?si=ngFX3s7G9CFB4q7m"><strong>조코딩</strong></Link>
      </blockquote>
      <Script src="https://static.addtoany.com/menu/page.js" strategy="lazyOnload" />
    </main>
  )
}