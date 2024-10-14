import styled from "styled-components";

export const LogViewerContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  overflow-x: auto;
  max-width: 100vw;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  min-width: 600px;
  @media (max-width: 1440px) {
    min-width: 100%; /* Allow the table to shrink */
    font-size: 14px; 
  }

  @media (max-width: 1024px) { 
    min-width: auto; /* Allow more shrinking on smaller screens */
    font-size: 12px; 
  }
`;

export const TableHeader = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  word-wrap: break-word;
  @media (max-width: 1440px) {
    padding: 8px;
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    font-size: 12px;
    padding: 6px;
  }
`;

export const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  white-space: normal;
  word-break: break-all;
  &:first-child {
    min-width: 220px;
    word-break: break-word;
    max-width: 25%;
  }
  &:hover {
    background-color: #f9f9f9;
  }
  @media (max-width: 1440px) {
    padding: 8px;
  }
`;

export const Chevron = styled.span`
  cursor: pointer;
  margin-left: 5px;
  transition: transform 0.2s;
  font-size: 20px;
  margin-right: 5px;
  position: relative;
  ${({ expanded }) => expanded
    ? `transform: rotate(90deg); top: -5px;`
    : `top: 0;`}
`;

export const LogRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2; 
  }
  &:nth-child(odd) {
    background-color: white;
  }

  transition: background-color 0.2s;
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
  color: #888;
`;
