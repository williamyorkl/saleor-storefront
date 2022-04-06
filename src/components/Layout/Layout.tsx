// import { Navbar } from "../Navbar";
import React from "react";

export interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="test001">{children}</div>
    </>
  );
}

export default Layout;
