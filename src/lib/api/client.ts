import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

export class ApiError extends Error {
  readonly isNetwork: boolean
  readonly status?: number

  constructor(message: string, options?: { isNetwork?: boolean; status?: number }) {
    super(message)
    this.name = 'ApiError'
    this.isNetwork = options?.isNetwork ?? false
    this.status = options?.status
  }
}

export function isNetworkApiError(error: unknown): boolean {
  return error instanceof ApiError && error.isNetwork
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail
    const isNetwork =
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      !error.response

    let message = error.message ?? 'Error de conexión con el servidor'

    if (isNetwork) {
      message =
        'No se pudo conectar con el servidor. Verificá que el backend esté en ejecución (puerto 8000).'
    } else if (typeof detail === 'string') {
      message = detail
    } else if (Array.isArray(detail)) {
      message = detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join('. ')
    } else if (error.response?.status === 500) {
      message = 'Error interno del servidor. Verificá que la base de datos esté en ejecución.'
    }

    return Promise.reject(
      new ApiError(message, {
        isNetwork,
        status: error.response?.status,
      }),
    )
  },
)
