import React from "react";
import {
  StateEnum,
  useOpenIDConnectContext,
} from "@epfl-si/react-appauth";


function EPFLHeader() {
  const isLogged = useOpenIDConnectContext().state === StateEnum.LoggedIn || Meteor.user() !== null
  return (
    <header
      role="banner"
      className="header header-light"
      style={{ borderColor: "black", borderWidth: "1px", borderStyle: "solid" }}
    >
      <div className="header-light-content">
        <a className="logo" href="/">
          <img
            src="https://www.epfl.ch/about/overview/wp-content/uploads/2020/07/logo-epfl-1024x576.png"
            alt="Logo EPFL, École polytechnique fédérale de Lausanne"
            className="img-fluid"
          />
        </a>

        <p className="site-title">
          <a href="/">ATARI</a>
        </p>

        <nav className="nav-lang-short">
          <ul>
            <li>
              <a href="/inv" target="_blank">
                Inventaire
              </a>
            </li>
          </ul>
        </nav>

        <form action="#" className="d-xl-none">
          <a
            id="search-mobile-toggle"
            className="search-mobile-toggle searchform-controller"
            href="#"
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-search"></use>
            </svg>

            <span className="toggle-label sr-only">
              Afficher / masquer le formulaire de recherche
            </span>
          </a>

          <div className="input-group search-mobile" role="search">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-search"></use>
                </svg>
              </span>
            </div>

            <label htmlFor="search" className="sr-only">
              Rechercher sur le site
            </label>

            <input
              type="text"
              className="form-control"
              name="search"
              placeholder="Rechercher"
            />

            <div className="input-group-append">
              <a
                id="search-mobile-close"
                className="search-mobile-close searchform-controller"
                href="#"
              >
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-close"></use>
                </svg>

                <span className="toggle-label sr-only">
                  Masquer le formulaire de recherche
                </span>
              </a>
            </div>
          </div>
        </form>

        <div className="dropdown dropright search d-none d-xl-block">
          <a className="dropdown-toggle" href="#" data-toggle="dropdown">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-search"></use>
            </svg>
          </a>

          <form action="#" className="dropdown-menu border-0 p-0">
            <div className="search-form mt-1 input-group">
              <label htmlFor="search" className="sr-only">
                Rechercher sur le site
              </label>

              <input
                type="text"
                className="form-control"
                name="search"
                placeholder="Rechercher"
              />

              <button
                type="submit"
                className="d-none d-xl-block btn btn-primary input-group-append"
              >
                Valider
              </button>
            </div>
          </form>
        </div>

        <nav className="nav-lang nav-lang-short ml-auto">
          <ul>
            <li className="nav-item">
              <span>
                {isLogged ? <a href="#" onClick={useOpenIDConnectContext().logout}>
                    Logout
                  </a> : 
                  <a href="#" onClick={useOpenIDConnectContext().login}>
                    Login
                  </a>
                  }
              </span>
            </li>
            <li>
              <span className="active" aria-label="Français">
                FR
              </span>
            </li>

            <li>
              <a href="#" aria-label="English">
                EN
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default EPFLHeader;
