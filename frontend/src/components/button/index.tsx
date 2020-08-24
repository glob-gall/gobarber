import React, { ButtonHTMLAttributes } from 'react'
import { Container } from './styles'

type buttonProps = ButtonHTMLAttributes<HTMLButtonElement> &{
  loading?:boolean
}

const Input: React.FC<buttonProps> = ({ children,loading, ...rest }) => {
  return (
    <Container type="button" {...rest}>
      {loading ? 'carregando...' : children}
      
    </Container>
  )
}

export default Input
