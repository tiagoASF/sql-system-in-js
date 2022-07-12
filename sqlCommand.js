
// Exercicio 3

//Objetivo
//Crie dois métodos no objeto "database" chamados de "createTable" e "execute". O comando createTable já foi implementado no exercício anterior, mova o código e utilize o método "execute" para invocar dinamicamente o método "createTable" 

//Instruções

//[] 1 - No objeto "database", crie uma função chamada "createTable", que recebe     o comando por parâmetro.

//[] 2 -  Mova o código responsável por criar a tabela para dentro do método "createTable".

//[] 3 -  Crie uma função chamada "execute", invocando dinamicamente a função "createTable".

//Cenário
// database.execute("create table author (id number, name string, age number, city string, state string, country string)");

//Resultado
// {
//     "tables": {
    //       "author": {
        //         "columns": {
            //           "id": "number",
//           "name": "string",
//           "age": "number",
//           "city": "string",
//           "state": "string",
//           "country": "string"
//         },
//         "data": []
//       }
//     }
// }

//Dicas
//Não se esqueça de utilizar o "this" para referenciar a propriedade "tables" do objeto "database". 
//Você pode utilizar a operação String.prototype.startsWith para verificar se o comando começa com "create table" e realizar a chamada para o método "createTable".

let database = {
    tables : {},
    
    createTable(query) {
        const regExp = /^create table\s(\w+)\s\(([\w\s,]+)\)/;
        const result = query.match(regExp);
        const tableName = result[1];
        let columns = result[2].split(', ');

        this.tables[tableName] = {
            columns : {},
            data : []
        }
        
        for (let column of columns) {
            column = column.split(" ");
            let columnName = column[0];
            let columnValue = column[1];
        
            this.tables[tableName].columns[columnName] = columnValue;
        }
    },

    execute(query) {
        if (query.startsWith("create table")) {
            this.createTable(query);
        } else {
            console.log("Invalid SQL query");
        }
    }
};

const sqlQuery = "create table author (id number, name string, age number, city string, state string, country string)";


database.execute(sqlQuery);
console.log(JSON.stringify(database, null, "\t"));

















