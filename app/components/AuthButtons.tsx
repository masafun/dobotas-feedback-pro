import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter, FaApple } from "react-icons/fa6";
import React from "react";

/**
 * Simple vertical sign‑up button group that replicates the sample icons.
 * Google: official multicolour "G" / X: black "X" / Apple: Apple logo
 * Requires: `npm i react-icons`
 */
export default function AuthButtons() {
  return (
    <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
      {/* --- E‑mail sign‑up ------------------------------------------------ */}
      <Button className="w-full h-12 text-base" variant="default">
        <Mail className="mr-2 h-5 w-5" />
        メールで登録
      </Button>

      {/* --- Google sign‑up ----------------------------------------------- */}
      <Button className="w-full h-12 text-base" variant="outline">
        <FcGoogle className="mr-2 h-5 w-5" />
        Googleで登録
      </Button>

      {/* --- X (Twitter) sign‑up ------------------------------------------- */}
      <Button className="w-full h-12 text-base" variant="outline">
        <FaXTwitter className="mr-2 h-5 w-5" />
        X（Twitter）で登録
      </Button>

      {/* --- Apple sign‑up -------------------------------------------------- */}
      <Button className="w-full h-12 text-base" variant="outline">
        <FaApple className="mr-2 h-5 w-5" />
        Appleで登録
      </Button>
    </div>
  );
}
