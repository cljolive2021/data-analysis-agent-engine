# Data Analysis Engine - Copilot Studio

Motor de análise de dados gratuito na web com FastAPI + React (Vercel)

## 🎯 Funcionalidades

- ✅ Upload de arquivos (CSV, Excel, Parquet)
- ✅ Análise automática de correlações
- ✅ Insights inteligentes com recomendações
- ✅ Gráficos interativos em tempo real
- ✅ Interface web responsiva
- ✅ 100% gratuito com Vercel

## 🚀 Deploy Vercel (100% Gratuito)

### Backend com FastAPI no Vercel

```bash
vercel
```

Ou via GitHub:
1. Fork este repositório
2. Conecte ao Vercel
3. Defina:
   - **Framework:** Other
   - **Root Directory:** `api`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn api.index:app --host 0.0.0.0`

### Frontend com Next.js no Vercel

1. Crie novo projeto Vercel
2. Selecione o repositório
3. Defina:
   - **Framework:** Next.js
   - **Root Directory:** `frontend`
4. Adicione Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://seu-api.vercel.app
   ```
5. Deploy automático ✅

## 📊 Estrutura

```
.
├── api/                    # Backend FastAPI
│   ├── index.py           # Aplicação principal
│   └── requirements.txt
├── frontend/              # Frontend Next.js
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── .env.example
├── vercel.json            # Configuração Vercel
└── README.md
```

## 💻 Local Development

```bash
# Backend
cd api
pip install -r requirements.txt
uvicorn index:app --reload

# Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

## 🎁 100% Gratuito

- Vercel: Hosting ilimitado gratuito
- GitHub: Repositório gratuito
- Sem limites de requisições
- Sem cartão de crédito necessário

---

⭐ Se útil, deixe uma estrela!
