/*
 * Responsável pela busca automática de endereço pelo CEP (API viaCEP).
 * A validação e o envio do formulário ficam em validation.js.
 */

const campoCep = document.getElementById('cep');

// Indica se há uma consulta ao viaCEP em andamento
let buscandoCep = false;

const campos = {
    logradouro: document.getElementById('logradouro'),
    bairro: document.getElementById('bairro'),
    cidade: document.getElementById('cidade'),
    estado: document.getElementById('estado')
};

// Limpa os campos de endereço preenchidos automaticamente
function limparEndereco() {
    Object.values(campos).forEach(function (campo){
        campo.value = '';
        campo.classList.remove('is-invalid');
    })
}

// Mostra uma mensagem de erro abaixo do campo CEP
function mostrarErroCep(mensagem){
    campoCep.classList.add('is-invalid');
    campoCep.nextElementSibling.textContent = mensagem;
}

// Remove o erro do campo CEP
function limparErroCep() {
    campoCep.classList.remove('is-invalid');
    campoCep.nextElementSibling.textContent = '';
}

// Aceita apenas números no CEP
campoCep.addEventListener('input', function(){
    campoCep.value = campoCep.value.replace(/\D/g, '');
});

// Busca o endereço ao sair do campo CEP
campoCep.addEventListener('blur', function () {
    const cep = campoCep.value.replace(/\D/g, '');

    limparErroCep();
       
    // Campo vazio: apenas limpa o endereço
    if (cep === '') {
        limparEndereco();
        return;
    }

    if (cep.length !== 8) {
        limparEndereco();
        mostrarErroCep('CEP inválido. O CEP deve ter 8 dígitos.');
        return;
    }
    
    buscandoCep = true;
    
    fetch('https://viacep.com.br/ws/' + cep + '/json/')
            .then(function (response){
                if (!response.ok) throw new Error('Falha na requisição');
                return response.json();
    })
            .then(function (data){
                if (data.erro) {
                    limparEndereco();
                    mostrarErroCep('CEP não encontrado.');
                    return;
                }
                
                campos.logradouro.value = data.logradouro || 'Não disponível';
                campos.bairro.value = data.bairro || 'Não disponível';
                campos.cidade.value = data.localidade ||'Não disponível';
                campos.estado.value = data.uf || 'Não disponível';
                
                // Remove erros antigos dos campos de endereço
                limparErroCep();
                Object.values(campos).forEach(function (campo){
                    campo.classList.remove('is-invalid');
                });
    })
      .catch(function (error){
      limparEndereco();
      mostrarErroCep('Erro ao buscar o CEP. Tente novamente.');
      console.error(error);
    })
      .finally(function(){
      buscandoCep = false;
    });
});
