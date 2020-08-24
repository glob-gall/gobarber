import React, { useCallback, useRef } from 'react'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { Link, useHistory } from 'react-router-dom'

import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'

import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/input'
import Button from '../../components/button'
import { Container, Content, Background, AnimationContainer } from './styles'

interface SigInFormData {
  email: string
  password: string
}

const SigIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const history = useHistory()

  const { signIn } = useAuth()
  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async (data: SigInFormData) => {
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email necessario')
            .email('digite um email valido'),
          password: Yup.string().required('Senha necessaria'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await signIn({
          email: data.email,
          password: data.password,
        })
        history.push('/dashboard')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: 'error',
          title: 'erro no login',
          description:
            'ocorreu um erro ao tentar logar, cheque suas credenciais',
        })
      }
    },
    [signIn, addToast, history],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu login</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="Password"
              placeholder="Password"
            />
            <Button type="submit">Entrar</Button>
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Form>
          <Link to="/signup">
            <FiLogIn />
            Criar Conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default SigIn
