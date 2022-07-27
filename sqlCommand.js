//função parser da query informada pelo usuário
const Parser = function(){
    const regExpCreateTable = /^create table\s(\w+)\s\(([\w\s,]+)\)/;
    const regExpInsertInTable = /^insert into\s(\w+)\s\(([\w\s,]+)\)\svalues\s\(([\w+\s,]+)\)/;
    const regExpSelect = /^select ([\w\s,]+) from (\w+)(?: where (.+))?/;
    const regExpDelete = /^delete from (\w+)(:? where (.+))?/;

    const commands = new Map();
    commands.set("createTable", regExpCreateTable);
    commands.set("insert", regExpInsertInTable);
    commands.set("select", regExpSelect);
    commands.set("delete", regExpDelete);

    this.parse = function(statement) {
        for (let command of commands) {
            const [commandName, regExp] = command;
            if (regExp.test(statement)) {
                return {
                    command: commandName,
                    parsedStatement : statement.match(regExp)
                };
            }
        } 
    };
};


//tratamento de erro
const DatabaseError = function(statement, message) {
    this.statement = statement;
    this.message = `${message}: ${statement}`;
}


let database = {
    tables : {},

    //a instancia dentro do objeto é interessante para que ela seja criada apenas uma vez, caso fosse no execute, sempre seria criado um novo objeto
    parser: new Parser(),
    
    //cria uma tabela no objeto database
    createTable(parsedStatement) {
        
        const tableName = parsedStatement[1];
        let columns = parsedStatement[2].split(', ');

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
    insert(parsedStatement) {
        //destructuring
        let [,tableName, columns, values] = parsedStatement;

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
    select(parsedStatement) {
        let [, columns, tableName, whereClause] = parsedStatement;
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
    delete(parsedStatement) {
        
        [, tableName, whereClause] = parsedStatement;
        
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
        const result = this.parser.parse(query);
        if (result) {
            return this[result.command](result.parsedStatement);
        }

        throw new DatabaseError(query, "Syntax Error");
    }
};


//execucao dos comandos
try {
    database.execute("create table author (id number, name string, age number, city string, state string, country string)");
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
    console.log(JSON.stringify(database.execute("select name, age from author where id = 3"), null, "\t"));
    database.execute("delete from author where id = 3");
    console.log(JSON.stringify(database.execute("select name, age from author"), null, '\t'));


} catch(e) {
    console.log(e.message);
}