import React, { ReactNode, HTMLAttributes } from "react";

// Tabela
interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "", ...props }: TableProps) {
  return <table className={`w-full border-collapse text-sm ${className}`} {...props}>{children}</table>;
}

// Cabeçalho da Tabela
interface TableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className = "", ...props }: TableSectionProps) {
  return <thead className={`bg-gray-100 ${className}`} {...props}>{children}</thead>;
}

export function TableBody({ children, className = "", ...props }: TableSectionProps) {
  return <tbody className={className} {...props}>{children}</tbody>;
}

// Linha da Tabela
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className = "", ...props }: TableRowProps) {
  return <tr className={className} {...props}>{children}</tr>;
}

// Célula de Cabeçalho
interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className = "", ...props }: TableHeadProps) {
  return <th className={`border p-2 text-left ${className}`} {...props}>{children}</th>;
}

// Célula de Dados
interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className = "", ...props }: TableCellProps) {
  return <td className={`border p-2 ${className}`} {...props}>{children}</td>;
}
