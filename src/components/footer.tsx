"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import packageConfig from "../../package.json" with { type: "json" };

export const Footer: React.FC = () => {
  const translations = {
    app: useTranslations("app"),
    footer: useTranslations("pages.footer"),
  };
  const version = packageConfig.version;
  return (
    <footer className="bg-muted">
      <div className="flex flex-wrap container mx-auto px-4 py-6">
        <div className="w-1/2 mx-auto mb-4 md:w-1/4 lg:w-1/6 px-4 md:mx-0 pt-2">
          <Image
            src="https://epfl-si.github.io/elements/svg/epfl-logo.svg"
            alt="Logo EPFL, École polytechnique fédérale de Lausanne"
            className="w-2/3 h-2/3"
            width={97}
            height={28}
          />
        </div>
        <div className="w-full md:w-3/4 lg:w-5/6 mb-4 px-4">
          <div className="ml-0 md:ml-4 lg:ml-8">
            <ul className="flex flex-wrap items-center gap-x-4 text-sm mb-4">
              <a href="mailto:1234@epfl.ch" className="font-medium">
                {translations.footer("gethelp")}
              </a>
              <li className="text-gray-500">EPFL CH-1015 Lausanne</li>
              <li className="text-gray-500">+41 21 693 11 11</li>
            </ul>
            <div className="mt-6 border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-4 text-sm mb-2">
                <Link
                  href="https://www.epfl.ch/about/overview/fr/reglements-et-directives/mentions-legales/"
                  className="hover:underline"
                >
                  {translations.footer("accessibility")}
                </Link>
                <Link
                  href="https://www.epfl.ch/about/overview/fr/reglements-et-directives/mentions-legales/"
                  className="hover:underline"
                >
                  {translations.footer("disclaimer")}
                </Link>
                <Link href="https://go.epfl.ch/protection-des-donnees/" className="hover:underline">
                  {translations.footer("privacy")}
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-sm mb-2">
                <p className="text-xs text-gray-500 mt-2">{translations.app("title")}</p>
                <Link
                  className="text-xs text-gray-500 mt-2"
                  href={`https://github.com/epfl-si/next-starterkit/releases/tag/v${version}`}
                >
                  v{version}
                </Link>
                <p className="text-xs text-gray-500 mt-2"> © 2026 EPFL - {translations.footer("allRightsReserved")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
