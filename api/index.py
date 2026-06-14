import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import polars as pl
import numpy as np
from typing import Dict, Any, List
import io
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Data Analysis Engine",
    description="Motor de análise de dados com Polars para Copilot Studio",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def read_file(file_content: bytes, filename: str) -> pl.DataFrame:
    """Lê arquivo em diferentes formatos"""
    try:
        file_stream = io.BytesIO(file_content)
        
        if filename.endswith('.csv'):
            df = pl.read_csv(file_stream)
        elif filename.endswith('.parquet'):
            df = pl.read_parquet(file_stream)
        elif filename.endswith(('.xlsx', '.xls')):
            df = pl.read_excel(file_stream)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Formato não suportado: {filename}"
            )
        
        if df.is_empty():
            raise HTTPException(status_code=400, detail="Arquivo vazio")
        
        return df
    except Exception as e:
        logger.error(f"Erro ao ler arquivo: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Erro ao processar: {str(e)}")

def separate_columns(df: pl.DataFrame) -> Dict[str, List[str]]:
    """Separa colunas em categóricas e numéricas"""
    cat_cols = []
    float_cols = []
    
    for col in df.columns:
        if df[col].dtype in [pl.String, pl.Categorical, pl.Boolean]:
            cat_cols.append(col)
        elif df[col].dtype in [pl.Float32, pl.Float64, pl.Int32, pl.Int64, pl.Int8, pl.Int16]:
            float_cols.append(col)
    
    return {
        "categorical": cat_cols,
        "numeric": float_cols
    }

def calculate_correlations(
    df: pl.DataFrame,
    target: str,
    column_types: Dict[str, List[str]]
) -> Dict[str, Any]:
    """Calcula correlações"""
    correlations = {}
    
    if target not in df.columns:
        raise HTTPException(
            status_code=400,
            detail=f"Coluna '{target}' não encontrada"
        )
    
    if target in column_types["numeric"]:
        for col in column_types["numeric"]:
            if col != target:
                try:
                    valid_df = df.select([col, target]).drop_nulls()
                    if len(valid_df) > 1:
                        corr = valid_df[col].pearson_correlation(valid_df[target])
                        if not np.isnan(corr):
                            correlations[col] = round(float(corr), 4)
                except:
                    pass
        
        for col in column_types["categorical"]:
            try:
                valid_df = df.select([col, target]).drop_nulls()
                if len(valid_df) > 0:
                    group_means = valid_df.group_by(col).agg(
                        pl.col(target).mean().alias("mean")
                    )
                    variance = group_means[target].var()
                    if not np.isnan(variance):
                        correlations[f"{col}_var"] = round(float(variance), 4)
            except:
                pass
    
    return correlations

def generate_insights(
    df: pl.DataFrame,
    correlations: Dict[str, float],
    target: str,
    column_types: Dict[str, List[str]]
) -> Dict[str, Any]:
    """Gera insights"""
    insights = {
        "data_summary": {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "numeric_columns": len(column_types["numeric"]),
            "categorical_columns": len(column_types["categorical"])
        },
        "missing_values": {
            col: int(df[col].is_null().sum())
            for col in df.columns
        },
        "target_analysis": {
            "column": target,
            "type": "numeric" if target in column_types["numeric"] else "categorical"
        }
    }
    
    if target in column_types["numeric"]:
        target_col = df[target]
        insights["target_analysis"].update({
            "mean": round(float(target_col.mean()), 4),
            "median": round(float(target_col.median()), 4),
            "std": round(float(target_col.std()), 4),
            "min": round(float(target_col.min()), 4),
            "max": round(float(target_col.max()), 4)
        })
    else:
        insights["target_analysis"]["unique_values"] = int(df[target].n_unique())
    
    if correlations:
        sorted_corr = sorted(correlations.items(), key=lambda x: abs(x[1]), reverse=True)
        insights["top_correlations"] = [
            {"feature": feat, "correlation": corr}
            for feat, corr in sorted_corr[:10]
        ]
    
    return insights

def generate_recommendations(correlations: Dict, insights: Dict) -> List[str]:
    """Gera recomendações"""
    recommendations = []
    
    if not correlations:
        recommendations.append("Nenhuma correlação significativa encontrada.")
    else:
        strong = [(f, c) for f, c in correlations.items() if abs(c) > 0.7 and isinstance(c, (int, float))]
        if strong:
            recommendations.append(f"Forte correlação detectada com {len(strong)} feature(s).")
    
    data_summary = insights.get("data_summary", {})
    if data_summary.get("total_rows", 0) < 100:
        recommendations.append("Dataset pequeno. Considere coletar mais dados.")
    
    return recommendations

@app.post("/api/analyze")
async def analyze(
    file: UploadFile = File(...),
    target: str = Form(...),
    context: str = Form(default="")
) -> JSONResponse:
    """Endpoint de análise"""
    try:
        if not target.strip():
            raise HTTPException(status_code=400, detail="Target é obrigatório")
        
        file_content = await file.read()
        df = read_file(file_content, file.filename)
        
        column_types = separate_columns(df)
        correlations = calculate_correlations(df, target, column_types)
        insights = generate_insights(df, correlations, target, column_types)
        
        response = {
            "status": "success",
            "file": file.filename,
            "target": target,
            "context": context if context else None,
            "insights": insights,
            "correlations": correlations,
            "column_types": column_types,
            "recommendations": generate_recommendations(correlations, insights)
        }
        
        return JSONResponse(content=response, status_code=200)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Data Analysis Engine"}

@app.get("/")
async def root():
    return {
        "service": "Data Analysis Engine v1.0",
        "description": "Motor de análise de dados com Polars",
        "endpoints": {
            "POST /api/analyze": "Analisar dados",
            "GET /api/health": "Health check"
        }
    }
