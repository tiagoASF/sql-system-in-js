/*
1 - Objetivo
Lance uma exceção caso o comando não exista, interrompendo fluxo de execução

2 - Instruções
    2.1 - Crie uma função construtora chamada "DatabaseError" que recebe dois parâmetros: "statement" e "message".
    2.2 - Dentro do método "execute", caso o comando passado por parâmetro não exista, instancie a função construtora "DatabaseError", lançando-a como um erro.
    2.3 - Envolva a chamada para o objeto "database" em um bloco try/catch imprimindo a propriedade "message" do objeto "DatabaseError".

3 - Cenário

    database.execute("create table author (id number, name string, age number, city string, state string, country string)");

    database.execute("select id, name from author");

4 - Resultado
    "Syntax error: 'select id, name from author'"

5 - Dicas
Não esqueça de utilizar o operador new para instanciar a função construtora "DatabaseError" e de utilizar Template Literals para montar a mensagem de erro.
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

    execute(query) {
        if (query.startsWith("create table")) {
            this.createTable(query);
            console.log(JSON.stringify(database, null, "   "));
        } else {
            const databaseError = new DatabaseError(query, "Syntax Error")
            throw databaseError.message;
        }
    }
};

const DatabaseError = function(statement, message) {
    this.statement = statement;
    this.message = `${message}: ${statement}`;
}

try {
    const sqlQuery = "create table author (id number, name string, age number, city string, state string, country string)";
    //const sqlQuery = "select id, name from author";
    database.execute(sqlQuery);
    

} catch(e) {
    console.log(e);
}

















