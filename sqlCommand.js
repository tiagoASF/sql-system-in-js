let database = {
    tables : {},
    
    //cria uma tabela no objeto database
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

    //insere valores na tabela informada
    insert(query) {
        const regExp = /^insert into\s(\w+)\s\(([\w\s,]+)\)\svalues\s\(([\w+\s,]+)\)/;
        const result = query.match(regExp);

        //destructuring
        let [,tableName, columns, values] = result;

        columns = columns.split(", ");
        values = values.split(", ");
        
        let row = {};

        for (let i = 0; i < columns.length; i++) {
            row[columns[i]] = values[i];
        };

        this.tables[tableName].data.push(row);
    },

    select(query) {
        //"select name, age from author where id = 1"
        //"select name, age from author"
        const regExp = /^select ([\w\s,]+) from (\w+)(?: where (.+))?/;
        const queryParameters = query.match(regExp);

        //console.log(queryParameters);
        let [, columns, tableName, whereClause] = queryParameters;
        let rows = this.tables[tableName].data;
        columns = columns.split(', ');

        if (whereClause) {
            [columnWhere, valueWhere] = whereClause.split(" = ");
            rows = rows.filter(function(row) {
                return row[columnWhere] === valueWhere;
            });
        }

        rows = rows.map(function(row) {
            let selectedRow = {};
            columns.forEach(function(column) {
                selectedRow[column] = row[column];
            })
           return selectedRow;
        });

        return rows;

    },

    //executa a query conforme o tipo de comando
    execute(query) {
        if (query.startsWith("create table")) {
            this.createTable(query);
            //console.log(JSON.stringify(database, null, "   "));
        } else if (query.startsWith("insert into")) {
            this.insert(query);
            //console.log(JSON.stringify(database, null, "   "));
        } else if (query.startsWith("select")){
            this.select(query);
            console.log(JSON.stringify((this.select(query)), null, "   "));
        } else {
            throw new DatabaseError(query, "Syntax Error");
        }
        
    }
};

//tratamento de erro
const DatabaseError = function(statement, message) {
    this.statement = statement;
    this.message = `${message}: ${statement}`;
}

//execucao dos comandos
try {
    const createTableQuery = "create table author (id number, name string, age number, city string, state string, country string)";

    database.execute(createTableQuery);
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
    database.execute("select name, age from author where id = 2");
    database.execute("select name, age from author");

} catch(e) {
    console.log(e.message);
}


/*
1 - Objetivo
    Implemente o método "select". Para isso, é necessário extrair as informações a partir do comando, filtrando os dados pela cláusula "where" e montando os objetos de acordo com as colunas selecionadas.

2 - Instruções
    Dada o comando: 
    select name, age from author where id = 1

    2.1 - Crie um método chamado "select".
    2.2 - Na função "execute", invoque o método "select".
    2.3 - No método "select", retorne todos os registros considerando apenas as colunas selecionadas.
    2.4 - Extraia a cláusula where do comando.
    2.5 - Crie as variáveis columnWhere e valueWhere.
    2.6 - Filtre os registros conforme a cláusula where.

3 - Cenário

    database.execute("create table author (id number, name string, age number, city string, state string, country string)");
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
    database.execute("select name, age from author");
    database.execute("select name, age from author where id = 1");

4 - Dicas
    Você pode utilizar a operação Array.prototype.map para converter um array em outro e ainda a operação Array.prototype.filter para filtrar os dados. Você pode querer ignorar um grupo de captura, para isso utiliza a notação ?: dentro do grupo, por exemplo (?: where (.+))?

5 - Resultado

    [{
        "name": "Douglas Crockford",
        "age": "62"
    }, {
            "name": "Linus Torvalds",
            "age": "47"
    }, {
            "name": "Martin Fowler",
            "age": "54"
    }]

    [{
    "name": "Douglas Crockford",
    "age": "62"
    }, ]
*/