import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, DollarSign, Users, Star } from 'lucide-react'

export function EventsFilters() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="madrid" />
            <label htmlFor="madrid" className="text-sm">
              Madrid
            </label>
            <Badge variant="secondary" className="ml-auto">
              1.2k
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="barcelona" />
            <label htmlFor="barcelona" className="text-sm">
              Barcelona
            </label>
            <Badge variant="secondary" className="ml-auto">
              856
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="valencia" />
            <label htmlFor="valencia" className="text-sm">
              Valencia
            </label>
            <Badge variant="secondary" className="ml-auto">
              432
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="sevilla" />
            <label htmlFor="sevilla" className="text-sm">
              Sevilla
            </label>
            <Badge variant="secondary" className="ml-auto">
              298
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start p-0 h-auto text-primary"
          >
            Ver más ubicaciones
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Fecha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="hoy" />
            <label htmlFor="hoy" className="text-sm">
              Hoy
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="manana" />
            <label htmlFor="manana" className="text-sm">
              Mañana
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="fin-semana" />
            <label htmlFor="fin-semana" className="text-sm">
              Este fin de semana
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="proxima-semana" />
            <label htmlFor="proxima-semana" className="text-sm">
              Próxima semana
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="proximo-mes" />
            <label htmlFor="proximo-mes" className="text-sm">
              Próximo mes
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Precio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="gratis" />
            <label htmlFor="gratis" className="text-sm">
              Gratis
            </label>
            <Badge variant="secondary" className="ml-auto">
              234
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>€0</span>
              <span>€500+</span>
            </div>
            <Slider
              defaultValue={[0, 100]}
              max={500}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>€0</span>
              <span>€100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Capacidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="pequeno" />
            <label htmlFor="pequeno" className="text-sm">
              Pequeño (1-50)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="mediano" />
            <label htmlFor="mediano" className="text-sm">
              Mediano (51-200)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="grande" />
            <label htmlFor="grande" className="text-sm">
              Grande (201-1000)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="masivo" />
            <label htmlFor="masivo" className="text-sm">
              Masivo (1000+)
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4" />
            Valoración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="5-estrellas" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm ml-auto">5.0</span>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="4-estrellas" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
              <Star className="h-3 w-3 text-gray-300" />
            </div>
            <span className="text-sm ml-auto">4.0+</span>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="3-estrellas" />
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
              {[4, 5].map((star) => (
                <Star key={star} className="h-3 w-3 text-gray-300" />
              ))}
            </div>
            <span className="text-sm ml-auto">3.0+</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 bg-transparent">
          Limpiar filtros
        </Button>
        <Button className="flex-1">Aplicar filtros</Button>
      </div>
    </div>
  )
}
