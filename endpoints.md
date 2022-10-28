## Signup

- **URL**

  `/signup`

- **Method**

  `POST`

- **Data Params**
  
  **Required:**

  `name: string` <br>
  `email: string` <br>
  `password: string`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[user object]`

- **Error Response:**

  - **Code:** `400` <br>
    **Reason**: Any required parameters are missign or incorrect.<br>
      **Content:** `Bad request`

  - **Code:** `409` <br>
    **Reason**: The provided email is already in use by another user.<br>
      **Content:** `Conflict`

- **Notes:**

  The success response includes a cookie with the session key.

---

## Signin

- **URL**

  `/signin`

- **Method**

  `POST`

- **Data Params**
  
  **Required:**

  `email: string` <br>
  `password: string`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[User object]`

- **Error Response:**

  - **Code:** `400` <br>
    **Reason**: Any required parameters are missign or incorrect.<br>
      **Content:** `Bad request`

- **Notes:**

  The success response includes a cookie with the session key.

---

## Signout

Signs out the user associated with the request's session cookie.

- **URL**

  `/signout`

- **Method**

  `GET`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `OK`

- **Error Response:**

  - **Code:** `401` <br>
    **Reason**: There's no active session cookie on the request.<br>
      **Content:** `Unauthorized`

- **Notes:**

  The success response clears the cookie that had the session key.

---

## Get Reset Password Token

Sends an email to a User with a tokenized link for reseting their password.

- **URL**

  `/reset-password`

- **Method**

  `POST`

- **Data Params**
  
  **Required:**

  `email: string`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `OK`

- **Error Response:**

  - **Code:** `400` <br>
    **Reason**: Any required parameters are missign or incorrect.<br>
      **Content:** `Bad request`

- **Notes:**

  The success response is sent regardless of if a registered User with the provided email was found or not

---

## Reset Password

Resets the password of a user.

- **URL**

  `/reset-password/:token`

- **Method**

  `POST`

- **Data Params**
  
  **Required:**

  `password: string`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `OK`

- **Error Response:**

  - **Code:** `400` <br>
    **Reason**: Any required parameters are missign or incorrect.<br>
      **Content:** `Bad request`

  - **Code:** `401` <br>
    **Reason**: The provided token has expired.<br>
      **Content:** `Unauthorized`

  - **Code:** `404` <br>
    **Reason**: The provided token is not associated to any User.<br>
      **Content:** `Not found`

---

## Update User

Updates a User's data.

- **URL**

  `/users`

- **Method**

  `PUT`

- **Data Params**
  
  **Required:**

  `name: string` <br>
  `email: string`
  
  **Optional:**

  `password: string`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[Updated User]`

- **Error Response:**

  - **Code:** `400` <br>
    **Reason**: Any required parameters are missign or incorrect.<br>
      **Content:** `Bad request`

  - **Code:** `401` <br>
    **Reason**: There's no active session cookie on the request.<br>
      **Content:** `Unauthorized`

  - **Code:** `404` <br>
    **Reason**: The User does not exist.<br>
      **Content:** `Not found`

  - **Code:** `409` <br>
    **Reason**: The provided email is already in use by another user.<br>
      **Content:** `Conflict`

---

## Products

- **URL**

  `/products`

- **Method**

  `GET`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[Array with all the products in the system]`

---

## Create Offer

Creates a new Offer for the user associated with the request's session cookie.

- **URL**

  `/offers`

- **Method**

  `POST`

