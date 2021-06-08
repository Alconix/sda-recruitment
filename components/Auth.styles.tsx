import styled from "styled-components";

import { Tabs, Form } from "antd";

export const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  margin-left: 20px;
  margin-right: 20px;
`;

export const Background = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
  display: block;
  background-image: url("/background-sl.jpg");
  background-size: cover;
  height: 100vh;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
  transform: scale(1.1);
`;

export const Paper = styled(Tabs)`
  padding-left: 15px;
  background-color: white;

  position: relative;
  -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  -moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;

  :before,
  :after {
    content: "";
    position: absolute;
    z-index: -1;
    -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
    -moz-box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
    top: 10px;
    bottom: 10px;
    left: 0;
    right: 0;
    -moz-border-radius: 100px / 10px;
    border-radius: 100px / 10px;
  }
  :after {
    right: 10px;
    left: auto;
    -webkit-transform: skew(8deg) rotate(3deg);
    -moz-transform: skew(8deg) rotate(3deg);
    -ms-transform: skew(8deg) rotate(3deg);
    -o-transform: skew(8deg) rotate(3deg);
    transform: skew(8deg) rotate(3deg);
  }
`;

export const StyledForm = styled(Form)`
  width: 20rem;
  height: 18rem;
`;
