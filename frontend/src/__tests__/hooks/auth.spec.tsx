import { renderHook, act } from '@testing-library/react-hooks'
import MockAdapter from 'axios-mock-adapter'
import { useAuth, AuthProvider } from '../../hooks/auth'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

describe('Auth hook', () => {
  it('sholb be able to login', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'joao',
        email: 'teste@teste.com',
      },
      token: 'token',
    }

    apiMock.onPost('sessions').reply(200, apiResponse)
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    result.current.signIn({
      email: 'teste@teste.com',
      password: '123456',
    })
    await waitForNextUpdate()
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    )
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    )
    expect(result.current.user.email).toEqual('teste@teste.com')
  })

  it('shold be able to restore data from storage when user is loged', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token'
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'joao',
            email: 'teste@teste.com',
          })
        default:
          return null
      }
    })
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })
    expect(result.current.user.email).toEqual('teste@teste.com')
  })

  it('shold be able to signOut', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token'
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'joao',
            email: 'teste@teste.com',
          })
        default:
          return null
      }
    })

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.signUp()
    })

    expect(removeItemSpy).toHaveBeenCalledTimes(2)
    expect(result.current.user).toBeUndefined()
  })

  it('shold be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    const user = {
      id: 'user123',
      name: 'joao',
      email: 'teste@teste.com',
      avatar_url: 'avatar.url',
    }

    act(() => {
      result.current.updateUser(user)
    })

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    )
    expect(result.current.user).toEqual(user)
  })
})