- **Data Params**
  
  **Required:**

  `quantity: number` <br>
  `quantityUnit: ['units', 'kilograms', 'grams', 'bundles']` <br>
  `type: ['product', 'seedling', 'seeds']` <br>
  `productId: number` <br>
  
  **Optional:**

  `description: string` <br>
  `pictures: string` <br>

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[Created Offer]`

- **Error Response:**

  - **Code:** `400` <br>
    **Reason**: Any required parameters are missign or incorrect.<br>
      **Content:** `Bad request`

  - **Code:** `401` <br>
    **Reason**: There's no active session cookie on the request.<br>
      **Content:** `Unauthorized`

  - **Code:** `404` <br>
    **Reason**: The selected Product was not found.<br>
      **Content:** `Not found`

---

## Update Offer

Updates an existing Offer of the user associated with the request's session cookie.

- **URL**

  `/offers/:offerId`

- **Method**

  `PUT`

- **Data Params**
  
  **Required:**

  `quantity: number` <br>
  `quantityUnit: ['units', 'kilograms', 'grams', 'bundles']` <br>
  `type: ['product', 'seedling', 'seeds']` <br>
  `productId: number` <br>
  
  **Optional:**

  `description: string` <br>
  `pictures: string` <br>

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[Updated Offer]`

- **Error Response:**

  - **Code:** `400` <br>
    **Reason**: Any required parameters are missign or incorrect.<br>
      **Content:** `Bad request`

  - **Code:** `401` <br>
    **Reason**: There's no active session cookie on the request.<br>
      **Content:** `Unauthorized`

  - **Code:** `403` <br>
    **Reason**: The User associated with the active session cookie on the request is not the owner of the selected Offer.<br>
      **Content:** `Forbidden`

  - **Code:** `404` <br>
    **Reason**: Either the selected Product or the selected Offer were not found.<br>
      **Content:** `Not found`

---

## Delete Offer

Deletes an existing Offer of the user associated with the request's session cookie.

- **URL**

  `/offers/:offerId`

- **Method**

  `DELETE`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `OK`

- **Error Response:**

  - **Code:** `401` <br>
    **Reason**: There's no active session cookie on the request.<br>
      **Content:** `Unauthorized`

  - **Code:** `403` <br>
    **Reason**: The User associated with the active session cookie on the request is not the owner of the selected Offer.<br>
      **Content:** `Forbidden`

  - **Code:** `404` <br>
    **Reason**: The selected Offer was not found.<br>
      **Content:** `Not found`

---

## Get User Offers

Returns all the Offers of a User.

- **URL**

  `/users/:userId/offers`

- **Method**

  `GET`

- **URL Params**

  **Optional:**

  `page: number`: Used to indicate what page of results you want.

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[Offers belonging to the selected User]`

- **Error Response:**

  - **Code:** `401` <br>
    **Reason**: There's no active session cookie on the request.<br>
      **Content:** `Unauthorized`

  - **Code:** `404` <br>
    **Reason**: The selected User was not found.<br>
      **Content:** `Not found`

- **Notes:**

  If no `page` is specified then the first page of results will be returned.

  The page size for this endpoint is 12 elements.

---

## Search Offers

Searches for Offers that meet a given criteria.

- **URL**

  `/offers/search`

- **Method**

  `GET`

- **URL Params**

  **Optional:**

  `products: string`: Used for specifying the products associated with the Offers. <br>
  `types: string`: Used for specifying the types of Offers you want. <br>
  `page: number`: Used to indicate what page of results you want.
  
- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[Array of Offers that match the given criteria]`

- **Error Response:**

  - **Code:** `401` <br>
    **Reason**: There's no active session cookie on the request.<br>
      **Content:** `Unauthorized`

- **Notes:**

  Both the `products` and `types` parameters accept multiple comma-separated values. If multiple values are used the results will include Offers that match any of the given values.

  If no `products` or `types` are specified then an empty array is returned. If you want all available Offers, use the "Get All Offers" endpoint.

  If no `page` is specified then the first page of results will be returned.

  The page size for this endpoint is 12 elements.

---

## Get All Offers

Gets all Offers on the system.

- **URL**

  `/offers`

- **Method**

  `GET`

- **URL Params**

  **Optional:**

  `page: number`: Used to indicate what page of results you want.

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[Array of all Offers on the system]`

- **Error Response:**

  - **Code:** `401` <br>
    **Reason**: There's no active session cookie on the request.<br>
      **Content:** `Unauthorized`

- **Notes:**

  If no `page` is specified then the first page of results will be returned.

  The page size for this endpoint is 12 elements.
