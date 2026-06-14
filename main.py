"""
Motor de Análise de Dados para Agente de IA no Copilot Studio
FastAPI com Polars para análise automática de correlações e insights
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import polars as pl
import numpy as np
from typing import Dict, Any, List, Optional
import io
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Data Analysis Engine",
    description="Motor de análise de dados com Polars e correlações",
    version="1.0.0"
)


def read_file(file_content: bytes, filename: str) -> pl.DataFrame:
    """
    Lê arquivo em diferentes formatos (CSV, Parquet, Excel)
    
    Args:
        file_content: Conteúdo do arquivo em bytes
        filename: Nome do arquivo para determinar o tipo
        
    Returns:
        DataFrame do Polars
        
    Raises:
        HTTPException: Se o formato não for suportado ou houver erro na leitura
    """
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
                detail=f"Formato de arquivo não suportado: {filename}. Use CSV, Parquet ou Excel."
            )
        
        if df.is_empty():
            raise HTTPException(status_code=400, detail="Arquivo vazio ou inválido")
        
        return df
    
    except Exception as e:
        logger.error(f"Erro ao ler arquivo: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Erro ao processar arquivo: {str(e)}"
        )


def separate_columns(df: pl.DataFrame) -> Dict[str, List[str]]:
    """
    Separa colunas automaticamente em 'cat' (categóricas) e 'float' (numéricas)
    
    Args:
        df: DataFrame do Polars
        
    Returns:
        Dicionário com listas de colunas categóricas e numéricas
    """
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
    """
    Calcula correlações entre features e o target
    Suporta correlação de Pearson para variáveis numéricas
    e análise de frequência para categóricas
    
    Args:
        df: DataFrame do Polars
        target: Nome da coluna alvo
        column_types: Dicionário com tipos de colunas
        
    Returns:
        Dicionário com correlações e insights
    """
    correlations = {}
    
    # Validar se target existe
    if target not in df.columns:
        raise HTTPException(
            status_code=400,
            detail=f"Coluna alvo '{target}' não encontrada no arquivo"
        )
    
    # Se target é numérica
    if target in column_types["numeric"]:
        # Correlação com outras numéricas
        for col in column_types["numeric"]:
            if col != target:
                try:
                    # Remover valores nulos para cálculo de correlação
                    valid_df = df.select([col, target]).drop_nulls()
                    
                    if len(valid_df) > 1:
                        corr = valid_df[col].pearson_correlation(valid_df[target])
                        if not np.isnan(corr):
                            correlations[col] = round(float(corr), 4)
                except Exception as e:
                    logger.warning(f"Erro ao calcular correlação para {col}: {e}")
        
        # Análise de variância para categóricas (ANOVA)
        for col in column_types["categorical"]:
            try:
                valid_df = df.select([col, target]).drop_nulls()
                
                if len(valid_df) > 0:
                    # Agrupar por categoria e calcular média do target
                    group_means = valid_df.group_by(col).agg(
                        pl.col(target).mean().alias("mean"),
                        pl.col(target).count().alias("count")
                    ).sort("mean", descending=True)
                    
                    overall_mean = valid_df[target].mean()
                    variance = group_means[target].var()
                    
                    if not np.isnan(variance):
                        correlations[f"{col}_variance_ratio"] = round(float(variance), 4)
            except Exception as e:
                logger.warning(f"Erro ao analisar variância para {col}: {e}")
    
    else:
        # Se target é categórica, calcular proporção de categorias
        logger.info(f"Target '{target}' é categórica. Analisando distribuição.")
        for col in column_types["numeric"]:
            try:
                valid_df = df.select([col, target]).drop_nulls()
                if len(valid_df) > 1:
                    corr = valid_df[col].pearson_correlation(valid_df[target].cast(pl.Int32))
                    if not np.isnan(corr):
                        correlations[col] = round(float(corr), 4)
            except Exception as e:
                logger.warning(f"Erro ao calcular correlação para {col}: {e}")
    
    return correlations


def generate_insights(
    df: pl.DataFrame,
    correlations: Dict[str, float],
    target: str,
    column_types: Dict[str, List[str]]
) -> Dict[str, Any]:
    """
    Gera insights detalhados sobre os dados
    
    Args:
        df: DataFrame do Polars
        correlations: Dicionário de correlações
        target: Nome da coluna alvo
        column_types: Dicionário com tipos de colunas
        
    Returns:
        Dicionário com insights organizados
    """
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
        insights["target_analysis"]["top_categories"] = (
            df[target].value_counts()
            .head(5)
            .to_dicts()
        )
    
    # Top correlações
    if correlations:
        sorted_corr = sorted(correlations.items(), key=lambda x: abs(x[1]), reverse=True)
        insights["top_correlations"] = [
            {"feature": feat, "correlation": corr}
            for feat, corr in sorted_corr[:10]
        ]
    
    return insights


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    target: str = Form(...),
    context: str = Form(default="")
) -> JSONResponse:
    """
    Endpoint de análise de dados
    
    Args:
        file: Arquivo multipart (CSV, Parquet, Excel)
        target: Nome da coluna alvo para análise
        context: Contexto adicional para interpretação dos resultados
        
    Returns:
        JSON com análise completa de correlações e insights
    """
    try:
        # Validar inputs
        if not target.strip():
            raise HTTPException(status_code=400, detail="Campo 'target' é obrigatório")
        
        # Ler arquivo
        logger.info(f"Processando arquivo: {file.filename}")
        file_content = await file.read()
        df = read_file(file_content, file.filename)
        
        # Separar colunas
        column_types = separate_columns(df)
        logger.info(f"Colunas categóricas: {column_types['categorical']}")
        logger.info(f"Colunas numéricas: {column_types['numeric']}")
        
        # Calcular correlações
        correlations = calculate_correlations(df, target, column_types)
        
        # Gerar insights
        insights = generate_insights(df, correlations, target, column_types)
        
        # Resposta estruturada
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
        
        logger.info("Análise concluída com sucesso")
        return JSONResponse(content=response, status_code=200)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro inesperado: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar análise: {str(e)}"
        )


def generate_recommendations(correlations: Dict[str, float], insights: Dict[str, Any]) -> List[str]:
    """
    Gera recomendações baseadas nas correlações e insights
    
    Args:
        correlations: Dicionário de correlações
        insights: Dicionário de insights
        
    Returns:
        Lista de recomendações
    """
    recommendations = []
    
    if not correlations:
        recommendations.append(
            "Nenhuma correlação significativa encontrada. Considere explorar relações não-lineares."
        )
    else:
        strong_corr = [
            (feat, corr) for feat, corr in correlations.items()
            if abs(corr) > 0.7 and not isinstance(corr, str)
        ]
        
        if strong_corr:
            recommendations.append(
                f"Forte correlação detectada com {len(strong_corr)} feature(s). "
                f"Considere usar essas variáveis como preditores principais."
            )
        
        weak_corr = [
            (feat, corr) for feat, corr in correlations.items()
            if 0.1 < abs(corr) < 0.3 and not isinstance(corr, str)
        ]
        
        if weak_corr:
            recommendations.append(
                "Correlações fracas encontradas. Verifique se há relações não-lineares."
            )
    
    data_summary = insights.get("data_summary", {})
    missing = insights.get("missing_values", {})
    
    if data_summary.get("total_rows", 0) < 100:
        recommendations.append("Dataset pequeno. Considere coletar mais dados para análises robustas.")
    
    if missing and any(v > 0 for v in missing.values()):
        recommendations.append("Valores ausentes detectados. Revise a estratégia de imputação.")
    
    return recommendations


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "Data Analysis Engine"}


@app.get("/")
async def root():
    """Root endpoint com instruções"""
    return {
        "service": "Data Analysis Engine v1.0",
        "description": "Motor de análise de dados com Polars para Copilot Studio",
        "endpoints": {
            "POST /analyze": "Enviar arquivo e analisar correlações",
            "GET /health": "Verificar status do serviço"
        },
        "supported_formats": ["CSV", "Parquet", "Excel (.xlsx, .xls)"],
        "usage": {
            "file": "Arquivo de dados (multipart)",
            "target": "Nome da coluna alvo (obrigatório)",
            "context": "Contexto adicional (opcional)"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
