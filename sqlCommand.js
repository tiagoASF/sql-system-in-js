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

    //executa a query conforme o tipo de comando
    execute(query) {
        if (query.startsWith("create table")) {
            this.createTable(query);
            //console.log(JSON.stringify(database, null, "   "));
        } else if (query.startsWith("insert into")) {
            this.insert(query);
            console.log(JSON.stringify(database, null, "   "));
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

} catch(e) {
    console.log(e.message);
}


