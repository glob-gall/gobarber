import React from 'react'
import { render, fireEvent, wait } from '@testing-library/react'
import SignIn from '../../pages/SignIn'

const mockHistoryPush = jest.fn()
const mockSignIn = jest.fn()
const mockedAddToast = jest.fn()

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  }
})
jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockSignIn,
    }),
  }
})
jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  }
})

describe('signIn page', () => {
  beforeEach(() => {
    mockHistoryPush.mockClear()
  })

  it('shold be able to signIn', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Password')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'email@email.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await wait(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shold not be able to signIn with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Password')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'invalid-email' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await wait(() => {
      expect(mockHistoryPush).not.toHaveBeenCalled()
    })
  })
  it('shold display an error if signIn fails', async () => {
    mockSignIn.mockImplementation(() => {
      throw new Error()
    })

    const { getByPlaceholderText, getByText } = render(<SignIn />)

    const emailField = getByPlaceholderText('E-mail')
    const passwordField = getByPlaceholderText('Password')
    const buttonElement = getByText('Entrar')

    fireEvent.change(emailField, { target: { value: 'email@email.com' } })
    fireEvent.change(passwordField, { target: { value: '123456' } })

    fireEvent.click(buttonElement)

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      )
    })
  })
})
