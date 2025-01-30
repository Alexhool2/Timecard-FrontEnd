import { ConflictError, UnauthorizedError } from "../errors/http_errors"

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
  })
  if (response.ok) {
    return response
  } else {
    const errorBody = await response.json()
    const errorMessage = errorBody.error
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage)
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage)
    } else {
      throw Error(
        "Request failed with status " +
          response.status +
          "message:" +
          errorMessage
      )
    }
  }
}
// export interface LoggedInUser {
//   id: number
//   userName: string
// }

export interface LoginCredentials {
  userName: string
  password: string
}

export interface LoggedUser {
  id: number
  userName: string
}

export async function login(
  credentials: LoginCredentials
): Promise<LoggedUser> {
  const response = await fetchData("http://localhost:8081/api/v1/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(credentials),
  })

  const data = await response.json()
  console.log(data)

  const user: LoggedUser = {
    id: data.user.id,
    userName: data.user.userName,
  }

  return user
}
export interface LoggedInUser {
  id: number
  firstName: string
  lastName: string
  userName: string
  email: string
  isAdmin: boolean
  createdAt: string
  role: string
}

export async function getLoggedInUser(): Promise<{
  user: LoggedUser | null
  eventID: number | null
}> {
  const response = await fetchData("http://localhost:8081/api/v1/users/me", {
    method: "GET",
    credentials: "include",
  })
  const data = await response.json()
  console.log("Response from API:", data) // Debugging

  return {
    user: data.user || null,
    eventID: data.eventID === -1 ? null : data.eventID,
  }
}

export async function logout() {
  const response = await fetchData(
    "http://localhost:8081/api/v1/users/logout",
    {
      method: "POST",
      credentials: "include",
    }
  )

  return response.json()
}
