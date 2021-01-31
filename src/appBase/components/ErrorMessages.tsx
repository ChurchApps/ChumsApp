import React from "react";

interface Props {
    errors: string[]
}

export const ErrorMessages: React.FC<Props> = props => {
    const items = [];
    var result = <></>
    if (props.errors != null && props.errors.length > 0) {
        for (var i = 0; i < props.errors.length; i++) items.push(<li key={i.toString() || props.errors[i].slice(0, 10)}>{props.errors[i]}</li>);
        result = <div className="alert alert-warning" role="alert"><ul>{items}</ul></div>;
    }
    return result;
}