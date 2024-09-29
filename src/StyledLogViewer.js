import styled from "styled-components";

export const LogViewerContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

export const TableHeader = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd; /* Add bottom border for separation */
`;

export const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
`;

export const Chevron = styled.span`
  cursor: pointer;
  margin-left: 5px;
  transition: transform 0.2s;
  ${({ expanded }) => expanded && `transform: rotate(90deg);`}
`;

export const LogRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
  transition: background-color 0.2s; /* Add transition for smoother hover effect */
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
  color: #888; /* Gray color for the loading text */
`;
