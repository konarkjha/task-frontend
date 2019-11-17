export const STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

export const RESPONSE_MESSAGES = {
  SUCCESS: "Success",
  INVALID_TOKEN: "invalid_token",
  AUTH_HEADER_MISSING: "authorization_header_missing",
  NOT_LATEST_LOGIN: "is_not_latest_login"
};

export const UNKNOWN_ERROR_MESSAGE = "Something went wrong";

export const SESSION_STORAGE = {
  TOKEN: "token",
  ID: "id",
  USER_ROLES: "roles",
  DETAILS: "details",
  RESEND: "resend"
};

export const MESSAGES = {
  PASSWORD_MISMATCH: "Password doesn't match",
  MISSING_FIELDS: "Please provide required fields",
  INVALID_CREDENTIALS: "Please provide valid credentials",
  FIELDS_UNIQUE: "Phone number and email Id should be unique",
  DATA_ADDED: "Data added successfully",
  DATA_DELETED: "Data deleted successfully",
  DATA_UPDATED: "Data updated successfully",
  INVALID_EMAIL: "Please provide correct email id",
  INVALID_MOBILE: "Please provide correct mobile number",
  NOT_LATEST_LOGIN: "is_not_latest_login",
  USER_CREATED: "User Created Successfully"
};
export const ROUTE_LIST = {
  HOME: "/users"
};

export const EDIT_ROLES = "editRoles";

export const MANAGE_USERS = "userManagement";

export const SPINNER_CONFIGS = {
  BDCOLOR: "#4e4e4e",
  SIZE: "default",
  COLOR: "#a23f9d",
  TYPE: "square-jelly-box",
  FULLSCREEN: true,
  SPINNER_TEXT: "Loading...",
  SPINNER_TEXT_COLOR: "#ffffff"
};
export const SEARCH_DEBOUNCE_TIME = 200;
export const ONLY_ALPHANUMERIC_PATTERN = /^[0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/;
