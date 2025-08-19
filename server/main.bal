import ballerina/http;
import ballerina_project.database;
import ballerina_project.types as api;

const int SECRET_KEY = 9878787;

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

    // Resource function to get users from DB.
    resource function get users() returns database:User[]|http:InternalServerError {
        database:User[]|error res = database:getUsers();
        if res is error {
            return <http:InternalServerError>{ body: "Error while retrieving users" };
        }
        return res;
    }

    resource function post auth(api:Auth auth) returns api:AuthSuccess|api:ErrorResponse {
        database:User|()|error u = database:getUserByEmail(auth.email);
        if u is error {
            return <api:ErrorResponse>{message: "Auth failed", code: 500};
        }
        if u is () {
            return <api:ErrorResponse>{message: "User not found", code: 404};
        }
        if u.password == auth.password {
            int token = SECRET_KEY + u.id;
            api:AuthSuccess res = {token: token.toString(), code: 200, message: "Authentication successful"};
            return res;
        }
    return <api:ErrorResponse>{message: "Invalid password", code: 401};
    }

    resource function post income/add(api:IncomeRequest incomeRequest) returns api:SuccessResponse|api:ErrorResponse {

        int userId = incomeRequest.token - SECRET_KEY;
        database:User|()|error maybeUser = database:getUserById(userId);
        if maybeUser is error {
            return <api:ErrorResponse>{message: "Error finding user", code: 500};
        }
        if maybeUser is () {
            return <api:ErrorResponse>{message: "User not found", code: 404};
        }
        int|error insertId = database:addIncome(incomeRequest.name, incomeRequest.amount,
                incomeRequest.date.year, incomeRequest.date.month, incomeRequest.date.day, maybeUser.email);
        if insertId is error {
            return <api:ErrorResponse>{message: "Error adding income", code: 500};
        }
        api:SuccessResponse res = {message: "Income added successfully", code: 200};
        return res;
    }

    resource function get income/all(int token, int? month) returns database:Income[]|api:AuthSuccess|api:ErrorResponse {

        int userId = token - SECRET_KEY;
    database:User|()|error maybeUser = database:getUserById(userId);
        if maybeUser is error {
            return <api:ErrorResponse>{message: "Error finding user", code: 500};
        }
        if maybeUser is () {
            return <api:ErrorResponse>{message: "User not found", code: 404};
        }
        if month is int && (month < 1 || month > 12) {
            return <api:ErrorResponse>{message: "Invalid month. Use 1-12.", code: 400};
        }
        database:Income[]|error incomes = month is int
            ? database:getIncomesByUserAndMonth(maybeUser.email, month)
            : database:getIncomesByUser(maybeUser.email);
        if incomes is error {
            return <api:ErrorResponse>{message: "Error fetching incomes", code: 500};
        }
        return incomes;
    }

    resource function delete income/remove(api:IncomeRequestDelete incomeRequestDelete) returns api:SuccessResponse|api:ErrorResponse {

        int userId = incomeRequestDelete.token - SECRET_KEY;
        database:User|()|error maybeUser = database:getUserById(userId);
        if maybeUser is error {
            return <api:ErrorResponse>{message: "Error finding user", code: 500};
        }
        if maybeUser is () {
            return <api:ErrorResponse>{message: "User not found", code: 404};
        }
        boolean|error ok = database:deleteIncome(incomeRequestDelete.id);
        if ok is error {
            return <api:ErrorResponse>{message: "Error deleting income", code: 500};
        }
    if ok { return <api:SuccessResponse>{message: "Income removed successfully", code: 200}; }
    return <api:ErrorResponse>{message: "Income not found", code: 404};
    }

    resource function post expense/add(api:ExpenseRequest expenseRequest) returns api:SuccessResponse|api:ErrorResponse {

        int userId = expenseRequest.token - SECRET_KEY;
        database:User|()|error maybeUser = database:getUserById(userId);
        if maybeUser is error {
            return <api:ErrorResponse>{message: "Error finding user", code: 500};
        }
        if maybeUser is () {
            return <api:ErrorResponse>{message: "User not found", code: 404};
        }
        int|error insertId = database:addExpense(expenseRequest.name, expenseRequest.amount,
                expenseRequest.date.year, expenseRequest.date.month, expenseRequest.date.day, maybeUser.email);
        if insertId is error {
            return <api:ErrorResponse>{message: "Error adding expense", code: 500};
        }
        api:SuccessResponse res = {message: "Expense added successfully", code: 200};
        return res;
    }

    resource function get expense/all(int token, int? month) returns database:Expense[]|api:AuthSuccess|api:ErrorResponse {

        int userId = token - SECRET_KEY;
        database:User|()|error maybeUser = database:getUserById(userId);
        if maybeUser is error {
            return <api:ErrorResponse>{message: "Error finding user", code: 500};
        }
        if maybeUser is () {
            return <api:ErrorResponse>{message: "User not found", code: 404};
        }
        if month is int && (month < 1 || month > 12) {
            return <api:ErrorResponse>{message: "Invalid month. Use 1-12.", code: 400};
        }
        database:Expense[]|error exps = month is int
            ? database:getExpensesByUserAndMonth(maybeUser.email, month)
            : database:getExpensesByUser(maybeUser.email);
        if exps is error {
            return <api:ErrorResponse>{message: "Error fetching expenses", code: 500};
        }
        return exps;
    }

    resource function delete expense/remove(api:ExpenseRequestDelete expenseRequestDelete) returns api:SuccessResponse|api:ErrorResponse {

        int userId = expenseRequestDelete.token - SECRET_KEY;
        database:User|()|error maybeUser = database:getUserById(userId);
        if maybeUser is error {
            return <api:ErrorResponse>{message: "Error finding user", code: 500};
        }
        if maybeUser is () {
            return <api:ErrorResponse>{message: "User not found", code: 404};
        }
        boolean|error ok = database:deleteExpense(expenseRequestDelete.id);
        if ok is error {
            return <api:ErrorResponse>{message: "Error deleting expense", code: 500};
        }
    if ok { return <api:SuccessResponse>{message: "Expense removed successfully", code: 200}; }
    return <api:ErrorResponse>{message: "Expense not found", code: 404};
    }
}
