import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  span {
    width: 160px;
    border-radius: 4px;
    padding: 8px;
    background: #ff9000;
    font-weight: bold;
    font-size: 14px;

    position: absolute;
    bottom: 150%;
    left: 50%;
    transform: translateX(-50%);
    color: #312e38;

    visibility: hidden;
    opacity: 0;
    transition: opacity 0.4s;

    &::before {
      content: '';
      border-style: solid;
      border-color: #ff9000 transparent;
      width: 6px 6px 0 6px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`
