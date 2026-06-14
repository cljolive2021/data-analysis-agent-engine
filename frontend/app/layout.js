import './styles/globals.css'

export const metadata = {
  title: 'Data Analysis Engine',
  description: 'Análise Inteligente de Dados para Copilot Studio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
