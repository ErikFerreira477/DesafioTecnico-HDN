//CRUD - LOCAL STORAGE

//lê o banco, transforma em JSON e verifica se não está vazio
const getHero = () => JSON.parse(localStorage.getItem('db_Hero')) ?? [];

//Passando para o banco (chave, valor)
const setHero = (dbHero) => localStorage.setItem('db_Hero', JSON.stringify(dbHero));

//create
const createHero = (hero) => {
    const dbHero = getHero();
    //joga o herói pro banco
    dbHero.push(hero);
    setHero(dbHero);
}

//read (apenas replicando o gethero)
const readHero = () => getHero();

//update 
const updateHero = (index, hero) => {
    //lê o banco
    const dbHero = readHero();
    //recebe no index do db hero os dados atualizados
    dbHero[index] = hero;
    //mandar pro banco
    setHero(dbHero);
}

//delete
const deleteHero = (index) => {
    //lê o banco
    const dbHero = readHero();
    //deleta o campo selecionado com base no index
    delete dbHero[index];
    //remove valores null e undefined do banco
    const DbHeroFilterred = dbHero.filter(function (x) {
        return x !== null;
    });
    setHero(DbHeroFilterred);
}

//Métodos e Funções (Fora do CRUD)

//Limpa os campos
const clearFields = () => {
    //seleciona todas as classes (estão iguais em todos os inputs)
    const fields = document.querySelectorAll('.inputStyle');
    //limpa campo a campo selecionado
    fields.forEach(field => field.value = "");
    document.getElementById('heroName').dataset.index = 'new';
}

//verifica se todos os campos estão preenchidos
const isValidFields = () => {
    return document.getElementById('F').reportValidity();
}

//Com a verificação sendo concluída, ele pega os dados do form
const saveHero = () => {
    if (isValidFields()) {
        const hero = {
            Nome: document.getElementById('heroName').value,
            Descrição: document.getElementById('heroDisc').value,
            SuperPoder1: document.getElementById('heroPow1').value,
            SuperPoder2: document.getElementById('heroPow2').value
        }
        const index = document.getElementById('heroName').dataset.index
        //verifica se é um hérou novo ou a atualização de um existente
        if (index == 'new') {
            //cria um herói
            createHero(hero);
            //atualiza a tabela
            updateTable();
            //fecha a tela de cadastro
            closeCad();
        //se não for novo, atualiza
        } else {
            updateHero(index, hero);
            updateTable();
            closeCad();
        }
    }
}

//método para preencher a tabela visual
const createRow = (hero, index) => {
    //cria uma nova linha (ainda não está no DOM)
    const newRow = document.createElement('tr');
    //usando template string para criar a linha (ainda não está no DOM)
    //nos botões de editar e excluir serão criados atributos personalizados para serem capturados
    //ainda nos botoes, serão usados os indices para diferenciar a linha da tabela
    newRow.innerHTML = `
        <td>${hero.Nome}</td>
        <td>${hero.Descrição}</td>
        <td>${hero.SuperPoder1}</td>
        <td>${hero.SuperPoder2}</td>
        <td> 
            <button type="button" class="grennBut" id="edit-${index}">Editar</button>
            <button type="button" class="redBut" id="delete-${index}">Excluir</button>
        </td>
    `
    //selecionando o tbody e adicionando no DOM 
    document.querySelector('#tableHero>tbody').appendChild(newRow);
}

//limpa a memória da table para não dublicar a table toda
const clearTable = () => {
    //pega todas linhas
    const rows = document.querySelectorAll('#tableHero>tbody tr');
    //apaga a propria row 
    rows.forEach(row => row.parentNode.removeChild(row));
}

//método para manter a tabela atualizada
const updateTable = () => {
    //lê o que tem no localStorage
    const dbHero = readHero();
    //limpar a memória para não dublicar a table
    clearTable();
    //pega cada registro do DB e cria uma linha para eles
    dbHero.forEach(createRow);
}

//pega a tela do formulário e faz ela aparecer
const openCad = () => document.getElementById('pop').classList.add('active');

//apaga a tela do formulário
const closeCad = () => {
    document.getElementById('pop').classList.remove('active');
    //limpa os campos
    clearFields();
}

//preenche os dados necessários
const fillFields = (hero) => {
    document.getElementById('heroName').value = hero.Nome;
    document.getElementById('heroDisc').value = hero.Descrição;
    document.getElementById('heroPow1').value = hero.SuperPoder1;
    document.getElementById('heroPow2').value = hero.SuperPoder2;
    document.getElementById('heroName').dataset.index = hero.index;
}

//para  editar a linha
const editHero = (index) => {
    //le a partir do indice certo
    const hero = readHero()[index];
    //força o hero a ter um index
    hero.index = index;
    //preenche os dados necessários
    fillFields(hero);
    //abre a tela de edição
    openCad();
}

//detecta se a função será delete ou update
const editDelete = (event) => {
    //pega o typo de onde o clique ocorre e filtra para agir somente se for do id certo
    if (event.target.type == 'button') {
        //o split separa o target do id e eles são armazenados no vetor
        const [action, index] = event.target.id.split('-');

        //se for edit, editar a linha
        if (action == 'edit') {
            editHero(index);
            //se não, excluir
        } else {
            const client = readHero()[index]
            //lê o herói que vai ser excluido com base no indice
            deleteHero(index);
            updateTable()
        }
    }
}

//Deixei esse método aqui para evitar problemas da table quebrar
updateTable();

//Filtro de palavras
function searchHero() {
    //pega o filtro
    let filter = document.getElementById('fillt').value.toUpperCase();
    //pega a table
    let table = document.getElementById('tableHero');
    //pega a tr
    let tr = table.getElementsByTagName('tr');

    for (var i = 0; i < tr.length; i++) {
        //busca na coluna 3 e 4 da tabela
        let td = tr[i].querySelectorAll('td')[2];
        let td2 = tr[i].querySelectorAll('td')[3];

        //se a coluna 3 ou 4 existirem
        if (td) {
            //retornando -1 é por que não se encontra nos poderes
            if ((td.textContent.toUpperCase().indexOf(filter) > -1) || (td2.textContent.toUpperCase().indexOf(filter) > -1)) {
                //aqui ele mostra o resultado
                tr[i].style.display = "";
            } else {
                //aqui se não pertencer deixa o campo nulo
                tr[i].style.display = "none";
            }
        }
    }
}

//EVENTS (escutas)

//escuta o clique no botão de cadastrar herói
document.getElementById('butCad').addEventListener('click', openCad);

//escuta o clique no botão de fechar o cadastro de herói
document.getElementById('popClose').addEventListener('click', closeCad);

//escuta o clique do botão de salvar
document.getElementById('save').addEventListener('click', saveHero);

//escuta o clique nos botoes de editar e deletar
document.querySelector('#tableHero>tbody').addEventListener('click', editDelete);