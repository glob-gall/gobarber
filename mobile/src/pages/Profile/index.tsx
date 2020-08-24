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
import ImagePicker from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

import getValidationErrors from '../../utils/getValidationErrors'
import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles'
import api from '../../services/api'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/auth'

interface ProfileFormData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()

  const formRef = useRef<FormHandles>(null)
  const navigation = useNavigation()

  const emailTextInput = useRef<TextInput>(null)
  const oldPasswordTextInput = useRef<TextInput>(null)
  const passwordTextInput = useRef<TextInput>(null)
  const confirmPasswordTextInput = useRef<TextInput>(null)

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('digite um email valido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.lenght,
            then: Yup.string().required('campo obrigatorio'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password_confirmation'), null],
            'confirmação incorreta',
          ),
        })

        await schema.validate(data, {
          abortEarly: false,
        })
        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data
        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        }

        const response = await api.put('/profile', formData)
        updateUser(response.data)

        Alert.alert('Perfil atualizado com sucesso')
        navigation.navigate('SignIn')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
          return
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao tentar atualizar o perfil, por favor tente novamente,',
        )
      }
    },
    [navigation, updateUser],
  )

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleAddAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione uma foto',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      (response) => {
        if (response.didCancel) {
          return
        }
        if (response.error) {
          Alert.alert('Erro ao atualizar avatar')
          return
        }
        const source = { uri: response.uri }

        const data = new FormData()
        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        })

        api.patch('user/avatar', data).then((apiResponse) => {
          updateUser(apiResponse.data)
        })
      },
    )
  }, [updateUser, user.id])

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
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={handleAddAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu Perfil</Title>
            </View>
            <Form initialData={user} onSubmit={handleSubmit} ref={formRef}>
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
                  oldPasswordTextInput.current?.focus()
                }}
              />
              <Input
                ref={oldPasswordTextInput}
                name="old_password"
                icon="lock"
                containerStyle={{ marginTop: 18 }}
                placeholder="Senha atual"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordTextInput.current?.focus()
                }}
              />
              <Input
                ref={passwordTextInput}
                name="new_password"
                icon="lock"
                placeholder="Nova Senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordTextInput.current?.focus()
                }}
              />
              <Input
                ref={confirmPasswordTextInput}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar nova senha"
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
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default Profile
