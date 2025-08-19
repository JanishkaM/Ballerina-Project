import ballerina/sql;

isolated function getUsersQuery() returns sql:ParameterizedQuery => `
    SELECT id, username, email, password FROM users;
`;

isolated function getUserByIdQuery(int id) returns sql:ParameterizedQuery => `
    SELECT id, username, email, password FROM users WHERE id = ${id} LIMIT 1;
`;

isolated function getUserByEmailQuery(string email) returns sql:ParameterizedQuery => `
    SELECT id, username, email, password FROM users WHERE email = ${email} LIMIT 1;
`;

isolated function getIncomesQuery() returns sql:ParameterizedQuery => `
    SELECT id, name, amount, year, month, day, user_email FROM incomes ORDER BY id;
`;

isolated function getIncomesByUserQuery(string userEmail) returns sql:ParameterizedQuery => `
    SELECT id, name, amount, year, month, day, user_email FROM incomes WHERE user_email = ${userEmail} ORDER BY id;
`;

isolated function getIncomesByUserAndMonthQuery(string userEmail, int month) returns sql:ParameterizedQuery => `
    SELECT id, name, amount, year, month, day, user_email
    FROM incomes
    WHERE user_email = ${userEmail} AND month = ${month}
    ORDER BY id;
`;

isolated function insertIncomeQuery(string name, float amount, int year, int month, int day, string userEmail)
        returns sql:ParameterizedQuery => `
    INSERT INTO incomes (name, amount, year, month, day, user_email)
    VALUES (${name}, ${amount}, ${year}, ${month}, ${day}, ${userEmail});
`;

isolated function getExpensesQuery() returns sql:ParameterizedQuery => `
    SELECT id, name, amount, year, month, day, user_email FROM expense ORDER BY id;
`;

isolated function getExpensesByUserQuery(string userEmail) returns sql:ParameterizedQuery => `
    SELECT id, name, amount, year, month, day, user_email FROM expense WHERE user_email = ${userEmail} ORDER BY id;
`;

isolated function getExpensesByUserAndMonthQuery(string userEmail, int month) returns sql:ParameterizedQuery => `
    SELECT id, name, amount, year, month, day, user_email
    FROM expense
    WHERE user_email = ${userEmail} AND month = ${month}
    ORDER BY id;
`;

isolated function insertExpenseQuery(string name, float amount, int year, int month, int day, string userEmail)
        returns sql:ParameterizedQuery => `
    INSERT INTO expense (name, amount, year, month, day, user_email)
    VALUES (${name}, ${amount}, ${year}, ${month}, ${day}, ${userEmail});
`;

isolated function deleteIncomeQuery(int id) returns sql:ParameterizedQuery => `
    DELETE FROM incomes WHERE id = ${id};
`;

isolated function deleteExpenseQuery(int id) returns sql:ParameterizedQuery => `
    DELETE FROM expense WHERE id = ${id};
`;