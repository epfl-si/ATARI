import React, { useEffect } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function CopyButton(props:{text}) {
  return (
    <>
        <a
        style={{ float: "right", cursor: "copy" }}
        className="btn btn-secondary tag tag-primary"
        onClick={async () => {
            console.log(await navigator.clipboard.writeText(props.text.toString()))
            console.log("typof", typeof navigator.clipboard.readText);
            navigator.clipboard.writeText(props.text.toString()).then(
                () => {
                    toast("🦄 Text copied!")
                },
                () => {
                    toast("😢 An error occurred during the copy process", {
                    autoClose: 5000,
                    });
                }
            );
        }}
        >
        📋
        </a>
      <ToastContainer
        position="top-right"
        autoClose={200}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
    </>
  );
}

export default CopyButton
