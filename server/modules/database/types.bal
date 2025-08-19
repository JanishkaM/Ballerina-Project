import ballerina/sql;

type DatabaseConfig record {|
    # User of the database
    string user;
    # Password of the database
    string password;
    # Name of the database
    string database;
    # Host of the database
    string host;
    # Port
    int port;
|};

# Book record type.
public type User record {|
    # User ID
    @sql:Column {name: "id"}
    readonly int id;

    # User name
    @sql:Column {name: "username"}
    string username;

    # User email
    @sql:Column {name: "email"}
    string email;

    # User password
    @sql:Column {name: "password"}
    string password;
|};

public type Income record {|
    # income ID
    @sql:Column {name: "id"}
    readonly int id;

    # income name
    @sql:Column {name: "name"}
    string name;

    # income amount
    @sql:Column {name: "amount"}
    float amount;

    # income year
    @sql:Column {name: "year"}
    int year;

    # income month
    @sql:Column {name: "month"}
    int month;

    # income day
    @sql:Column {name: "day"}
    int day;

    # user email
    @sql:Column {name: "user_email"}
    string userEmail;
|};

public type Expense record {|
    @sql:Column {name: "id"}
    readonly int id;

    # expense name
    @sql:Column {name: "name"}
    string name;

    # expense amount
    @sql:Column {name: "amount"}
    float amount;

    # expense year
    @sql:Column {name: "year"}
    int year;

    # expense month
    @sql:Column {name: "month"}
    int month;

    # expense day
    @sql:Column {name: "day"}
    int day;

    # user email
    @sql:Column {name: "user_email"}
    string userEmail;
|};
