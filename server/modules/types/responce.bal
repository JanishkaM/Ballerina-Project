public type ErrorResponse readonly & record {|
    string message;
    int code;
|};

public type SuccessResponse readonly & record {|
    string message;
    int code;
|};

public type AuthSuccess readonly & record {|
    string token;
    int code;
    string message;
|};