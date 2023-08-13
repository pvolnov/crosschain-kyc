import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f9f7ef; //linear-gradient(24.19deg, #7c3ae7 2.79%, #8ae6cf 106.96%);
  box-sizing: border-box;
  display: flex;
`;

export const Header = styled.h1`
  color: rgba(30, 24, 42, 1);
  margin: 0;
  font-size: 64px;
  line-height: 64px;
  font-weight: bold;
`;

export const KYCLogo = styled.img`
  background: #00ffb3;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  box-sizing: border-box;
`;

export const Button = styled.button<{ $verified?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
  background: #fdfcff;
  border: 3.6px solid rgba(30, 24, 42, 1);
  box-shadow: 5px 5px 0px 1px rgba(30, 24, 42, 1);
  font-family: "Miriam Libre", sans-serif;
  font-weight: bold;
  font-size: 32px;
  position: relative;
  padding-left: ${(p) => (p.$verified ? 56 : 8)}px;

  img {
    position: absolute;
    left: 4px;
    top: 6px;
  }

  transition: 0.2s transform, 0.2s box-shadow;
  &:active {
    transform: translate(5px, 5px);
    box-shadow: 0 0 0 0 rgba(30, 24, 42, 1);
  }
`;

export const Panel = styled.div`
  background: rgba(47, 40, 59, 1);
  width: 370px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 32px;
`;
