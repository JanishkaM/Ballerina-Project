import ballerina/http;
import ballerina/time;

const int SECRET_KEY = 9878787;

type ErrorResponse readonly & record {|
    string message;
    int code;
|};

type SuccessResponse readonly & record {|
    string message;
    int code;
|};

//Auth Types
type Auth readonly & record {|
    string email;
    string password;
|};

type AuthSuccess readonly & record {|
    string token;
    int code;
    string message;
|};

// Request Types
type IncomeRequest readonly & record {|
    int token;
    float amount;
    time:Date date;
    string name;
|};

type IncomeRequestDelete readonly & record {|
    int token;
    int id;
|};

type ExpenseRequest readonly & record {|
    int token;
    float amount;
    time:Date date;
    string name;
|};

type ExpenseRequestDelete readonly & record {|
    int token;
    int id;
|};

// Table Types
type User readonly & record {|
    readonly int id;
    string name;
    string email;
    string password;
|};

type Income readonly & record {|
    readonly int id;
    string userEmail;
    float amount;
    time:Date date;
    string name;
|};

type Expense readonly & record {|
    readonly int id;
    string userEmail;
    float amount;
    time:Date date;
    string name;
|};

// Tables
table<User> key(email) users = table [
    {id: 1, name: "Alice", email: "alice@example.com", password: "password123"},
    {id: 2, name: "Bob", email: "bob@example.com", password: "password456"}
];

table<Income> key(id) incomes = table [];

table<Expense> key(id) expenses = table [];

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: false,
        allowHeaders: ["Content-Type", "CORELATION_ID"],
        exposeHeaders: ["X-CUSTOM-HEADER"],
        allowMethods: ["GET", "POST", "DELETE", "OPTIONS"]
    }
}
service / on new http:Listener(9092) {
    // CORS is configured at the service level via @http:ServiceConfig above.

    resource function post auth(Auth auth) returns AuthSuccess|ErrorResponse {
        User? user = users[auth.email];
        if user is User {
            if user.password == auth.password {
                int token = SECRET_KEY + user.id;
                AuthSuccess res = {token: token.toString(), code: 200, message: "Authentication successful"};
                return res;
            } else {
                return {message: "Invalid password", code: 401};
            }
        }
        return {message: "User not found", code: 404};
    }

    resource function post income/add(IncomeRequest incomeRequest) returns SuccessResponse|ErrorResponse {

        string email = "";
        int id = incomeRequest.token - SECRET_KEY;

        foreach var user in users {
            if user.id == id {
                email = user.email;
                break;
            }
        }
        User? user = users[email];
        if user is User {
            Income newIncome = {id: incomes.length() + 1, userEmail: email, amount: incomeRequest.amount, date: incomeRequest.date, name: incomeRequest.name};
            incomes.add(newIncome);
            SuccessResponse res = {message: "Income added successfully", code: 200};
            return res;
        }
        ErrorResponse err = {message: "User not found", code: 404};
        return err;
    }

    resource function get income/all(int token) returns Income[]|AuthSuccess|ErrorResponse {

        string email = "";
        int id = token - SECRET_KEY;

        foreach var user in users {
            if user.id == id {
                email = user.email;
                break;
            }
        }

        User? user = users[email];
        if user is User {
            Income[] userIncomes = [];
            foreach var income in incomes {
                if income.userEmail == email {
                    userIncomes.push(income);
                }
            }
            return userIncomes;
        }
        return {message: "User not found", code: 404};
    }

    resource function delete income/remove(IncomeRequestDelete incomeRequestDelete) returns SuccessResponse|ErrorResponse {

        string email = "";
        int id = incomeRequestDelete.token - SECRET_KEY;
        int incomeID = incomeRequestDelete.id;

        foreach var user in users {
            if user.id == id {
                email = user.email;
                break;
            }
        }

        User? user = users[email];
        if user is User {
            Income? income = incomes[incomeRequestDelete.id];

            if income is Income {
                _ = incomes.remove(incomeID);
                SuccessResponse res = {message: "Income removed successfully", code: 200};
                return res;
            }
            ErrorResponse res = {message: "Income not found", code: 404};
            return res;
        }
        ErrorResponse err = {message: "User not found", code: 404};
        return err;
    }

    resource function post expense/add(ExpenseRequest expenseRequest) returns SuccessResponse|ErrorResponse {

        string email = "";
        int id = expenseRequest.token - SECRET_KEY;

        foreach var user in users {
            if user.id == id {
                email = user.email;
                break;
            }
        }
        User? user = users[email];
        if user is User {
            Expense newExpense = {id: expenses.length() + 1, userEmail: email, amount: expenseRequest.amount, date: expenseRequest.date, name: expenseRequest.name};
            expenses.add(newExpense);
            SuccessResponse res = {message: "Expense added successfully", code: 200};
            return res;
        }
        ErrorResponse err = {message: "User not found", code: 404};
        return err;
    }

    resource function get expense/all(int token) returns Expense[]|AuthSuccess|ErrorResponse {

        string email = "";
        int id = token - SECRET_KEY;

        foreach var user in users {
            if user.id == id {
                email = user.email;
                break;
            }
        }

        User? user = users[email];
        if user is User {
            Expense[] userExpenses = [];
            foreach var expense in expenses {
                if expense.userEmail == email {
                    userExpenses.push(expense);
                }
            }
            return userExpenses;
        }
        return {message: "User not found", code: 404};
    }

    resource function delete expense/remove(ExpenseRequestDelete expenseRequestDelete) returns SuccessResponse|ErrorResponse {

        string email = "";
        int id = expenseRequestDelete.token - SECRET_KEY;
        int expenseID = expenseRequestDelete.id;

        foreach var user in users {
            if user.id == id {
                email = user.email;
                break;
            }
        }

        User? user = users[email];
        if user is User {
            Expense? expense = expenses[expenseID];
            if expense is Expense {
                _ = expenses.remove(expenseID);
                SuccessResponse res = {message: "Expense removed successfully", code: 200};
                return res;
            }
            ErrorResponse res = {message: "Expense not found", code: 404};
            return res;
        }
        SuccessResponse res = {message: "User not found", code: 404};
        return res;
    }
}
