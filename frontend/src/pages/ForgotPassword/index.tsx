import React, { useCallback, useRef, useState } from 'react'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'

import { useToast } from '../../hooks/toast'

import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/input'
import Button from '../../components/button'
import { Container, Content, Background, AnimationContainer } from './styles'
import api from '../../services/api'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const [loading,setLoading] = useState(false)

  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true)
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email necessario')
            .email('digite um email valido'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await api.post('/password/forgot',data.email)

        addToast({
          type:'success',
        title:'Email enviado com sucesso.',
        description:'acesse sua caixa de email para resetar sua senha'
      })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
          return
        }
        addToast({
          type: 'error',
          title: 'erro ao resetar senha',
          description:
            'ocorreu um erro ao resetar senha, tente novamente',
        })
      }finally{
        setLoading(false)
      }
    },
    [addToast],
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>recuperar senha</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            
            <Button loading={loading} type="submit">resetar</Button>
          </Form>
          <Link to="/signin">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default ForgotPassword
