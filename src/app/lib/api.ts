import axios, { type AxiosResponse } from 'axios'
import type {
  RegisterDto,
  LoginUserDto,
  UpdateUserDto,
  PaginationQueryDto,
  ReactivateAccountDto,
  GetProjectsDto,
  CreateProjectDto,
  UpdateProjectDto,
  ApplyProjectDto,
  User,
  Project,
  ProjectMember,
  ProjectApplication,
  ProjectResponseDto,
  RegisterMetadata,
  PaginatedResponse,
  PaginatedApplicationsResponse,
  ApiSuccess,
} from '@/types'

// ─── Client ──────────────────────────────────────────────────────────────────

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,           // sends the HttpOnly cookies automatically
  headers: { 'Content-Type': 'application/json' },
})

// ─── Response interceptor ────────────────────────────────────────────────────
// The backend wraps every success as { success: true, data: T }
// This interceptor unwraps it so callers get T directly.

httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiSuccess<unknown>>) => {
    // Unwrap { success, data } → return data as the response payload
    if (response.data && response.data.success === true) {
      response.data = response.data.data as ApiSuccess<unknown>
    }
    return response
  },
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean }

    // 401 → try one refresh, then redirect to /login
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await httpClient.post('/auth/refresh')
        return httpClient(original)
      } catch {
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  /** POST /api/auth/register */
  register: (body: RegisterDto) =>
    httpClient.post<{ id: string; email: string; fullName: string; professionalRole: string }>(
      '/auth/register',
      body,
    ),

  /** POST /api/auth/login — sets HttpOnly cookies */
  login: (body: LoginUserDto) =>
    httpClient.post<{ message: string }>('/auth/login', body),

  /** POST /api/auth/logout */
  logout: () =>
    httpClient.post<{ message: string }>('/auth/logout'),

  /** POST /api/auth/refresh */
  refresh: () =>
    httpClient.post<{ message: string }>('/auth/refresh'),
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  /** GET /api/users/me */
  getMe: () =>
    httpClient.get<User>('/users/me'),

  /** GET /api/users/:id */
  getById: (id: string) =>
    httpClient.get<User>(`/users/${id}`),

  /** GET /api/users?limit&offset&search */
  getPublic: (params?: PaginationQueryDto) =>
    httpClient.get<PaginatedResponse<Pick<User, 'id' | 'fullName' | 'createdAt'>>>(
      '/users',
      { params },
    ),

  /** PATCH /api/users/updateProfile */
  updateProfile: (body: UpdateUserDto) =>
    httpClient.patch<User>('/users/me', body),

  /** PATCH /api/users/deactivate */
  deactivate: () =>
    httpClient.patch<{ message: string }>('/users/deactivate'),

  /** PATCH /api/users/reactivate */
  reactivate: (body: ReactivateAccountDto) =>
    httpClient.patch<{ message: string }>('/users/reactivate', body),
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsApi = {
  /** POST /api/projects */
  create: (body: CreateProjectDto) =>
    httpClient.post<ProjectResponseDto>('/projects', body),

  /** GET /api/projects */
  getAll: (params?: GetProjectsDto) =>
    httpClient.get<PaginatedResponse<Project>>('/projects', { params }),

  /** GET /api/projects/:id */
  getById: (id: string) =>
    httpClient.get<Project>(`/projects/${id}`),

  /** PATCH /api/projects/:id */
  update: (id: string, body: UpdateProjectDto) =>
    httpClient.patch<Project>(`/projects/${id}`, body),

  /** DELETE /api/projects/:id */
  remove: (id: string) =>
    httpClient.delete<{ message: string }>(`/projects/${id}`),

  /** GET /api/projects/:id/members */
  getMembers: (id: string) =>
    httpClient.get<ProjectMember[]>(`/projects/${id}/members`),

  /** POST /api/projects/:id/apply */
  apply: (id: string, body: ApplyProjectDto) =>
    httpClient.post<ProjectApplication>(`/projects/${id}/apply`, body),

  /** GET /api/projects/:id/applications */
  getApplications: (id: string, params?: { page?: number; limit?: number }) =>
    httpClient.get<PaginatedApplicationsResponse>(
      `/projects/${id}/applications`,
      { params },
    ),

  /** PATCH /api/projects/applications/:id/accept */
  acceptApplication: (applicationId: string) =>
    httpClient.patch<{ message: string }>(
      `/projects/applications/${applicationId}/accept`,
    ),

  /** PATCH /api/projects/applications/:id/reject */
  rejectApplication: (applicationId: string) =>
    httpClient.patch<{ message: string }>(
      `/projects/applications/${applicationId}/reject`,
    ),

  /** GET /api/projects/applied — authenticated user's applications */
  getApplied: () =>
    httpClient.get<ProjectApplication[]>('/projects/applied'),

  /** GET /api/projects/discover */
  discover: () =>
    httpClient.get<(Project & { score: number })[]>('/projects/discover'),
}

// ─── Follows ──────────────────────────────────────────────────────────────────

export const followsApi = {
  /** POST /api/follows/:id */
  follow: (id: string) =>
    httpClient.post(`/follows/${id}`),

  /** DELETE /api/follows/:id */
  unfollow: (id: string) =>
    httpClient.delete<{ message: string }>(`/follows/${id}`),

  /** GET /api/follows/users/:id/followers */
  getFollowers: (id: string) =>
    httpClient.get<{ follower: User[] }>(`/follows/followers/${id}`),

  /** GET /api/follows/users/:id/following */
  getFollowing: (id: string) =>
    httpClient.get<{ following: User[] }>(`/follows/following/${id}`),
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadataApi = {
  /** GET /api/metadata/register */
  getRegisterMetadata: () =>
    httpClient.get<RegisterMetadata>('/metadata/register'),
}
