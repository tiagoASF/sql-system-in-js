/*

1. Objetivo
    Implemente o método "insert". Para isso, é necessário, como sempre, extrair as informações a partir do comando, converter as informações em um objeto e inserir no array "data" da tabela correspondente.

2. Instruções

    Dados os comandos:
        insert into author (id, name, age) values (1, Douglas Crockford, 62)
        insert into author (id, name, age) values (2, Linus Torvalds, 47)
        insert into author (id, name, age) values (3, Martin Fowler, 54)

    2.1 - No objeto "database", crie um método chamado "insert", que recebe o comando por parâmetro.
    2.2 - Na função "execute", invoque o método "insert".
    2.3 - Extraia o nome da tabela para a variável "tableName", as colunas para a variável "columns" e os valores para a variável "values".
    2.4 - Manipule os valores dentro "columns" e "values", separando-os um a um.
    2.5 - Crie um objeto chamado "row" com base nas colunas e valores.
    2.6 - Insira o objeto em "data".


3. Cenário

    database.execute("create table author (id number, name string, age number, city string, state string, country string)");
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");


4. Dicas
    Utilize um for, com índice, para percorrer ao mesmo tempo o array de colunas e de valores. Utilize a operação push para incluir no array "data". Não se esqueça de utilizar destructuring para extrair os dados de dentro do array.



5. Resultado
    {
  "tables": {
    "author": {
      "columns": {
        "id": "number",
        "name": "string",
        "age": "number",
        "city": "string",
        "state": "string",
        "country": "string"
      },
      "data": [{
        "id": "1",
        "name": "Douglas Crockford",
        "age": "62"
      }, {
        "id": "2",
        "name": "Linus Torvalds",
        "age": "47"
      }, {
        "id": "3",
        "name": "Martin Fowler",
        "age": "54"
      }]
    }
  }
}

*/


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

    //"insert into author (id, name, age) values (1, Douglas Crockford, 62)"
    insert(query) {
        const regExp = /^insert into\s(\w+)\s\(([\w\s,]+)\)\svalues\s\(([\w+\s,]+)\)/;
        const result = query.match(regExp);

        const tableName = result[1];
        const columnsNames = result[2].split(", ");
        const columnsValues = result[3].split(", ");
        const row = {};

        for (let i = 0; i < columnsNames.length; i++) {
            row[columnsNames[i]] = columnsValues[i];
        };

        this.tables[tableName].data.push(row);
    },

    execute(query) {
        if (query.startsWith("create table")) {
            this.createTable(query);
            console.log(JSON.stringify(database, null, "   "));
        } else if (query.startsWith("insert into")) {
            this.insert(query);
            console.log(JSON.stringify(database, null, "   "));
        } else {
            throw new DatabaseError(query, "Syntax Error");
        }
        
    }
};

const DatabaseError = function(statement, message) {
    this.statement = statement;
    this.message = `${message}: ${statement}`;
}

try {
    const createTableQuery = "create table author (id number, name string, age number, city string, state string, country string)";
    //const sqlSelectQuery = "select id, name from author";

    database.execute(createTableQuery);
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");

} catch(e) {
    console.log(e.message);
}



const query = "insert into author (id, name, age) values (1, Douglas Crockford, 62)"

const regExp = /^insert into\s(\w+)\s\(([\w\s,]+)\)\svalues\s\(([\w+\s,]+)\)/;
const result = query.match(regExp);

const tableName = result[1];
const columnsNames = result[2].split(", ");
const columnsValues = result[3].split(", ");
const row = {};

for (let i = 0; i < columnsNames.length; i++) {
    row[columnsNames[i]] = columnsValues[i];
    
};

database.tables[tableName].data.push(row);



























