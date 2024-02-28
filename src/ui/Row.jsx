import styled, { css } from 'styled-components';

const Row = styled.div`
  display: flex;
  ${(props) =>
    props.type === 'horizontal' &&
    css`
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    `}
  ${(props) =>
    props.type === 'vertical' &&
    css`
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 1.6rem;
    `}
`;

Row.defaultProps = {
  type: 'vertical',
};

export default Row;