"use client";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "./language";

export const Header: React.FC<{ user: User | undefined }> = ({ user }) => {
  const translations = {
    navigation: useTranslations("navigation"),
    app: useTranslations("app"),
  };

  return (
    <header className="text-primary-secondary py-2 px-2 sm:py-3 sm:px-6 flex items-center justify-between border-b-2 border-0 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-4 p-1 sm:p-3">
          <Image
            src="https://epfl-si.github.io/elements/svg/epfl-logo.svg"
            alt="EPFL"
            width={97}
            height={28}
            className="h-4 sm:h-7"
          />
          <span className="border-l-2 border-solid sm:h-6 h-4 w-1 border-gray-300"></span>
          <Link href="/" className="text-black hover:text-primary">
            <h1 className="text-base sm:text-2xl font-bold -ml-1 sm:ml-0">{translations.app("title")}</h1>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        {user ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-1.5">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    className="inline-block w-8 h-8 rounded-full ml-2"
                    width="30"
                    height="30"
                  />
                ) : (
                  <CircleUserRound className="w-8 h-8 text-muted-foreground " strokeWidth={1} />
                )}
                <p className="text-primary-secondary text-sm sm:text-base font-medium">{user.name}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem onSelect={() => signOut({ redirectTo: "/" })}>
                {translations.navigation("signout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => signIn("microsoft-entra-id", { redirectTo: "/" })}
              className="text-muted-foreground hover:text-foreground hover:cursor-pointer font-medium"
            >
              {translations.navigation("signin")}
            </button>
          </div>
        )}
        <LanguageSelector />
      </div>
    </header>
  );
};
