// Objetivo
    //Extrair partes do comando como o nome da tabela e as colunas, armazenando-as em variáveis.

//instruções Exercicio 1
    // Dado o comando:
        // create table author (id number, name string, age number, city string, state string, country string)

        // Extraia o nome da tabela e armazene em uma variável chamada "tableName".
        // Extraia as colunas da tabela e armazene em uma variável chamada "columns".
        // Manipule a variável "columns", separando cada coluna com seu respectivo tipo, em uma string separada.

//Resultado esperado
    //tableName = "author"
    //columns = [ 'id number',' name string',' age number',' city string',' state string',' country string']

//Dicas
// Explore ao máximo as operações disponíveis na String API como: String.prototype.match, String.prototype.replace e String.prototype.split, juntamente com expressões regulares. A operação String.prototype.split retorna uma array, então não é necessário se preocupar em criar ou adicionar as colunas no array.

const sqlCommand = "create table author (id number, name string, age number, city string, state string, country string)";

const regExp = /^create table (\w+)\s\(([\w\s,]+)\)/; 
const result = sqlCommand.match(regExp);

let tableName = result[1];
let columns = result[2].split(", ");
