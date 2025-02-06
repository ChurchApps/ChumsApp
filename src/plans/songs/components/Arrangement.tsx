import React from "react";


import { ArrangementInterface } from "../../../helpers";



interface Props {
  arrangement: ArrangementInterface;
}



export const Arrangement = (props: Props) => {

  const formatLyrics = () => {
    if (!props.arrangement) return "";
    else {
      let result = props.arrangement.lyrics;
      result = result.replace(/\n/g, "<br />");
      return result;
    }
  }

  return (<>
    <div dangerouslySetInnerHTML={{__html: formatLyrics()}}></div>
  </>)
}

