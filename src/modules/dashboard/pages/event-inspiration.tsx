export function EventInspiration() {
  const eventPhotos = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      alt: 'Concierto de rock',
      category: 'Música'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      alt: 'Festival gastronómico',
      category: 'Gastronomía'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      alt: 'Conferencia tecnológica',
      category: 'Tecnología'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      alt: 'Exposición de arte',
      category: 'Arte'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80',
      alt: 'Evento deportivo',
      category: 'Deportes'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      alt: 'Festival cultural',
      category: 'Cultura'
    }
  ]

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pt-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lo que nos dejó
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Descubre miles de eventos increíbles organizados por los mejores
            especialistas en experiencias de Fesify
          </p>
        </div>
        <button className="mt-4 md:mt-0 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
          Explorar la comunidad
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Responsive grid layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {eventPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={`relative group cursor-pointer overflow-hidden rounded-xl ${
              index === 0 || index === 3 ? 'md:row-span-2' : ''
            }`}
          >
            <img
              src={photo.src || '/placeholder.svg'}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              style={{
                aspectRatio: index === 0 || index === 3 ? '1/2' : '1/1'
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                {photo.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
