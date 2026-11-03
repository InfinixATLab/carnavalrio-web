import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { Quill } from '../../interfaces/Quill';

function cleanQuillHtml(htmlString: string) {
    if (!htmlString || typeof htmlString !== 'string') return '';
    const emptyParagraphRegex = /(<p>\s*<br\s*\/?>\s*<\/p>)+/gi;

    let cleanedHtml = htmlString.replace(emptyParagraphRegex, '');

    cleanedHtml = cleanedHtml.trim();

    return cleanedHtml;
}

const RichTextEditor: React.FC<Quill> = ({
  value,
  onChange,
  placeholder = "Escreva o conteúdo da sua notícia aqui...",
  className = ""
}) => {
  const handleChange = (html: string) => {
    const finalHtml = cleanQuillHtml(html);
    onChange(finalHtml);
  };

  // Módulos configuram a barra de ferramentas e outras opções
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }], // Títulos H1, H2, H3
      ['bold', 'italic', 'underline', 'strike'], // Negrito, itálico, sublinhado, tachado
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Listas ordenadas e não ordenadas
      [{ 'indent': '-1'}, { 'indent': '+1' }], // Recuo
      ['link', 'image'], // Inserir link e imagem
      [{ 'align': [] }], // Alinhamento de texto
      ['clean'] // Remover formatação
    ],
  };

  // Formatos permitidos (importante para segurança e para o Quill saber o que lidar)
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'align'
  ];

  return (
    <div className={`rich-text-editor-container ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="w-full [&_.ql-editor]:min-h-[150px]"
      />
  </div>
  );
};

export default RichTextEditor;
