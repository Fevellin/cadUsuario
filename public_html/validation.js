/**
 * validation.js
 * Validação do formulário com jQuery e exibição do modal de sucesso (Brootstrap 5).
 */

$(document).ready(function (){
    
    // Marca um campo como inválido e mostra a mensagem abaixo dele
    function setError(selector, mensagem){
        $(selector).addClass('is-invalid');
        $(selector).siblings('.invalid-feedback').text(mensagem);
    }
    
    // Remove o erro de um campo
    function clearError(selector) {
        $(selector).removeClass('is-invalid');
        $(selector).siblings('.invalid-feedback').text('');
    }
    
    // Validação do formulário
    $('#registrationForm').on('submit', function (event){
        event.preventDefault();
        
        let isValid = true;
        
        // Limpa erros anteriores
        $('#registrationForm .form-control').each(function(){
            clearError(this);
        });
        
        // Nome
        if ($('#nome').val().trim() === ''){
            isValid = false;
            setError('#nome', 'O campo Nome é obrigatório.');
        }
        
        // Sobrenome
        if ($('#sobrenome').val().trim() === ''){
            isValid = false;
            setError('#sobrenome', 'O campo Sobrenome é obrigatório.');
        }
        
        // E-mail
        const email = $('#email').val().trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (email === ''){
            isValid = false;
            setError('#email', 'O campo E-mail é obrigatório.');
        } else if (!emailPattern.test(email)){
            isValid = false;
            setError('#email', 'Insira um email válido (exemplo@email.com).');
        }
        
        // Senha (mínomo 8 caracteres, 1 número e 1 caractere especial)
        const senha = $('#senha').val();
        const senhaPattern = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        
        if (senha === ''){
            isValid = false;
            setError('#senha', 'O campo Senha é obrigatório.');
        } else if (!senhaPattern.test(senha)){
            isValid = false;
            setError('#senha', 'Mínimo de 8 caracteres, com um número e um caractere especial.');
        }
        
        // CEP
        const cep = $('#cep').val().trim();
        if(cep === ''){
            isValid = false;
            setError('#cep', 'O campo CEP é obrigatório.');
        } else if (!/^\d{8}$/.test(cep)){
            isValid = false;
            setError('#cep', 'O CEP deve conter 8 números.');
        } else if (buscandoCep){
            // A consulta ao viaCEP ainda não terminou
            isValid = false;
            setError('#cep', 'Aguarde a busca do endereço e tente novamente.');
        } else if ($('#logradouro').val().trim() === ''){
            // CEP com formato válido (8 números), mas o endereço não foi carregado
            isValid = false;
            setError('#cep', 'Endereço não encontrado. Verifique o CEP.');
        }
        
        // Número
        const numero = $('#numero').val().trim();
        if (numero === ''){
            isValid = false;
            setError('#numero', 'Obrigatório.');
        } else if (!/^\d+$/.test(numero)){
            isValid = false;
            setError('#numero', 'Somente números.');
        }
        
        // O complemento é opcional, então não é validado.
        
        if (isValid){
            // Exibe o modal de sucesso (API nativa do Brootstrap 5)
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('successModal'));
            modal.show();
            
            // Limpa o formulário e os campos de endereço
            $('#registrationForm')[0].reset();
            $('#logradouro, #bairro, #cidade, #estado').val('');
        } else {
            // Leva o foco para o primeiro campo com erro
            $('#registrationForm .is-invalid').first().trigger('focus');
        }
    });
    
    // Remove o erro de um campo assim que o usuário volta a digitar nele
    $('#registrationForm .form-control').on('input', function(){
        clearError(this);
    });
    
    // Campo Número: aceita apenas dígitos
    $('#numero').on('input', function(){
        $(this).val($(this).val().replace(/\D/g, ''));
    });
});
