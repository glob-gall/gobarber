import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.div`
  height: 100vh;
  

  >header{
    height:144px;
    background:#28262e;
    display:flex;
    align-items:center;

    div{
      width:100%;
      max-width:1120px;
      margin:0 auto;

      svg{
        margin-left:20px;
        color:#999591;
        width:24px;
        height:24px;
      }
    }
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  width: 100%;
  align-items: center;
  margin:-176px 0 auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


  form {
    display:flex;
    flex-direction:column;
    margin: 80px 0;
    width: 340px;

    text-align: center;
    h1 {
      font-size:20px;
      text-align:left;
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;
      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

`

export const AvatarInput = styled.div`
  margin-bottom:32px;
  position: relative;
  width:186px;
  align-self:center;
  img{
    width:186px;
    height:186px;
    border-radius:50%;
  }
  label{
    position: absolute;
    width:48px;
    height:48px;
    background:#ff9000;
    border-radius:50%;
    bottom:0;
    border:0;
    right:0;
    transition: background-color 0.2;

    display:flex;
    align-items:center;
    justify-content:center;
    cursor: pointer;
    input{
      display:none;
    }
    svg{
      width:20px;
      height:20px;
      color:#312e38;
    }
    &:hover{
      background:${shade(0.2,'#ff9000')}
    }
  }
`
