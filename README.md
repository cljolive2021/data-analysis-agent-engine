# Data Analysis Engine - Copilot Studio

Motor de análise de dados gratuito na web com FastAPI + React

## 🎯 Funcionalidades

- ✅ Upload de arquivos (CSV, Excel, Parquet)
- ✅ Análise automática de correlações
- ✅ Insights inteligentes com recomendações
- ✅ Gráficos interativos em tempo real
- ✅ Interface web responsiva
- ✅ 100% gratuito e open-source

## 🚀 Deploy Gratuito

### Backend (Railway)

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Selecione este repositório
6. Railway detectará `main.py` automaticamente
7. Defina a variável `PORT=8000`
8. Deploy automático ✅

**URL de Produção:** `https://seu-projeto.railway.app`

### Frontend (Vercel)

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Importar repositório
5. Definir root directory: `frontend`
6. Adicionar variável de ambiente:
   ```
   REACT_APP_API_URL=https://seu-projeto.railway.app
   ```
7. Deploy automático ✅

**URL de Produção:** `https://seu-projeto.vercel.app`

## 🔧 Deploy Local

### Backend
```bash
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 Variáveis de Ambiente

**Backend (.env)**
```
PORT=8000
DEBUG=False
CORS_ORIGINS=*
```

**Frontend (.env.local)**
```
REACT_APP_API_URL=https://seu-api.railway.app
```

## 📁 Estrutura do Projeto

```
.
├── main.py                    # API FastAPI
├── requirements.txt           # Dependências Python
├── Procfile                   # Para Railway
├── runtime.txt                # Versão Python
├── test_api.py                # Testes
├── test_data.csv              # Dataset de exemplo
├── .env.production            # Variáveis produção
├── .gitignore
└── frontend/                  # Aplicação Next.js
    ├── package.json
    ├── next.config.js
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── public/
    ├── app/
    │   └── page.js
    ├── components/
    ├── services/
    └── .env.example
```

## 💰 Créditos Gratuitos

- **Railway:** $5/mês gratuitos + $500 de trial
- **Vercel:** Hosting ilimitado gratuito
- **GitHub:** Repositório gratuito ilimitado

## 🎓 Tutorial de Deploy Completo

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/cljolive2021/data-analysis-agent-engine.git
cd data-analysis-agent-engine
```

### Passo 2: Deploy do Backend (Railway)

1. Crie uma conta em [railway.app](https://railway.app) com GitHub
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Autorize o GitHub e selecione o repositório
5. Railway detectará `Procfile` e iniciará o deploy
6. Aguarde ~2 minutos
7. Copie a URL gerada (exemplo: `https://seu-projeto.railway.app`)

### Passo 3: Deploy do Frontend (Vercel)

1. Crie uma conta em [vercel.com](https://vercel.com) com GitHub
2. Clique em "Add New" → "Project"
3. Selecione o repositório
4. Em "Settings":
   - **Framework Preset:** Next.js
   - **Root Directory:** `./frontend`
5. Em "Environment Variables":
   - Nome: `REACT_APP_API_URL`
   - Valor: `https://seu-projeto.railway.app` (URL do Railway)
6. Clique em "Deploy"
7. Aguarde ~5 minutos
8. Acesse a URL gerada!

## 📊 Como Usar

1. **Upload:** Selecione um arquivo CSV, Excel ou Parquet
2. **Target:** Digite o nome da coluna que deseja analisar
3. **Contexto:** (Opcional) Descreva o contexto da análise
4. **Analisar:** Clique no botão para processar
5. **Resultados:** Visualize correlações, insights e recomendações

## 📈 Exemplo de Dataset

Use o arquivo `test_data.csv` incluído no repositório:
```csv
idade,salario,experiencia_anos,departamento,performance_score
25,45000,2,Vendas,72
32,65000,8,TI,85
28,52000,4,Financeiro,78
...
```

## 🔍 API Endpoints

### Health Check
```bash
GET /health
```

### Análise de Dados
```bash
POST /analyze
Content-Type: multipart/form-data

Parameters:
- file: arquivo (CSV, Excel, Parquet)
- target: string (nome da coluna alvo)
- context: string (opcional)

Response:
{
  "status": "success",
  "insights": {...},
  "correlations": {...},
  "recommendations": [...]
}
```

## 🐛 Troubleshooting

### Railway
- **Deploy falhou:** Verifique se o `Procfile` está correto
- **Erro 502:** Aguarde 2-3 minutos, Railway está inicializando
- **Porta 8000:** Certifique-se que a variável `PORT` está definida

### Vercel
- **Erro CORS:** Verifique se `REACT_APP_API_URL` está configurado
- **API não encontrada:** Copie a URL correta do Railway
- **Build falha:** Delete `node_modules` e tente novamente

## 📚 Tecnologias Utilizadas

**Backend:**
- FastAPI
- Polars (análise de dados)
- NumPy (cálculos matemáticos)
- Uvicorn (servidor)

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Recharts (gráficos)
- Lucide React (ícones)
- Axios (HTTP client)

**Deployment:**
- Railway (backend gratuito)
- Vercel (frontend gratuito)
- GitHub (versionamento)

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

MIT - Use livremente!

## 👨‍💻 Desenvolvedor

[@cljolive2021](https://github.com/cljolive2021)

## 🙋 Suporte

Tem dúvidas? Abra uma [Issue](https://github.com/cljolive2021/data-analysis-agent-engine/issues) ou entre em contato!

---

⭐ Se este projeto foi útil, considere deixar uma estrela!
