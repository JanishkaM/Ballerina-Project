import ballerina/time;
public type Auth readonly & record {|
    string email;
    string password;
|};
public type IncomeRequest readonly & record {|
    int token;
    float amount;
    time:Date date;
    string name;
|};

public type IncomeRequestDelete readonly & record {|
    int token;
    int id;
|};

public type ExpenseRequest readonly & record {|
    int token;
    float amount;
    time:Date date;
    string name;
|};

public type ExpenseRequestDelete readonly & record {|
    int token;
    int id;
|};