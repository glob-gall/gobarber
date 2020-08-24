import React, { useCallback, useRef } from 'react'
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native'
import * as Yup from 'yup'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.png'
import { Container, Title, BackToSignIn, BackToSignInText } from './styles'
import api from '../../services/api'
import Input from '../../components/Input'
import Button from '../../components/Button'

interface SignInFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const navigation = useNavigation()

  const emailTextInput = useRef<TextInput>(null)
  const passwordTextInput = useRef<TextInput>(null)

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
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
        await api.post('/users', data)
        Alert.alert(
          'Cadastro realizado com sucesso',
          'você ja pode fazer login na aplicação',
        )
        navigation.navigate('SignIn')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }

        Alert.alert('Erro no cadastro', 'Ocorreu um erro ao fazer o cadastro,')
      }
    },
    [navigation],
  )

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu cadastro</Title>
            </View>
            <Form onSubmit={handleSubmit} ref={formRef}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailTextInput.current?.focus()
                }}
              />
              <Input
                ref={emailTextInput}
                name="email"
                icon="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordTextInput.current?.focus()
                }}
              />
              <Input
                ref={passwordTextInput}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm()
                }}
              >
                Crie sua conta
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn onPress={() => navigation.goBack()}>
        <BackToSignInText>
          <Icon name="arrow-left" size={20} color="#f4ede8" />
          Voltar para login
        </BackToSignInText>
      </BackToSignIn>
    </>
  )
}

export default SignUp
