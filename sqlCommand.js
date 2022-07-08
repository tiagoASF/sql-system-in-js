const sqlCommand = "create table author (id number, name string, age number, city string, state string, country string)";

const regExp = /create\stable\s(\w+)\s\(([\w\s,]+)\)/;
const result = sqlCommand.match(regExp);

const tableName = result[1];
let columns = result[2].split(', ');

let database = {
    "tables" : {
        [tableName] : {
            columns : {},
            "data" : []
        }
    }
};

for (let column of columns) {
    column = column.split(' ');
    let columnName = column[0];
    let columnValue = column[1];
    database.tables[tableName].columns[columnName] = columnValue;
}

console.log(JSON.stringify(database, null, '    '));

