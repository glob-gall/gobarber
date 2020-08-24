import React, { useCallback, useRef, ChangeEvent } from 'react'
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { Link, useHistory } from 'react-router-dom'
import api from '../../services/api'

import { useToast } from '../../hooks/toast'

import Input from '../../components/input'
import Button from '../../components/button'
import getValidationErrors from '../../utils/getValidationErrors'
import { useAuth } from '../../hooks/auth'
import profileImg from '../Dashboard/96d1cf16-71c2-47dc-a313-1b1ddaa637fb.jpg'
import { Container, Content,AvatarInput } from './styles'
interface SignUpFormData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}

const SignUp: React.FC = () => {
  const { addToast } = useToast()
  const formRef = useRef<FormHandles>(null)
  const history = useHistory()

  const {user,updateUser} = useAuth()

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('digite um email valido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password',{
            is:val => !!val.lenght,
            then: Yup.string().required('campo obrigatorio'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string()
          .oneOf([Yup.ref('password'), null], 'confirmação incorreta'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const {name,email,old_password,password,password_confirmation} = data
        
        const formData = {
          name,
          email,
        ...(old_password 
          ? {
              old_password,
              password,
              password_confirmation,
        }
        : {})
      }
      
        
        const response = await api.put('/profile', formData)

        updateUser(response.data)

        history.push('/dashboard')
        addToast({
          type: 'success',
          title: 'Usuario atualiado',
          description:
            'suas informações foram alteradas com sucesso',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }

        addToast({
          type: 'error',
          title: 'atualização mal sucedida',
          description: 'Erro ao atualizar perfil, por favor tente novamente',
        })
      }
    },
    [addToast, history],
  )

  const handleAvatarChange = useCallback((e:ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files){
      const data = new FormData()

      data.append('avatar',e.target.files[0])
      console.log(data);
      
      api.patch('/users/avatar',data).then(response=>{
        updateUser(response.data)
        addToast({
          type:'success',
          title:'avatar atualizado'
        })
      })
    }
    
  },[addToast,updateUser])

  return (
    <Container>
        <header>
          <div>
            <Link to="/dashboard" ><FiArrowLeft/></Link>
          </div>
        </header>
      <Content>
          <Form ref={formRef} initialData={{
            name: user.name,
            email: user.email
          }} onSubmit={handleSignUp}>
            <AvatarInput>
              <img src={user.avatar_url || profileImg} alt={user.name}/>
              <label htmlFor="avatar">
                <FiCamera/>
                <input type="file" id="avatar" onChange={handleAvatarChange}/>
              </label>
            </AvatarInput>
            <h1>Meu perfil</h1>
            <Input name="name" icon={FiUser} placeholder="nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              containerStyle={{marginTop:24}}
              name="old_password"
              icon={FiLock}
              type="Password"
              placeholder="Senha atual"
            />
            <Input
              name="password"
              icon={FiLock}
              type="Password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="Password"
              placeholder="Confirmar  senha"
            />
            <Button type="submit">Confrmar mudanças</Button>
          </Form>
      </Content>
    </Container>
  )
}

export default SignUp
