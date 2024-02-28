import styled from 'styled-components';

const Input = styled('input').withConfig({
  shouldForwardProp: (prop) => !['editable'].includes(prop),
})`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  padding: 0.8rem 1.2rem;
`;

export default Input;