import { getCurrentYear } from '@/utils/current-dates'

export const Footer = () => {
  const currentYear = getCurrentYear()

  return (
    <footer className="bg-gray-200 text-white py-2 px-0 border-gray-800 w-full bottom-0">
      {/* Términos y condiciones */}
      <div className="my-1.5 text-center py-1.5 text-gray-800 w-full px-1 text-xs">
        <p className="leading-tight flex justify-center items-center flex-wrap gap-1">
          <span>
            &copy; {currentYear} Escuela de Postgrado UNAP. Todos los derechos
            reservados.
          </span>
          <span className="mx-1">-</span>
          <span className="text-xs text-slate-500">
            Oficina de Soporte Informático
          </span>
        </p>
      </div>
    </footer>
  )
}
