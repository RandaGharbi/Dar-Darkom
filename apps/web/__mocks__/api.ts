// Mock pour lib/api
export const api = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

export const authAPI = {
  login: jest.fn(),
  signup: jest.fn(),
  getMe: jest.fn(),
  logout: jest.fn(),
};

export const productsAPI = {
  getAll: jest.fn(),
  getByType: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  import: jest.fn(),
  deleteAll: jest.fn(),
};

export const ordersAPI = {
  getAll: jest.fn(),
  getById: jest.fn(),
  getByUser: jest.fn(),
  getActive: jest.fn(),
  getHistory: jest.fn(),
  updateStatus: jest.fn(),
};

export const usersAPI = {
  getAll: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const discountsAPI = {
  getAll: jest.fn(),
  getByCollection: jest.fn(),
  getByCode: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  useCode: jest.fn(),
};

export const favoritesAPI = {
  getAll: jest.fn(),
  getByUser: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  toggle: jest.fn(),
  check: jest.fn(),
  clear: jest.fn(),
};

export const cardsAPI = {
  getByUser: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const activitiesAPI = {
  getByUser: jest.fn(),
  create: jest.fn(),
};