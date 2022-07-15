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
    //const sqlQuery = "create table author (id number, name string, age number, city string, state string, country string)";
    const sqlQuery = "select id, name from author";
    database.execute(sqlQuery);
} catch(e) {
    console.log(e.message);
}

















