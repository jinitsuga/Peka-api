**Signup**

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
      **Content:** `{ success: true, user: [user object] }`

- **Error Response:**

  - **Code:** `400` <br>
    **Reason**: Any required parameters are missign or incorrect.<br>
      **Content:** `Bad request`

- **Notes:**

  The success response includes a cookie with the session key.

**Signin**

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
      **Content:** `{ success: true, user: [User object] }`

- **Error Response:**

  - **Code:** `400` <br>
    **Reason**: Any required parameters are missign or incorrect.<br>
      **Content:** `Bad request`

- **Notes:**

  The success response includes a cookie with the session key.

**Signout**

Signs out the user associated with the request's session cookie.

- **URL**

  `/signout`

- **Method**

  `GET`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `{ success: true }`

- **Error Response:**

  - **Code:** `401` <br>
    **Reason**: There's no active session cookie on the request.<br>
      **Content:** `Unauthorized`

- **Notes:**

  The success response clears the cookie that had the session key.

**Products**

- **URL**

  `/products`

- **Method**

  `GET`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `[Array with all the products in the system]`

**Create Offer**

Creates a new Offer for the user associated with the request's session cookie.

- **URL**

  `/offers`

- **Method**

  `POST`

- **Data Params**
  
  **Required:**

  `quantity: number` <br>
  `quantityUnit: string` <br>
  `type: string` <br>
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

**Update Offer**

Updates an existing Offer of the user associated with the request's session cookie.

- **URL**

  `/offers/:offerId`

- **Method**

  `PUT`

- **Data Params**
  
  **Required:**

  `quantity: number` <br>
  `quantityUnit: string` <br>
  `type: string` <br>
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

**Delete Offer**

Deletes an existing Offer of the user associated with the request's session cookie.

- **URL**

  `/offers/:offerId`

- **Method**

  `DELETE`

- **Success Response:**

  - **Code:** `200` <br>
      **Content:** `{ success: true }`

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

**Get User Offers**

Returns all the Offers of a User.

- **URL**

  `/users/:userId/offers`

- **Method**

  `GET`

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