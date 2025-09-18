'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import Link from 'next/link'

export const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Descubre eventos cerca de ti
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty max-w-2xl mx-auto">
            Explora planes, compra entradas con QR y publica tus eventos. En
            beta seguimos mejorando.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/eventos">Explorar eventos</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Regístrate gratis
            </Button>
          </div>

          <div className="mt-16 bg-card/50 backdrop-blur-sm rounded-2xl border p-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="¿Qué evento buscas?"
                  className="pl-10 h-12"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="¿Dónde?" className="pl-10 h-12" />
              </div>
              <Button size="lg" className="h-12 px-8">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Eventos únicos</h3>
              <p className="text-sm text-muted-foreground">
                Descubre experiencias auténticas cerca de ti
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Comunidad local</h3>
              <p className="text-sm text-muted-foreground">
                Conecta con personas que comparten tus intereses
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Fácil acceso</h3>
              <p className="text-sm text-muted-foreground">
                Entradas digitales con QR para acceso rápido
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
