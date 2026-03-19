{
  description = "Nix flake for arcill (Nuxt + Cloudflare)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShell = pkgs.mkShell {
          name = "arcill-dev";
          buildInputs = with pkgs; [
            nodejs
            nodePackages.npm
            wrangler
            curl
            unzip
            direnv
            xdg-utils
          ];
          shellHook = ''
            echo "Welcome to the arcill development environment!"
          '';
        };
      });
}
