import { Button } from '@/components/ui/button'

export const HeroPage = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl text-foreground">
        ¿Qué evento quieres descubrir hoy?
      </h1>
      <Button variant="outline" className="px-6 bg-transparent">
        Cómo buscar eventos
      </Button>
    </div>
  )
}
