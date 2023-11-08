import { Container } from "@mui/material";
import React from "react";
import {
  useOpenIDConnectContext,
} from "@epfl-si/react-appauth";

function PleaseLogin() {
  return (
    <Container>
      <h1 style={{ marginTop: '2vw' }}>ATARI</h1>
      <p>Welcome to ATARI !</p>
      <p>
        ATARI stands for <span style={{ color: "red" }}>A</span>nnuaire{" "}
        <span style={{ color: "red" }}>T</span>echnique d’
        <span style={{ color: "red" }}>A</span>ttributs pour{" "}
        <span style={{ color: "red" }}>R</span>esponsables{" "}
        <span style={{ color: "red" }}>I</span>nformatiques.
      </p>
      <p>It is designed to facilitate the search and retrieval of data on EPFL members.<br />
        It provides a simple and efficient way to access relevant information
        about the members, such as their sciper number, gaspar username, units, etc.
      </p>

      <h2>Getting started</h2>
      <p>To get started, you will first need to <a href="#" onClick={useOpenIDConnectContext().login}>Login</a> using
      your GASPAR credentials.</p>
      <p>Then, search someone in the search bar using first name, last name, email, sciper, ...</p>

      <h2>Going further</h2>
      <p>If you want to learn more about this project, you can visit the <a href="https://github.com/epfl-si/atari" target="_blank">GitHub repository</a>.<br />
      If you find a bug or have a feature request, feel free to <a href="https://github.com/epfl-si/ATARI/issues/new" target="_blank">open an issue</a>.</p>
    </Container>
  );
}

export default PleaseLogin;
