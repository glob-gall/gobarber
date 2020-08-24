import React, { useCallback, useRef } from 'react'
import { FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { useHistory,useLocation } from 'react-router-dom'


import { useToast } from '../../hooks/toast'

import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/input'
import Button from '../../components/button'
import { Container, Content, Background, AnimationContainer } from './styles'
import api from '../../services/api'

interface ResetPasswordFormData {
  password: string
  password_confirmation:string
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const history = useHistory()

  const {addToast} = useToast()
  const location = useLocation()

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        const schema = Yup.object().shape({
          
          password: Yup.string().required('Senha necessaria'),
          password_confirmation: Yup.string().required('Senha necessaria')
          .oneOf([Yup.ref('password'), null], 'confirmação incorreta'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })
        const {password,password_confirmation} = data
        const token = location.search.replace('?token=','')

        if(!token){
          throw new Error()
        }

        api.post('password/reset',{
          password,
          password_confirmation,
          token
        })
        history.push('/')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: 'error',
          title: 'erro ao resetar a senha',
          description:
            'erro ao resetar senha, tente novamente',
        })
      }
    },
    [ addToast, history,location.search],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>
            <Input
              name="password"
              icon={FiLock}
              type="Password"
              placeholder="New password"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="Password"
              placeholder="Password confirmation"
            />
            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default ResetPassword
