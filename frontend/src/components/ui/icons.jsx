import React from 'react';
import { IoMailOpenOutline } from 'react-icons/io5';
import { TbLockPassword } from "react-icons/tb";

export const EmailIcon = () => <IoMailOpenOutline />;
export const PasswordIcon = () => <TbLockPassword />;

export const SomeIconComponent = ({ type }) => {
  return (
    <div>
      {type === "email" ? <EmailIcon /> : null}
      {type === "password" ? <PasswordIcon /> : null}
    </div>
  );
}