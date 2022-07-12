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

















