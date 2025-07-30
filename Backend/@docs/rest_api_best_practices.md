# REST API Design: Core Principles and Best Practices

This document outlines the best practices and core principles to consider when designing and building a RESTful API. Adhering to these guidelines leads to a more scalable, maintainable, and user-friendly API.

---

### 1. Use Nouns for Resources, Not Verbs
The core idea of REST is based on "Resources." Your API endpoints (URIs) should refer to these resources using nouns. The action to be performed on that resource should be determined by the HTTP method, not the URL.

- **Good:** `GET /users`, `POST /users`, `GET /users/123`
- **Bad:** `GET /getAllUsers`, `POST /createNewUser`, `GET /getUserById?id=123`

### 2. Leverage HTTP Methods (Verbs) Correctly
Use the standard HTTP methods to represent the action being performed on a resource.

- **`GET`**: Retrieve a resource or a collection of resources. (Safe and idempotent)
- **`POST`**: Create a new resource. (Not safe or idempotent)
- **`PUT`**: Update/replace an existing resource completely. The entire resource representation must be sent. (Idempotent)
- **`PATCH`**: Partially update an existing resource. Only the fields that need changing are sent. (Not necessarily idempotent)
- **`DELETE`**: Remove a resource. (Idempotent)

### 3. Use Plural Nouns for Collections
Use plural nouns for resource collections to keep the API URI format consistent and intuitive.

- **Good:** `GET /users`, `GET /users/123/posts`
- **Bad:** `GET /user`, `GET /user/123/post`

### 4. Provide Proper HTTP Status Codes
Use HTTP status codes to communicate the outcome of an API request. This allows clients to handle responses programmatically.

- **`2xx` - Success:**
  - `200 OK`: Standard success response for `GET`, `PUT`, `PATCH`.
  - `201 Created`: A new resource was successfully created (used with `POST`). The response should also contain a `Location` header pointing to the new resource's URL.
  - `204 No Content`: The request was successful, but there is no content to return (often used for `DELETE`).
- **`4xx` - Client Errors:**
  - `400 Bad Request`: The request was malformed (e.g., invalid JSON, missing parameters).
  - `401 Unauthorized`: The client is not authenticated.
  - `403 Forbidden`: The client is authenticated but does not have permission to access the resource.
  - `404 Not Found`: The requested resource does not exist.
- **`5xx` - Server Errors:**
  - `500 Internal Server Error`: A generic error for an unexpected failure on the server.

### 5. Implement API Versioning
Introduce changes without breaking existing client applications by versioning your API. The most common method is to include the version number in the URI path.

- **Example:** `https://api.example.com/v1/users`

### 6. Support Filtering, Sorting, and Pagination
For collection endpoints, provide mechanisms to filter, sort, and paginate the results to prevent overwhelming the client (and your server) with data. This is typically done with query parameters.

- **Filtering:** `GET /users?status=active`
- **Sorting:** `GET /users?sort=-createdAt` (the `-` indicates descending order)
- **Pagination:** `GET /users?page=2&limit=50`

### 7. Use Nested Routes for Relationships
If a resource is related to another, you can reflect this in the URI structure.

- **Example:** To get all posts for a specific user: `GET /users/123/posts`

Be careful not to make the nesting too deep (e.g., `/users/123/posts/45/comments` is probably okay, but avoid going further).

### 8. Create Meaningful and Consistent Error Messages
When an error occurs, provide a useful JSON payload that helps the developer understand what went wrong.

- **Good Error Response:**
  ```json
  {
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed.",
    "details": {
      "email": "A valid email address is required."
    }
  }
  ```

### 9. Secure Your API
- **Use HTTPS:** Always encrypt communication with TLS/SSL.
- **Authentication:** Use a standard, robust authentication mechanism like **OAuth2** or **JWT (JSON Web Tokens)**. Do not reinvent the wheel.
- **Authorization:** Ensure that authenticated users only have access to the resources they are permitted to see or modify.

### 10. Document Your API
Good documentation is crucial for API adoption and usability. Use a standard like the **OpenAPI Specification (formerly Swagger)** to describe your API's endpoints, parameters, responses, and authentication methods. This allows for the automatic generation of interactive documentation, client SDKs, and more.
