import styled, { css } from 'styled-components'

import Tooltip from '../tooltip'

interface ContainerProps {
  isFocused: boolean
  isFilled: boolean
  isErrored: boolean
}

export const Container = styled.div<ContainerProps>`
  background: #212329;
  border-radius: 10px;
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  border: 2px solid #212329;
  color: #666360;
  transition: border-color 0.3s;
  transition: color 0.3s;

  & + div {
    margin-top: 8px;
  }

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}
  ${(props) =>
    props.isFocused &&
    css`
      border-color: #ff9000;
      color: #ff9000;
    `}
  ${(props) =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}

  input {
    border: 0;
    flex: 1;
    color: #f4ede8;
    background: transparent;
    &::placeholder {
      color: #666370;
    }
  }
  svg {
    margin-right: 16px;
  }
`

export const Error = styled(Tooltip)`
  position: relative;
  margin-left: 16px;
  height: 20px;

  svg {
    margin: 0;
  }
  span {
    background: #c53030;
    color: #fff;

    ::before {
      border-color: #c53030 transparent;
    }
  }
`
