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

    //retorna um array com os objetos selecionados com base nas colunas do banco
    //funciona com ou sem a clausula where
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
    //"apaga uma linha do banco conforme clausula where.
    //Se não houiver clausula WHERE apaga toda a tabela
    delete(query) {
        const regExp = /^delete from (\w+)(:? where (.+))?/;
        const queryParameters = query.match(regExp);
        [, tableName, whereClause] = queryParameters;
        
        if (whereClause) {
            whereClause = whereClause.split(" = ");
            [columnWhere, columnValue] = whereClause;        
            let rowToDelete = this.tables[tableName].data.filter(function(row) {
                return row[columnWhere] === columnValue;
            });
    
            const index = this.tables[tableName].data.indexOf(rowToDelete);
            this.tables[tableName].data.splice(index, 1);
        } else {
            this.tables[tableName].data = [];
        }

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
        } else if (query.startsWith("delete")){
            this.delete(query);
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
    database.execute("select name, age from author where id = 3");
    database.execute("delete from author where id = 3");
    database.execute("select name, age from author");


} catch(e) {
    console.log(e.message);
}