import React from "react";

function Footer() {

  return (
    <div className="bg-gray-100 pt-5">
      <div className="container">
        <footer className="footer-light" role="contentinfo">
          <div className="row">
            <div className="col-6 mx-auto mx-md-0 mb-4 col-md-3 col-lg-2">
              <a href="#">
                <img src="https://www.epfl.ch//campus/services/website//wp-content/themes/wp-theme-2018/assets/svg/epfl-logo.svg?refresh=now"
                  alt="Logo EPFL, École polytechnique fédérale de Lausanne"
                  className="img-fluid"
                  width="154px"
                  height="44px"
                />
              </a>
            </div>
            <div className="col-md-9 col-lg-10 mb-4">
              <div className="ml-md-2 ml-lg-5">
                <ul className="list-inline list-unstyled">
                  <li className="list-inline-item">Contact</li>
                  <li className="list-inline-item text-muted pl-3"><small>EPFL CH-1015 Lausanne</small></li>
                  <li className="list-inline-item text-muted pl-3"><small>+41 21 693 11 11</small></li>
                </ul>
                <div className="footer-light-socials">
                  <p className="footer-title footer-title-no-underline">Follow EPFL on social media</p>

                  <ul className="social-icon-list list-inline">
                    <li>
                      <a href="https://www.facebook.com/epflcampus" className="social-icon social-icon-facebook social-icon-negative" target="_blank" rel="nofollow noopener">
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-facebook"></use>
                        </svg>
                        <span className="sr-only">Follow us on Facebook</span>
                      </a>
                    </li>
                    <li>
                      <a href="http://instagram.com/epflcampus" className="social-icon social-icon-instagram social-icon-negative" target="_blank" rel="nofollow noopener">
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-instagram"></use>
                        </svg>
                        <span className="sr-only">Follow us on Instagram</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/school/epfl/" className="social-icon social-icon-linkedin social-icon-negative" target="_blank" rel="nofollow noopener">
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-linkedin"></use>
                        </svg>
                        <span className="sr-only">Follow us on LinkedIn</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://x.com/epfl_en" className="social-icon social-icon-x social-icon-negative" target="_blank" rel="nofollow noopener">
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-x"></use>
                        </svg>
                        <span className="sr-only">Follow us on X</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/user/epflnews" className="social-icon social-icon-youtube social-icon-negative" target="_blank" rel="nofollow noopener">
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref="#icon-youtube"></use>
                        </svg>
                        <span className="sr-only">Follow us on Youtube</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="footer-legal">
                  <div className="footer-legal-links">
                    <a href="https://www.epfl.ch/about/overview/regulations-and-guidelines/disclaimer/">Accessibility</a>
                    <a href="https://www.epfl.ch/about/overview/regulations-and-guidelines/disclaimer/">Disclaimer</a>
                    <a href="https://go.epfl.ch/privacy-policy/">Privacy policy</a>
                  </div>
                  <div>
                    <p>&copy; 2024 EPFL, all rights reserved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
