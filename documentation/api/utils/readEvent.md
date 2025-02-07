Here’s the **entire Markdown documentation** ready for you to copy and paste into your `.md` file. Everything is **fully formatted in Markdown**—there’s no mix of other formats.

---

# `readEvent` Function Documentation

The `readEvent` function simplifies extracting and handling data from [H3](https://github.com/unjs/h3) API event objects in a Nuxt app's [Nitro backend](https://nuxt.com/docs/guide/directory-structure/server). It allows developers to easily read the request body, query parameters, headers, route parameters, and bearer tokens.

## Table of Contents

- [Function Signature](#function-signature)
- [Parameters](#parameters)
- [Return Value](#return-value)
- [Options](#options)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Customization](#customization)
- [Notes](#notes)
- [Related Documentation](#related-documentation)

---

## Function Signature

```typescript
async function readEvent(event: H3Event, options: ReadEventOptions): Promise<ReadEventResult>
```

---

## Parameters

1. **`event: H3Event`**  
   The H3 event object provided by Nuxt's Nitro backend. It contains information about the HTTP request. See the [H3 documentation](https://github.com/unjs/h3#event-object) for more details.

2. **`options: ReadEventOptions`**  
   An array of strings specifying which parts of the event to extract. See the [Options](#options) section for details.

---

## Return Value

The function returns a `Promise` that resolves to a `ReadEventResult` object:

```typescript
interface ReadEventResult {
    body?: any                  // Parsed request body, if requested.
    query?: Record<string, any> // Query parameters, if requested.
    bearerToken?: string        // Authorization header value, if requested.
    params?: Record<string, string> // Route parameters, if requested.
    headers?: Record<string, string> // Custom headers, if requested.
    error?: ApiResponse         // Error details, if an error occurs.
}
```

---

## Options

The `options` parameter allows you to specify which parts of the event to extract. It accepts an array of strings, each corresponding to a specific part of the event. Available options are:

- **`'body'`**  
  Reads and parses the request body.  
  **Error:** Throws an error if the body cannot be read.

- **`'query'`**  
  Extracts query parameters from the URL.  
  **Example Query String:** `?name=John&age=30`  
  **Result:** `{ name: 'John', age: '30' }`

- **`'bearerToken'`**  
  Extracts the `Authorization` header as a bearer token.  
  **Error:** Throws an error if the header is missing.  
  **Example Header:**  
  ```
  Authorization: Bearer <token>
  ```

- **`'param{name}'`**  
  Extracts a specific route parameter by name. Replace `{name}` with the parameter name.  
  **Error:** Throws an error if the parameter is not found.  
  **Example Route:** `/user/:id` with `'paramid'` will extract the `id` parameter.

- **`'header{name}'`**  
  Reads a custom header by name. Replace `{name}` with the header name.  
  **Error:** Throws an error if the header is missing.  
  **Example Header:**  
  ```
  X-Custom-Header: Value
  ```

---

## Usage Examples

### Example 1: Extract Body, Query, and a Bearer Token

```typescript
import { defineEventHandler } from 'h3'
import { readEvent } from '@/utils/readEvent'

export default defineEventHandler(async (event) => {
    const { body, query, bearerToken, error } = await readEvent(event, ['body', 'query', 'bearerToken'])

    if (error) {
        return error // Return the formatted error response
    }

    return {
        body,
        query,
        bearerToken,
    }
})
```

---

### Example 2: Extract Specific Route Parameters and Headers

```typescript
export default defineEventHandler(async (event) => {
    const { params, headers, error } = await readEvent(event, ['paramid', 'headerX-Custom-Header'])

    if (error) {
        return error
    }

    return {
        id: params?.id,
        customHeader: headers?.['X-Custom-Header'],
    }
})
```

---

## Error Handling

Errors encountered during data extraction (e.g., missing parameters or headers) are caught and returned in the `error` property of the result object. The `error` follows the `ApiResponse` structure and can be returned directly to the user.

### Example Error Structure

```json
{
    "ok": false,
    "status": 400,
    "statusText": "Parameter id is missing",
    "feedback": {
        "message": "Parameter id is missing",
        "type": "error"
    }
}
```

To customize the error messages, you can modify the error-handling logic in the function.

---

## Customization

You can adapt the function to include additional options or return specific error messages to better suit your application's needs.

```typescript
if (option === 'customOption') {
    // Add your custom logic here
}
```

---

## Notes

- The function ensures default initialization for `params` and `headers` to avoid null or undefined references.
- It uses `Promise.all` for asynchronous handling of multiple options, improving performance when extracting data concurrently.
- For detailed information about the `H3Event` object, refer to the [H3 documentation](https://github.com/unjs/h3#event-object).
- This function is designed to integrate seamlessly with Nuxt's [Nitro backend](https://nuxt.com/docs/guide/directory-structure/server).

---

## Related Documentation

- [H3 Event Object](https://github.com/unjs/h3#event-object) (for details on `H3Event`)
- [Nuxt Nitro Backend](https://nuxt.com/docs/guide/directory-structure/server) (for server-related features)
- Custom `ApiResponse` Type: Documented internally in your project

---

### Summary

This Markdown file is complete and ready for you to paste directly into a `.md` file. There’s no mix of formats—it’s all in Markdown syntax. Let me know if anything still needs clarification!