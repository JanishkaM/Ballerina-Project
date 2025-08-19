import ballerina/sql;

// Define the function to fetch users from the database.
public isolated function getUsers() returns User[]|sql:Error {
    stream<User, sql:Error?> s = dbClient->query(getUsersQuery(), User);
    User[] rows = check from User u in s select u;
    return rows;
}

public isolated function getUserById(int id) returns User|()|sql:Error {
    stream<User, sql:Error?> s = dbClient->query(getUserByIdQuery(id), User);
    User[] rows = check from User u in s select u;
    if rows.length() > 0 {
        return rows[0];
    }
    return ();
}

public isolated function getUserByEmail(string email) returns User|()|sql:Error {
    stream<User, sql:Error?> s = dbClient->query(getUserByEmailQuery(email), User);
    User[] rows = check from User u in s select u;
    if rows.length() > 0 {
        return rows[0];
    }
    return ();
}

public isolated function getIncomes() returns Income[]|sql:Error {
    stream<Income, sql:Error?> s = dbClient->query(getIncomesQuery(), Income);
    Income[] rows = check from Income i in s select i;
    return rows;
}

public isolated function getIncomesByUser(string userEmail) returns Income[]|sql:Error {
    stream<Income, sql:Error?> s = dbClient->query(getIncomesByUserQuery(userEmail), Income);
    Income[] rows = check from Income i in s select i;
    return rows;
}

public isolated function getIncomesByUserAndMonth(string userEmail, int month) returns Income[]|sql:Error {
    stream<Income, sql:Error?> s = dbClient->query(getIncomesByUserAndMonthQuery(userEmail, month), Income);
    Income[] rows = check from Income i in s select i;
    return rows;
}

public isolated function addIncome(string name, float amount, int year, int month, int day, string userEmail)
        returns int|sql:Error {
    sql:ExecutionResult|sql:Error result = dbClient->execute(insertIncomeQuery(name, amount, year, month, day, userEmail));
    if result is sql:ExecutionResult {
        return <int>result.lastInsertId;
    }
    return result;
}

public isolated function getExpenses() returns Expense[]|sql:Error {
    stream<Expense, sql:Error?> s = dbClient->query(getExpensesQuery(), Expense);
    Expense[] rows = check from Expense e in s select e;
    return rows;
}

public isolated function getExpensesByUser(string userEmail) returns Expense[]|sql:Error {
    stream<Expense, sql:Error?> s = dbClient->query(getExpensesByUserQuery(userEmail), Expense);
    Expense[] rows = check from Expense e in s select e;
    return rows;
}

public isolated function getExpensesByUserAndMonth(string userEmail, int month) returns Expense[]|sql:Error {
    stream<Expense, sql:Error?> s = dbClient->query(getExpensesByUserAndMonthQuery(userEmail, month), Expense);
    Expense[] rows = check from Expense e in s select e;
    return rows;
}

public isolated function addExpense(string name, float amount, int year, int month, int day, string userEmail)
        returns int|sql:Error {
    sql:ExecutionResult|sql:Error result = dbClient->execute(insertExpenseQuery(name, amount, year, month, day, userEmail));
    if result is sql:ExecutionResult {
        return <int>result.lastInsertId;
    }
    return result;
}

public isolated function deleteIncome(int id) returns boolean|sql:Error {
    // Execute the delete query for income.
    sql:ExecutionResult|sql:Error result = dbClient->execute(deleteIncomeQuery(id));

    // Check if the deletion was successful.
    if result is sql:ExecutionResult {
        return result.affectedRowCount > 0;
    }
    
    // If there is an error, return an error message.
    return error("Error deleting income");
}

public isolated function deleteExpense(int id) returns boolean|sql:Error {
    // Execute the delete query for expense.
    sql:ExecutionResult|sql:Error result = dbClient->execute(deleteExpenseQuery(id));

    // Check if the deletion was successful.
    if result is sql:ExecutionResult {
        return result.affectedRowCount > 0;
    }

    // If there is an error, return an error message.
    return error("Error deleting expense");
}