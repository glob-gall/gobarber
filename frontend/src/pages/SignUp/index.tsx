import React, { useCallback, useRef } from 'react'
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { Link, useHistory } from 'react-router-dom'
import api from '../../services/api'

import { useToast } from '../../hooks/toast'

import logoImg from '../../assets/logo.svg'
import Input from '../../components/input'
import Button from '../../components/button'
import getValidationErrors from '../../utils/getValidationErrors'
import { Container, Content, Background, AnimatedContainer } from './styles'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const { addToast } = useToast()
  const formRef = useRef<FormHandles>(null)
  const history = useHistory()

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('digite um email valido'),
          password: Yup.string().min(6, 'senha com no minimo 6 digitos'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })
        await api.post('users', data)
        history.push('/')
        addToast({
          type: 'success',
          title: 'Usuario cadastrado',
          description:
            'Usuario cadastrado com sucesso, pronto para fazer login agora.',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }

        addToast({
          type: 'error',
          title: 'Cadastro mal sucedido',
          description: 'Erro ao criar cadastro, por favor tente novamente',
        })
      }
    },
    [addToast, history],
  )

  return (
    <Container>
      <Background />
      <Content>
        <AnimatedContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSignUp}>
            <h1>Faça seu Cadastro</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input
              name="password"
              icon={FiLock}
              type="Password"
              placeholder="Password"
            />
            <Button type="submit">Cadastrar</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para o Login
          </Link>
        </AnimatedContainer>
      </Content>
    </Container>
  )
}

export default SignUp
