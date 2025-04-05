## 🧾 API ROUTES DOCUMENTATION

---

### 🔐 `GET /api/user`
**Description:** Retrieves the authenticated user's info.

- **Headers:**
  - `Authorization: Bearer <Firebase ID Token>`

- **Returns:**  
  `200 OK`  
  ```ts
  IUserInfo | null
  ```

- **IUserInfo interface:**
  ```ts
  interface IUserInfo {
    id: number;
    name: string;
    email: string;
    avatar: string;
    courses: string[];
    university: string;
    chatHistory: IChatHistoryChat[];
  }
  ```

---

### 🔐 `GET /api/courses/`
**Description:** Fetches the list of courses available to the user using the authentication (logged in user token).

- **Headers:**
  - `Authorization: Bearer <Firebase ID Token>`

- **Returns:**  
  `200 OK`  
  ```ts
  string[] // array of course names
  ```

---

### 🔐 `GET /api/chat/:chatId`
**Description:** Retrieves a specific chat by its ID authenticated by the logged in user, as only the user that owns the chat can retrieve the chat.

- **Headers:**
  - `Authorization: Bearer <Firebase ID Token>`

- **Params:**
  - `chatId: number`

- **Returns:**  
  `200 OK`  
  ```ts
  IChatInfo
  ```

- **IChatInfo:**
  ```ts
  interface IChatInfo {
    id: number;
    name: string;
    messages: IMessage[];
    courseName: string;
    university: string;
    userId: number;
  }

  enum Role {
    user = "User",
    assistant = "Assistant"
  }

  interface IMessage {
    id: string;
    content: string;
    role: Role;
    timestamp: string; // ISO date string
  }
  ```

---

### 🔐 `POST /api/login`
**Description:** Authenticates a user with email and password.

- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- **Returns:**  
  `200 OK`  
  ```ts
  IUserInfo
  ```

- **IUserInfo interface:**
  ```ts
  interface IUserInfo {
    id: number;
    name: string;
    email: string;
    avatar: string;
    courses: string[];
    university: string;
    chatHistory: IChatHistoryChat[];
  }
  ```
---


### 🔐 `POST /api/user/avatar`
**Description:** Updates the user's avatar based on logged in user.

- **Headers:**
  - `Authorization: Bearer <Firebase ID Token>`

- **Body:**
  ```json
  {
    "avatar": "https://cdn.example.com/avatar.jpg"
  }
  ```

- **Returns:**  
  `200 OK`  
  ```ts
  IUserInfo
  ```

- **IUserInfo interface:**
  ```ts
  interface IUserInfo {
    id: number;
    name: string;
    email: string;
    avatar: string;
    courses: string[];
    university: string;
    chatHistory: IChatHistoryChat[];
  }
  ```
---
