import Papa from 'papaparse';
import ss from 'simple-statistics';

export const analyzeDataCSV = async (file, target, context = '') => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const data = results.data;
          
          if (!data || data.length === 0) {
            throw new Error('Arquivo vazio');
          }

          // Validar se target existe
          if (!data[0].hasOwnProperty(target)) {
            throw new Error(`Coluna '${target}' não encontrada no arquivo`);
          }

          // Separar colunas
          const columns = Object.keys(data[0]);
          const numericCols = [];
          const categoricalCols = [];

          columns.forEach(col => {
            const firstVal = data[0][col];
            if (typeof firstVal === 'number') {
              numericCols.push(col);
            } else {
              categoricalCols.push(col);
            }
          });

          // Extrair dados numéricos do target
          const targetData = data.map(row => row[target]).filter(v => v !== null && v !== undefined && v !== '');

          if (targetData.length === 0) {
            throw new Error('Nenhum valor válido no target');
          }

          // Calcular estatísticas do target
          const stats = {
            mean: ss.mean(targetData),
            median: ss.median(targetData),
            std: ss.standardDeviation(targetData),
            min: Math.min(...targetData),
            max: Math.max(...targetData)
          };

          // Calcular correlações
          const correlations = [];
          numericCols.forEach(col => {
            if (col !== target) {
              const colData = data.map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '');
              
              if (colData.length > 1 && colData.length === targetData.length) {
                try {
                  const corr = ss.sampleCorrelation(targetData, colData);
                  if (!isNaN(corr)) {
                    correlations.push({
                      feature: col,
                      correlation: corr
                    });
                  }
                } catch (e) {
                  // Ignorar erro de correlação
                }
              }
            }
          });

          // Ordenar correlações
          correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));

          // Gerar recomendações
          const recommendations = [];
          const strongCorr = correlations.filter(c => Math.abs(c.correlation) > 0.7);
          
          if (strongCorr.length > 0) {
            recommendations.push(`✅ Forte correlação detectada com ${strongCorr.length} feature(s)`);
          } else if (correlations.length > 0) {
            recommendations.push('ℹ️ Correlações fracas encontradas. Explore relações não-lineares');
          } else {
            recommendations.push('⚠️ Nenhuma correlação significativa encontrada');
          }

          if (data.length < 100) {
            recommendations.push('📌 Dataset pequeno. Considere coletar mais dados para análises robustas');
          }

          resolve({
            status: 'success',
            file: file.name,
            target: target,
            context: context || null,
            rows: data.length,
            columns: columns.length,
            numericCols: numericCols.length,
            categoricalCols: categoricalCols.length,
            stats: stats,
            correlations: correlations.slice(0, 10),
            recommendations: recommendations
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Erro ao processar arquivo: ${error.message}`));
      }
    });
  });
};
