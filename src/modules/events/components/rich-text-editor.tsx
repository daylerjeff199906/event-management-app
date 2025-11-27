'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Undo,
  Redo
} from 'lucide-react'
import { cn } from '@/lib/utils' // Asegúrate de tener esta utilidad de shadcn/ui o créala
import { useEffect } from 'react'

// --- 1. Subcomponente: Barra de Herramientas ---
const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  const ToggleButton = ({
    isActive,
    onClick,
    children,
    label
  }: {
    isActive?: boolean
    onClick: () => void
    children: React.ReactNode
    label: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-2 rounded-md hover:bg-slate-100 transition-colors text-slate-600',
        isActive && 'bg-slate-200 text-slate-900 font-medium'
      )}
      title={label}
    >
      {children}
    </button>
  )

  return (
    <div className="border-b border-input bg-transparent p-1 flex flex-wrap gap-1 items-center">
      <ToggleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        label="Negrita"
      >
        <Bold className="w-4 h-4" />
      </ToggleButton>

      <ToggleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        label="Cursiva"
      >
        <Italic className="w-4 h-4" />
      </ToggleButton>

      <ToggleButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        label="Tachado"
      >
        <Strikethrough className="w-4 h-4" />
      </ToggleButton>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <ToggleButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        label="Lista de viñetas"
      >
        <List className="w-4 h-4" />
      </ToggleButton>

      <ToggleButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        label="Lista ordenada"
      >
        <ListOrdered className="w-4 h-4" />
      </ToggleButton>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <ToggleButton
        onClick={() => editor.chain().focus().undo().run()}
        label="Deshacer"
      >
        <Undo className="w-4 h-4" />
      </ToggleButton>

      <ToggleButton
        onClick={() => editor.chain().focus().redo().run()}
        label="Rehacer"
      >
        <Redo className="w-4 h-4" />
      </ToggleButton>
    </div>
  )
}

// --- 2. Componente Principal ---

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Escribe aquí la descripción...',
  className
}: RichTextEditorProps) => {
  // Función auxiliar simple para convertir Markdown básico de Gemini a HTML
  // Nota: Para algo más robusto, usa la librería 'marked', pero esto sirve para negritas/listas simples.
  const parseInitialContent = (content: string) => {
    if (!content) return ''
    // Si ya parece HTML, devolverlo
    if (content.includes('<p>') || content.includes('<strong>')) return content

    // Conversión básica de Markdown a HTML para visualización inicial
    const html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negritas **texto**
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Cursiva *texto*
      .replace(/\n/g, '<br />') // Saltos de línea

    return html
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass:
          'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-2 before:left-2 before:text-slate-400 before-pointer-events-none'
      })
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] p-4 text-slate-700'
      }
    },
    content: parseInitialContent(value),
    onUpdate: ({ editor }) => {
      // Devolvemos HTML para guardar en la BD, o editor.getText() si prefieres texto plano
      onChange(editor.getHTML())
    },
    immediatelyRender: false
  })

  // Sincronizar contenido externo (ej: cuando la IA genera texto)
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      // Solo actualizamos si el contenido es drásticamente diferente para evitar loop de cursor
      // O si el editor está vacío y llega valor nuevo (caso típico de la IA)
      if (editor.isEmpty || !editor.isFocused) {
        editor.commands.setContent(parseInitialContent(value))
      }
    }
  }, [value, editor])

  return (
    <div
      className={cn(
        'border border-input rounded-md overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        className
      )}
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
