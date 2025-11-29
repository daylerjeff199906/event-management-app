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
  Globe,
  ChevronRight,
  ArrowRight
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
  social_media?: SocialMedia
  acronym?: string
  map_iframe_url?: string | null
  address?: string
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
    { name: 'Historia', id: 'history' },
    { name: 'Misión', id: 'identity' },
    { name: 'Contacto', id: 'contact' }
  ]

  // Lógica de colores dinámica
  const textColorClass = isScrolled ? 'text-foreground' : 'text-white'

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
        isScrolled
          ? 'bg-background/85 backdrop-blur-xl shadow-md py-3 border-border/40' // Scrolled: Compacto y fondo sólido
          : 'bg-transparent border-transparent py-6' // Top: Alto y transparente
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => scrollToSection('hero')}
        >
          {data.logo_url && (
            <div
              className={cn(
                'transition-all duration-300 overflow-hidden rounded-full border-2',
                isScrolled
                  ? 'w-10 h-10 border-transparent'
                  : 'w-12 h-12 border-white/20 bg-white/10 backdrop-blur-sm'
              )}
            >
              <img
                src={data.logo_url}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span
            className={cn(
              'font-bold text-lg md:text-xl tracking-tight transition-colors duration-300',
              isScrolled ? 'text-foreground' : 'text-white'
            )}
          >
            {data.acronym || data.institution_name}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className={cn(
                'text-sm font-medium transition-all duration-300 relative group py-1',
                textColorClass
              )}
            >
              {link.name}
              <span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full"
                style={{ color: isScrolled ? data.primary_color : 'white' }}
              />
            </button>
          ))}

          <Button
            onClick={() => scrollToSection('contact')}
            className={cn(
              'rounded-full px-6 transition-all duration-300 shadow-lg',
              !isScrolled && 'bg-white text-black hover:bg-white/90 border-none'
            )}
            style={isScrolled ? { backgroundColor: data.primary_color } : {}}
          >
            Contáctanos
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn('md:hidden p-2 transition-colors', textColorClass)}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b shadow-xl transition-all duration-300 overflow-hidden md:hidden flex flex-col',
          isOpen ? 'max-h-[400px] py-4' : 'max-h-0 py-0'
        )}
      >
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => {
              scrollToSection(link.id)
              setIsOpen(false)
            }}
            className="text-left py-3 px-6 hover:bg-muted font-medium text-foreground"
          >
            {link.name}
          </button>
        ))}
      </div>
    </nav>
  )
}
const HeroSection = ({ data }: { data: InstitutionData }) => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden"
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
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-black/40" />
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
      <div className="container mx-auto px-4 max-w-5xl space-y-12">
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
      <div className="container mx-auto px-4 max-w-5xl">
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
    <footer className="bg-slate-950 text-slate-200 pt-20 pb-10 rounded-t-[3rem] mt-12 relative overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              {data.institution_name}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {data.institution_type} compremetida con el desarrollo y la
              innovación. Construyendo el futuro paso a paso.
            </p>
            {/* Social Icons */}
            {data.social_media && (
              <div className="flex gap-3">
                {Object.entries(data.social_media).map(([key, url]) => {
                  if (!url) return null
                  const Icon = key.includes('facebook')
                    ? Facebook
                    : key.includes('instagram')
                    ? Instagram
                    : key.includes('twitter')
                    ? Twitter
                    : Globe
                  return (
                    <a
                      key={key}
                      href={url as string}
                      target="_blank"
                      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-white font-bold mb-6">Explorar</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('history')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Historia
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('identity')}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" /> Misión y Visión
                </button>
              </li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Libro de reclamaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact mini */}
          <div>
            <h4 className="text-white font-bold mb-6">Mantente informado</h4>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 mb-3">
                Suscríbete a nuestras noticias
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-slate-500"
                />
                <button className="bg-white text-black rounded-lg px-3 py-2 font-bold hover:bg-slate-200 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {data.acronym || data.institution_name}
            . Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <span>{data.document_number}</span>
            <span>Desarrollado con ❤️</span>
          </div>
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
