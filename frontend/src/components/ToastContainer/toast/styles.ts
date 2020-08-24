import styled, { css } from 'styled-components'

import { animated } from 'react-spring'

interface ToastProps {
  type?: 'success' | 'error' | 'info'
  hasDescription: Number
}

const toastColorsVariatons = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
}

export const Container = styled(animated.div)<ToastProps>`
  width: 360px;

  padding: 16px 16px 32px 16px;
  border-radius: 10px;

  position: relative;
  display: flex;

  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  ${(props) => toastColorsVariatons[props.type || 'info']}

  & + div {
    margin-top: 8px;
  }

  div {
    flex: 1;
    p {
      margin-top: 8px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }
  > svg {
    margin: 4px 12px 0 0;
  }
  button {
    position: absolute;
    top: 20px;
    right: 16px;
    opacity: 0.6;
    border: none;
    background: transparent;
    color: inherit;
  }

  ${(props) =>
    !props.hasDescription &&
    css`
      align-items: center;
      svg {
        margin-top: 0;
      }
    `}
`
