'use client'

import React, { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Target,
  Eye,
  Menu,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button' // Asumo que usas Shadcn UI o similar
import { cn } from '@/lib/utils' // Utilidad estándar de clases en Shadcn/Tailwind

// --- TIPADO (Simulado basado en tu esquema) ---
// En tu código real importarías esto desde tu archivo de tipos
export type SocialMedia = {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  website?: string
}

export type InstitutionData = {
  id?: string
  institution_name: string
  slug?: string
  institution_type: string
  document_number?: string
  logo_url?: string
  cover_image_url?: string
  brand?: string | null
  primary_color?: string
  description?: string
  about_us?: string
  mission?: string
  vision?: string
  institution_email?: string
  contact_phone?: string
  whatsapp_number?: string
  address?: string
  map_iframe_url?: string | null
  social_media?: SocialMedia
  acronym?: string
}

interface LandingProps {
  data: InstitutionData
}

// --- UTILIDADES ---
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// --- COMPONENTES SECUNDARIOS ---

const Navbar = ({
  data,
  isScrolled
}: {
  data: InstitutionData
  isScrolled: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Inicio', id: 'hero' },
    { name: 'Nosotros', id: 'about' },
    { name: 'Misión y Visión', id: 'identity' },
    { name: 'Contacto', id: 'contact' }
  ]

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm py-2'
          : 'bg-transparent border-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo o Nombre en Nav */}
        <div
          className="flex items-center gap-2 cursor-pointer font-bold text-xl text-primary"
          onClick={() => scrollToSection('hero')}
          style={{ color: data.primary_color }}
        >
          {isScrolled && data.logo_url && (
            <img
              src={data.logo_url}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{data.acronym || data.institution_name}</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className="text-sm font-medium hover:text-primary transition-colors"
              style={
                { '--hover-color': data.primary_color } as React.CSSProperties
              }
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b shadow-lg absolute w-full p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                scrollToSection(link.id)
                setIsOpen(false)
              }}
              className="text-left py-2 px-4 hover:bg-muted rounded-md"
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

const HeroSection = ({ data }: { data: InstitutionData }) => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {data.cover_image_url ? (
          <img
            src={data.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-20">
        {data.logo_url && (
          <div className="mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-2xl overflow-hidden mb-6 bg-white">
            <img
              src={data.logo_url}
              alt="Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-foreground dark:text-white">
          {data.institution_name}
        </h1>

        {data.brand && (
          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-8 max-w-2xl mx-auto">
            {data.brand}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => scrollToSection('contact')}
            style={{ backgroundColor: data.primary_color }}
            className="hover:opacity-90 transition-opacity"
          >
            Contáctanos
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection('about')}
          >
            Conócenos
          </Button>
        </div>
      </div>
    </section>
  )
}

const AboutSection = ({ data }: { data: InstitutionData }) => {
  if (!data.description && !data.about_us) return null

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span
            className="text-sm font-bold tracking-wider uppercase text-primary"
            style={{ color: data.primary_color }}
          >
            Sobre Nosotros
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">
            Nuestra Historia y Propósito
          </h2>

          {data.description && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          )}

          {data.about_us && (
            <div className="text-base text-muted-foreground/80 leading-7 text-justify md:text-center pt-4 border-t">
              {data.about_us}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const IdentitySection = ({ data }: { data: InstitutionData }) => {
  if (!data.mission && !data.vision) return null

  return (
    <section id="identity" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Misión */}
          {data.mission && (
            <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-white"
                style={{ backgroundColor: data.primary_color || '#000' }}
              >
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Misión</h3>
              <p className="text-muted-foreground leading-relaxed">
                {data.mission}
              </p>
            </div>
          )}

          {/* Visión */}
          {data.vision && (
            <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-white"
                style={{ backgroundColor: data.primary_color || '#000' }}
              >
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Visión</h3>
              <p className="text-muted-foreground leading-relaxed">
                {data.vision}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const ContactSection = ({ data }: { data: InstitutionData }) => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ponte en Contacto</h2>
          <p className="text-muted-foreground">
            Estamos aquí para resolver tus dudas
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info Column */}
          <div className="space-y-8">
            <div className="bg-muted/20 p-6 rounded-xl space-y-6">
              {data.address && (
                <div className="flex items-start gap-4">
                  <MapPin
                    className="w-6 h-6 text-primary mt-1"
                    style={{ color: data.primary_color }}
                  />
                  <div>
                    <h4 className="font-semibold">Dirección</h4>
                    <p className="text-muted-foreground">{data.address}</p>
                  </div>
                </div>
              )}

              {data.contact_phone && (
                <div className="flex items-start gap-4">
                  <Phone
                    className="w-6 h-6 text-primary mt-1"
                    style={{ color: data.primary_color }}
                  />
                  <div>
                    <h4 className="font-semibold">Teléfono</h4>
                    <p className="text-muted-foreground">
                      {data.contact_phone}
                    </p>
                    {data.whatsapp_number && (
                      <a
                        href={`https://wa.me/${data.whatsapp_number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-green-600 hover:underline mt-1 block"
                      >
                        Contactar por WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}

              {data.institution_email && (
                <div className="flex items-start gap-4">
                  <Mail
                    className="w-6 h-6 text-primary mt-1"
                    style={{ color: data.primary_color }}
                  />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <a
                      href={`mailto:${data.institution_email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {data.institution_email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media en Contacto */}
            {data.social_media && (
              <div className="flex gap-4 justify-center lg:justify-start">
                {/* Renderizado condicional de redes sociales */}
                {Object.entries(data.social_media).map(([key, url]) => {
                  if (!url) return null
                  return (
                    <a
                      key={key}
                      href={url as string}
                      target="_blank"
                      className="p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                    >
                      {key.includes('facebook') && (
                        <Facebook className="w-5 h-5" />
                      )}
                      {key.includes('instagram') && (
                        <Instagram className="w-5 h-5" />
                      )}
                      {key.includes('linkedin') && (
                        <Linkedin className="w-5 h-5" />
                      )}
                      {key.includes('twitter') && (
                        <Twitter className="w-5 h-5" />
                      )}
                      {key.includes('web') && <Globe className="w-5 h-5" />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Map Column */}
          <div className="w-full h-[400px] bg-muted rounded-xl overflow-hidden shadow-sm border relative">
            {data.map_iframe_url ? (
              <iframe
                src={data.map_iframe_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de la institución"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center p-6">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Mapa no disponible</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const Footer = ({ data }: { data: InstitutionData }) => {
  return (
    <footer className="bg-slate-900 text-slate-200 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-white mb-2">
            {data.institution_name}
          </h3>
          <p className="text-sm text-slate-400">
            {data.institution_type}{' '}
            {data.document_number && `• ${data.document_number}`}
          </p>
        </div>

        <div className="text-sm text-slate-500">
          © {new Date().getFullYear()} {data.acronym || 'Institución'}. Todos
          los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

// --- COMPONENTE PRINCIPAL ---

export default function InstitutionLandingPage({ data }: LandingProps) {
  // Hook simple para detectar scroll y cambiar estilo del navbar
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Navbar data={data} isScrolled={isScrolled} />

      <main>
        <HeroSection data={data} />
        <AboutSection data={data} />
        <IdentitySection data={data} />
        <ContactSection data={data} />
      </main>

      <Footer data={data} />
    </div>
  )
}
