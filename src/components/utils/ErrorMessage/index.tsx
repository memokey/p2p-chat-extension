import React, { FC } from "react";

const  ErrorMessage: FC<any> = ({
    errorMessage
}: {
    errorMessage: String;
}) => {
    return (
        <div className="alert alert-error w-full text-red-800 font-semibold">
            <span>{errorMessage}</span>
        </div>
    );
};

export default ErrorMessage;