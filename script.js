// script.js

let historico = [];

window.onload = function() {
    carregarHistorico();
};

async function carregarHistorico() {
    try {
        const jsonHistorico = localStorage.getItem('historico_buscas');
        if (jsonHistorico !== null) {
            historico = JSON.parse(jsonHistorico);
            atualizarHistoricoNaTela();
        }
    } catch (error) {
        console.log("Erro ao carregar histórico", error);
    }
}

// Função para buscar localidade pelo CEP
async function buscarCep() {
    const cep = document.getElementById('cepInput').value;

    if (cep === "") {
        alert("Preencha o CEP");
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();

        if (dados.erro) {
            alert("CEP não encontrado");
            return;
        }

        // Exibir resultado da busca
        document.getElementById('resultado').innerHTML = `
            <p><strong>CEP:</strong> ${dados.cep}</p>
            <p><strong>UF:</strong> ${dados.uf}</p>
            <p><strong>Localidade:</strong> ${dados.localidade}</p>
            <p><strong>Bairro:</strong> ${dados.bairro}</p>
            <p><strong>Logradouro:</strong> ${dados.logradouro}</p>
        `;

        // Salvar no histórico
        salvarNoHistorico(dados);
    } catch (error) {
        console.log("Erro ao buscar o CEP", error);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona um listener ao seletor para verificar se o valor está sendo capturado
    document.getElementById('ufInput').addEventListener('change', function() {
        const uf = this.value;
        console.log("Valor selecionado:", uf); // Verifica se o valor está sendo capturado
    });
});

// Função para buscar CEP pelo endereço (UF, Localidade, Logradouro)
async function buscarCepPorEndereco() {
    const uf = document.getElementById('ufInput').value;
    const localidade = encodeURIComponent(document.getElementById('localidadeInput').value);
    const logradouro = encodeURIComponent(document.getElementById('logradouroInput').value);

    if (uf === "" || localidade === "" || logradouro === "") {
        alert("Preencha todos os campos (UF, Cidade, Logradouro)");
        return;
    }

    try {
        const apiUrl = `https://viacep.com.br/ws/${uf}/${localidade}/${logradouro}/json/`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const dados = await response.json();

        if (dados.length === 0) {
            alert("CEP não encontrado");
            return;
        }

        const primeiroResultado = dados[0];

        document.getElementById('resultado').innerHTML = `
            <p><strong>CEP:</strong> ${primeiroResultado.cep}</p>
            <p><strong>UF:</strong> ${primeiroResultado.uf}</p>
            <p><strong>Localidade:</strong> ${primeiroResultado.localidade}</p>
            <p><strong>Bairro:</strong> ${primeiroResultado.bairro}</p>
            <p><strong>Logradouro:</strong> ${primeiroResultado.logradouro}</p>
        `;

        salvarNoHistorico(primeiroResultado);
    } catch (error) {
        console.log("Erro ao buscar o CEP pelo endereço", error);
    }
}


// Função para salvar as buscas no histórico
function salvarNoHistorico(dados) {
    historico.push(dados);
    localStorage.setItem('historico_buscas', JSON.stringify(historico));
    atualizarHistoricoNaTela();
}

// Função para exibir o histórico de buscas
function atualizarHistoricoNaTela() {
    const historicoUl = document.getElementById('historico');
    historicoUl.innerHTML = "";
    historico.forEach(dados => {
        const li = document.createElement('li');
        li.textContent = `${dados.cep} - ${dados.logradouro}, ${dados.bairro}, ${dados.localidade}, ${dados.uf}`;
        historicoUl.appendChild(li);
    });
}

// Função para limpar o histórico
function limparHistorico() {
    localStorage.removeItem('historico_buscas');
    historico = [];
    atualizarHistoricoNaTela();
    alert("Histórico limpo com sucesso");
}