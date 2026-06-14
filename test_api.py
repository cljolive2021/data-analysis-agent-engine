"""
Script de teste para o motor de análise de dados
Testa os endpoints da API FastAPI
"""

import requests
import json
import time
from pathlib import Path

# Configuração da API
BASE_URL = "http://localhost:8000"
TEST_DATA_FILE = "test_data.csv"

# Cores para output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'


def print_header(text: str):
    """Imprime header de seção"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")


def print_success(text: str):
    """Imprime mensagem de sucesso"""
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")


def print_error(text: str):
    """Imprime mensagem de erro"""
    print(f"{Colors.RED}✗ {text}{Colors.END}")


def print_info(text: str):
    """Imprime mensagem de informação"""
    print(f"{Colors.YELLOW}ℹ {text}{Colors.END}")


def test_health_check():
    """Testa o endpoint de health check"""
    print_header("Teste 1: Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        
        if response.status_code == 200:
            print_success("Health check retornou 200 OK")
            print(json.dumps(response.json(), indent=2))
            return True
        else:
            print_error(f"Falha no health check: {response.status_code}")
            return False
    
    except requests.exceptions.ConnectionError:
        print_error("Erro de conexão. Certifique-se de que o servidor está rodando em http://localhost:8000")
        return False
    except Exception as e:
        print_error(f"Erro: {str(e)}")
        return False


def test_root_endpoint():
    """Testa o endpoint raiz com instruções"""
    print_header("Teste 2: Root Endpoint (Instruções)")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        
        if response.status_code == 200:
            print_success("Root endpoint retornou 200 OK")
            data = response.json()
            print(f"\n{Colors.BOLD}Informações da API:{Colors.END}")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            return True
        else:
            print_error(f"Falha: {response.status_code}")
            return False
    
    except Exception as e:
        print_error(f"Erro: {str(e)}")
        return False


def test_analyze_salary():
    """Testa o endpoint /analyze com arquivo CSV - Target: salario"""
    print_header("Teste 3: Análise de Correlações com Target 'salario'")
    
    try:
        # Verificar se arquivo de teste existe
        if not Path(TEST_DATA_FILE).exists():
            print_error(f"Arquivo {TEST_DATA_FILE} não encontrado")
            return False
        
        print_info("Enviando arquivo para análise...")
        
        with open(TEST_DATA_FILE, 'rb') as f:
            files = {'file': (TEST_DATA_FILE, f, 'text/csv')}
            data = {
                'target': 'salario',
                'context': 'Análise de fatores que influenciam o salário dos funcionários'
            }
            
            response = requests.post(
                f"{BASE_URL}/analyze",
                files=files,
                data=data
            )
        
        if response.status_code == 200:
            print_success("Análise concluída com sucesso!")
            result = response.json()
            
            # Exibir resultados estruturados
            print(f"\n{Colors.BOLD}Status:{Colors.END} {result['status']}")
            print(f"{Colors.BOLD}Arquivo:{Colors.END} {result['file']}")
            print(f"{Colors.BOLD}Target:{Colors.END} {result['target']}")
            print(f"{Colors.BOLD}Contexto:{Colors.END} {result['context']}")
            
            # Insights
            print(f"\n{Colors.BOLD}📊 Data Summary:{Colors.END}")
            print(json.dumps(result['insights']['data_summary'], indent=2))
            
            print(f"\n{Colors.BOLD}📈 Target Analysis:{Colors.END}")
            print(json.dumps(result['insights']['target_analysis'], indent=2))
            
            # Top Correlações
            if 'top_correlations' in result['insights']:
                print(f"\n{Colors.BOLD}🔗 Top Correlações:{Colors.END}")
                for i, corr in enumerate(result['insights']['top_correlations'], 1):
                    print(f"  {i}. {corr['feature']}: {corr['correlation']}")
            
            # Column Types
            print(f"\n{Colors.BOLD}📋 Tipos de Colunas:{Colors.END}")
            print(f"  Categóricas: {result['column_types']['categorical']}")
            print(f"  Numéricas: {result['column_types']['numeric']}")
            
            # Recomendações
            if result['recommendations']:
                print(f"\n{Colors.BOLD}💡 Recomendações:{Colors.END}")
                for rec in result['recommendations']:
                    print(f"  • {rec}")
            
            return True
        
        else:
            print_error(f"Falha na análise: {response.status_code}")
            print(f"Resposta: {response.text}")
            return False
    
    except Exception as e:
        print_error(f"Erro: {str(e)}")
        return False


def test_analyze_performance():
    """Testa o endpoint /analyze com arquivo CSV - Target: performance_score"""
    print_header("Teste 4: Análise de Correlações com Target 'performance_score'")
    
    try:
        if not Path(TEST_DATA_FILE).exists():
            print_error(f"Arquivo {TEST_DATA_FILE} não encontrado")
            return False
        
        print_info("Enviando arquivo para análise...")
        
        with open(TEST_DATA_FILE, 'rb') as f:
            files = {'file': (TEST_DATA_FILE, f, 'text/csv')}
            data = {
                'target': 'performance_score',
                'context': 'Análise de fatores que influenciam o desempenho dos funcionários'
            }
            
            response = requests.post(
                f"{BASE_URL}/analyze",
                files=files,
                data=data
            )
        
        if response.status_code == 200:
            print_success("Análise concluída com sucesso!")
            result = response.json()
            
            print(f"\n{Colors.BOLD}📊 Data Summary:{Colors.END}")
            print(json.dumps(result['insights']['data_summary'], indent=2))
            
            print(f"\n{Colors.BOLD}📈 Target Analysis:{Colors.END}")
            print(json.dumps(result['insights']['target_analysis'], indent=2))
            
            if 'top_correlations' in result['insights']:
                print(f"\n{Colors.BOLD}🔗 Top Correlações:{Colors.END}")
                for i, corr in enumerate(result['insights']['top_correlations'], 1):
                    print(f"  {i}. {corr['feature']}: {corr['correlation']}")
            
            if result['recommendations']:
                print(f"\n{Colors.BOLD}💡 Recomendações:{Colors.END}")
                for rec in result['recommendations']:
                    print(f"  • {rec}")
            
            return True
        
        else:
            print_error(f"Falha na análise: {response.status_code}")
            return False
    
    except Exception as e:
        print_error(f"Erro: {str(e)}")
        return False


def test_error_handling():
    """Testa tratamento de erros"""
    print_header("Teste 5: Tratamento de Erros")
    
    try:
        # Teste 1: Target inválido
        print_info("Teste 5.1: Target inválido...")
        
        with open(TEST_DATA_FILE, 'rb') as f:
            files = {'file': (TEST_DATA_FILE, f, 'text/csv')}
            data = {
                'target': 'coluna_inexistente',
                'context': ''
            }
            
            response = requests.post(
                f"{BASE_URL}/analyze",
                files=files,
                data=data
            )
        
        if response.status_code == 400:
            print_success("Erro 400 capturado corretamente")
            print(f"  Mensagem: {response.json()['detail']}")
        else:
            print_error(f"Esperava erro 400, recebeu {response.status_code}")
        
        # Teste 2: Sem arquivo
        print_info("\nTeste 5.2: Sem arquivo...")
        response = requests.post(
            f"{BASE_URL}/analyze",
            data={'target': 'salario', 'context': ''}
        )
        
        if response.status_code == 422:
            print_success("Erro 422 capturado (falta de arquivo)")
        else:
            print_info(f"Status: {response.status_code}")
        
        # Teste 3: Sem target
        print_info("\nTeste 5.3: Sem target...")
        with open(TEST_DATA_FILE, 'rb') as f:
            files = {'file': (TEST_DATA_FILE, f, 'text/csv')}
            response = requests.post(
                f"{BASE_URL}/analyze",
                files=files
            )
        
        if response.status_code == 422:
            print_success("Erro 422 capturado (falta de target)")
        else:
            print_info(f"Status: {response.status_code}")
        
        return True
    
    except Exception as e:
        print_error(f"Erro: {str(e)}")
        return False


def run_all_tests():
    """Executa todos os testes"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}╔════════════════════════════════════════════════════════════╗{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}║  TESTES DO MOTOR DE ANÁLISE DE DADOS - COPILOT STUDIO     ║{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}╚════════════════════════════════════════════════════════════╝{Colors.END}")
    
    print(f"\n{Colors.YELLOW}Aguardando 2 segundos antes de iniciar os testes...{Colors.END}")
    time.sleep(2)
    
    results = {}
    
    # Teste 1: Health Check
    results['Health Check'] = test_health_check()
    if not results['Health Check']:
        print_error("Servidor não está respondendo. Inicie-o com: python main.py")
        return
    
    time.sleep(1)
    
    # Teste 2: Root
    results['Root Endpoint'] = test_root_endpoint()
    time.sleep(1)
    
    # Teste 3: Análise Salário
    results['Análise Salário'] = test_analyze_salary()
    time.sleep(1)
    
    # Teste 4: Análise Performance
    results['Análise Performance'] = test_analyze_performance()
    time.sleep(1)
    
    # Teste 5: Erro Handling
    results['Tratamento Erros'] = test_error_handling()
    
    # Resumo
    print_header("📋 Resumo dos Testes")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = f"{Colors.GREEN}✓ PASSOU{Colors.END}" if result else f"{Colors.RED}✗ FALHOU{Colors.END}"
        print(f"{status} - {test_name}")
    
    print(f"\n{Colors.BOLD}Total: {passed}/{total} testes passaram{Colors.END}\n")
    
    if passed == total:
        print(f"{Colors.GREEN}{Colors.BOLD}🎉 Todos os testes passaram!{Colors.END}\n")
    else:
        print(f"{Colors.RED}{Colors.BOLD}⚠️  Alguns testes falharam{Colors.END}\n")


if __name__ == "__main__":
    run_all_tests()
